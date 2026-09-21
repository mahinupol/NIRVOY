import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, initDB } from './db.js';
import { transcribeAudioWithGoogle, isGoogleSpeechConfigured } from './googleSpeechService.js';
import { extractTextWithGoogleVision } from './googleVisionService.js';
import { predictMedicinesWithChatGPT } from './aiPrescriptionPredictor.js';
import { findMedicineCandidates } from './medicineMatcher.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'nirvoy_secret_jwt_key_2026_secure';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize DB schema on startup
initDB();

// Middleware: Authenticate JWT Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NIRVOY Backend API', timestamp: new Date() });
});

// AI Clinical Chat & Disease / Medicine Predictor via OpenAI Responses API (gpt-5.6-luna)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, prompt } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

    const systemInstructions = `You are NIRVOY AI, an expert clinical decision assistant specialized in healthcare and Bangladeshi pharmaceuticals.
Your task:
1. Analyze user symptoms and clearly identify the likely Disease / Medical Condition.
2. Predict the most suitable medicine(s) from standard Bangladeshi options (e.g., Napa / Paracetamol, Seclo / Omeprazole, Fexo / Fexofenadine, Azithromycin, ORS, etc.) with exact dosage schedule (e.g. 1+0+1 after meals, duration).
3. Provide concise clinical advice (diet, hydration, lifestyle, warnings).
4. Strictly provide 1 to 2 lines of Bangla at the end for immediate patient understanding and safety precaution.

Output format structure:
### 🩺 Identified Condition
[Precise name of the likely condition or disease]

### 💊 Predicted Suitable Medicine
**[Medicine Name & Strength]** (Generic: [Generic Name])
- Dosage: [e.g., 1+0+1 (After meal) for 3-5 days]
- Form: [Tablet / Syrup / Capsule / Sachet]

### 💡 Clinical Advice
- [Advice bullet 1]
- [Advice bullet 2]
- [Emergency red flag warning if any]

### 🇧🇩 প্রয়োজনীয় পরামর্শ (Bangla Summary - strictly 1-2 lines)
[Exactly 1-2 lines in clear Bangla with advice and reminder to consult a registered doctor if symptoms persist.]`;

    let inputPayload;
    if (Array.isArray(messages) && messages.length > 0) {
      inputPayload = messages.map(m => ({
        role: m.sender === 'bot' ? 'assistant' : (m.role || 'user'),
        content: m.text || m.content || ''
      }));
    } else if (prompt) {
      inputPayload = [{ role: 'user', content: prompt }];
    } else {
      return res.status(400).json({ error: 'Missing prompt or messages' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        instructions: systemInstructions,
        input: inputPayload
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI Responses API error:', response.status, errText);
      return res.status(response.status).json({ error: 'AI Service Error: ' + errText });
    }

    const data = await response.json();
    const assistantMsg = data.output?.find(item => item.type === 'message' && item.role === 'assistant');
    const replyText = assistantMsg?.content?.find(c => c.type === 'output_text')?.text || 'No response generated.';

    res.json({
      text: replyText,
      model: model,
      id: data.id
    });
  } catch (err) {
    console.error('Server chat error:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// AI Doctor Consultation Audio Speech Summarizer (gpt-5.6-luna)
app.post('/api/consultation/summarize', async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ error: 'Missing transcript text' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

    const systemInstructions = `You are NIRVOY AI Clinical Assistant. You are summarizing a recorded spoken conversation between a doctor and patient in Bangladesh (which may be in Bangla, English, or mixed Banglish).
Analyze the doctor's speech and extract:
1. Diagnosis & Findings (ডাক্তার কি রোগ বা সমস্যা উল্লেখ করেছেন)
2. Prescribed Medications & Exact Dosage (ওষুধের নাম, খাওয়ার মাত্রা: ১+০+১, নিয়ম: খাওয়ার আগে/পরে, মেয়াদ)
3. Advice & Dietary/Lifestyle Restrictions (কি কি নিষেধ বা খাওয়ার নিয়ম)
4. Recommended Tests & Follow-Up Visit (ল্যাব টেস্ট বা পরবর্তীতে কবে দেখা করতে হবে)
5. Strictly 1 to 2 lines of concise Bangla at the end summarizing the visit for the patient.

Format structure strictly as:
### 🩺 Doctor Findings & Diagnosis
[Bullet points of diagnosed conditions or vital observations]

### 💊 Prescribed Medications & Dosage
- **[Medicine Name & Strength]** — [Dosage schedule e.g., 1+0+1, Meal Timing, Duration]

### ⚠️ Advice & Restrictions
- [Advice or restriction point 1]
- [Advice or restriction point 2]

### 🧪 Follow-up & Tests
- [Tests to do and next appointment date]

### 🇧🇩 প্রয়োজনীয় পরামর্শ (Bangla Summary - strictly 1-2 lines)
[Strictly 1-2 lines in clear Bangla summarizing the key advice for the patient.]`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        instructions: systemInstructions,
        input: transcript
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI Responses API error in consultation:', response.status, errText);
      return res.status(response.status).json({ error: 'AI Service Error: ' + errText });
    }

    const data = await response.json();
    const assistantMsg = data.output?.find(item => item.type === 'message' && item.role === 'assistant');
    const summaryText = assistantMsg?.content?.find(c => c.type === 'output_text')?.text || 'Could not generate summary.';

    res.json({
      text: summaryText,
      model: model,
      id: data.id
    });
  } catch (err) {
    console.error('Consultation summary error:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// Google Cloud Speech-to-Text Status Check
app.get('/api/consultation/stt-status', (req, res) => {
  const isConfigured = isGoogleSpeechConfigured();
  res.json({
    googleSpeechConfigured: isConfigured,
    configured: isConfigured || Boolean(process.env.OPENAI_API_KEY),
    provider: isConfigured 
      ? 'Google Cloud Speech-to-Text v1 (Bengali/English)' 
      : 'OpenAI Whisper Cloud Fallback (Bengali/English)',
    projectId: 'nirvoy-66787'
  });
});

// Google Cloud Speech-to-Text Audio Transcription Endpoint
app.post('/api/consultation/google-transcribe', async (req, res) => {
  try {
    const { audio, mimeType, languageCode } = req.body;
    if (!audio) {
      return res.status(400).json({ error: 'Missing audio base64 payload' });
    }

    const result = await transcribeAudioWithGoogle(audio, {
      mimeType: mimeType || 'audio/webm',
      languageCode: languageCode || 'bn-BD'
    });

    res.json({
      success: true,
      transcript: result.transcript,
      confidence: result.confidence,
      provider: result.provider
    });
  } catch (err) {
    console.error('Audio transcription error:', err);
    res.status(500).json({
      error: 'Audio Transcription Error: ' + err.message
    });
  }
});

// Google Cloud Vision OCR + 21,700+ Dataset Matcher + ChatGPT Prescription Predictor
app.post('/api/prescription/scan-and-predict', async (req, res) => {
  try {
    const { image, mimeType, rawText, fileName } = req.body;

    let ocrResult = { text: rawText || '', lines: [], isGoogleVision: false };
    let base64Clean = null;
    let gVisionRes = null;

    if (image) {
      // 1. Attempt Google Cloud Vision OCR
      base64Clean = image.includes(',') ? image.split(',')[1] : image;
      gVisionRes = await extractTextWithGoogleVision(base64Clean);
      if (gVisionRes && gVisionRes.text) {
        ocrResult = gVisionRes;
      }
    }

    // 2. Predict with Dataset candidate matcher + ChatGPT API (with Multimodal Vision fallback)
    const finalRx = await predictMedicinesWithChatGPT(
      ocrResult.text || rawText || fileName || '',
      ocrResult.lines,
      base64Clean
    );

    res.json({
      success: true,
      prescription: finalRx,
      ocrProvider: ocrResult.isGoogleVision ? 'Google Cloud Vision OCR' : 'NIRVOY AI Multimodal Vision',
      datasetVerified: true,
      googleVisionStatus: {
        active: ocrResult.isGoogleVision,
        activationUrl: gVisionRes?.activationUrl || 'https://console.developers.google.com/apis/api/vision.googleapis.com/overview?project=977940330965',
        disabledReason: gVisionRes?.disabledReason || null
      }
    });
  } catch (err) {
    console.error('Scan & Predict error:', err);
    res.status(500).json({ error: 'Scan & Predict error: ' + err.message });
  }
});

// Quick 21,714 Dataset Search API for autocomplete or direct queries
app.get('/api/prescription/search-dataset', (req, res) => {
  const { q, limit } = req.query;
  const results = findMedicineCandidates(q || '', parseInt(limit) || 6);
  res.json({ count: results.length, results });
});

// Local In-Memory Fallback Store if Database connection is offline
const localUsers = new Map();
const localPatientProfiles = new Map();
const localDoctorProfiles = new Map();

// Seed Demo Doctor
const DEMO_DOCTOR_USER = {
  id: 9999,
  name: 'Dr. MD. Bellal Hossain',
  email: 'doctor@nirvoy.ai',
  password_hash: bcrypt.hashSync('doctor123', 10),
  role: 'doctor',
  created_at: new Date().toISOString()
};
const DEMO_DOCTOR_PROFILE = {
  id: 9999,
  user_id: 9999,
  bmdc_reg: 'BMDC-A-46050',
  specialty: 'Internal Medicine & Respiratory Specialist',
  qualifications: 'MBBS (Dhaka), FCPS (Medicine), MACP (USA)',
  hospital_chamber: 'Mugda Medical College & Hospital, Dhaka',
  phone: '+880 1711-234567',
  consultation_fee: '800 BDT',
  chamber_schedule: 'শনিবার - বৃহস্পতিবার (সন্ধ্যা ৬টা - রাত ৯টা)'
};
localUsers.set('doctor@nirvoy.ai', DEMO_DOCTOR_USER);
localDoctorProfiles.set(9999, DEMO_DOCTOR_PROFILE);

// 1. REGISTER (PATIENT & DOCTOR)
app.post('/api/auth/register', async (req, res) => {
  const {
    name,
    email,
    password,
    role = 'patient',
    // Patient fields
    age,
    height,
    weight_kg,
    gender,
    blood_group,
    chronic_diseases,
    allergies,
    emergency_contact,
    // Doctor fields
    bmdc_reg,
    specialty,
    qualifications,
    hospital_chamber,
    phone,
    consultation_fee,
    chamber_schedule
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email/phone, and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const userRole = role === 'doctor' ? 'doctor' : 'patient';

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Try PostgreSQL first
  try {
    const client = await pool.connect();
    try {
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email/phone already exists' });
      }

      await client.query('BEGIN');
      const userRes = await client.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at`,
        [name.trim(), normalizedEmail, passwordHash, userRole]
      );
      const user = userRes.rows[0];
      let profileData = null;

      if (userRole === 'doctor') {
        const doctorRes = await client.query(
          `INSERT INTO doctor_profiles (
            user_id, bmdc_reg, specialty, qualifications, hospital_chamber, phone, consultation_fee, chamber_schedule
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *`,
          [
            user.id,
            bmdc_reg || null,
            specialty || 'General Physician',
            qualifications || 'MBBS',
            hospital_chamber || null,
            phone || null,
            consultation_fee || null,
            chamber_schedule || null
          ]
        );
        profileData = doctorRes.rows[0];
      } else {
        const diseasesArray = Array.isArray(chronic_diseases) ? chronic_diseases : [];
        const allergiesArray = Array.isArray(allergies) ? allergies : [];
        const profileRes = await client.query(
          `INSERT INTO patient_profiles (
            user_id, age, height, weight_kg, gender, blood_group, 
            chronic_diseases, allergies, emergency_contact
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *`,
          [
            user.id,
            age ? parseInt(age, 10) : null,
            height || null,
            weight_kg ? parseFloat(weight_kg) : null,
            gender || null,
            blood_group || null,
            diseasesArray,
            allergiesArray,
            emergency_contact || null
          ]
        );
        profileData = profileRes.rows[0];
      }

      await client.query('COMMIT');

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(201).json({
        message: `${userRole === 'doctor' ? 'Doctor' : 'Patient'} registration successful`,
        token,
        user,
        profile: profileData,
        doctorProfile: userRole === 'doctor' ? profileData : null
      });
    } catch (dbErr) {
      await client.query('ROLLBACK');
      throw dbErr;
    } finally {
      client.release();
    }
  } catch (dbError) {
    console.warn('Database error during registration, using local fallback:', dbError.message);

    // Check in localUsers
    if (localUsers.has(normalizedEmail)) {
      return res.status(409).json({ error: 'An account with this email/phone already exists' });
    }

    const localId = Date.now();
    const newUser = {
      id: localId,
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      role: userRole,
      created_at: new Date().toISOString()
    };
    localUsers.set(normalizedEmail, newUser);

    let profileData = null;
    if (userRole === 'doctor') {
      profileData = {
        id: localId,
        user_id: localId,
        bmdc_reg: bmdc_reg || 'BMDC-A-99999',
        specialty: specialty || 'General Physician',
        qualifications: qualifications || 'MBBS',
        hospital_chamber: hospital_chamber || 'Medical Consultation Center',
        phone: phone || null,
        consultation_fee: consultation_fee || null,
        chamber_schedule: chamber_schedule || null
      };
      localDoctorProfiles.set(localId, profileData);
    } else {
      profileData = {
        id: localId,
        user_id: localId,
        age: age ? parseInt(age, 10) : null,
        height: height || null,
        weight_kg: weight_kg ? parseFloat(weight_kg) : null,
        gender: gender || null,
        blood_group: blood_group || null,
        chronic_diseases: Array.isArray(chronic_diseases) ? chronic_diseases : [],
        allergies: Array.isArray(allergies) ? allergies : [],
        emergency_contact: emergency_contact || null
      };
      localPatientProfiles.set(localId, profileData);
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      message: `${userRole === 'doctor' ? 'Doctor' : 'Patient'} registration successful (Local Session)`,
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      profile: profileData,
      doctorProfile: userRole === 'doctor' ? profileData : null
    });
  }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Support Demo Doctor Instant Login
    if (normalizedEmail === 'doctor@nirvoy.ai' && password === 'doctor123') {
      const token = jwt.sign(
        { id: DEMO_DOCTOR_USER.id, email: DEMO_DOCTOR_USER.email, name: DEMO_DOCTOR_USER.name, role: 'doctor' },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      return res.json({
        message: 'Demo Doctor Login successful',
        token,
        user: { id: DEMO_DOCTOR_USER.id, name: DEMO_DOCTOR_USER.name, email: DEMO_DOCTOR_USER.email, role: 'doctor' },
        profile: DEMO_DOCTOR_PROFILE,
        doctorProfile: DEMO_DOCTOR_PROFILE
      });
    }

    // 2. Try PostgreSQL
    try {
      const userRes = await pool.query(
        'SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1',
        [normalizedEmail]
      );

      if (userRes.rows.length > 0) {
        const user = userRes.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) {
          let profile = null;
          let doctorProfile = null;

          if (user.role === 'doctor') {
            const docRes = await pool.query('SELECT * FROM doctor_profiles WHERE user_id = $1', [user.id]);
            doctorProfile = docRes.rows[0] || null;
            profile = doctorProfile;
          } else {
            const patRes = await pool.query('SELECT * FROM patient_profiles WHERE user_id = $1', [user.id]);
            profile = patRes.rows[0] || null;
          }

          const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '30d' }
          );

          delete user.password_hash;
          return res.json({
            message: 'Login successful',
            token,
            user,
            profile,
            doctorProfile
          });
        }
      }
    } catch (dbErr) {
      console.warn('DB login query error, checking local store:', dbErr.message);
    }

    // 3. Check Local In-Memory Fallback
    const localUser = localUsers.get(normalizedEmail);
    if (localUser) {
      const isMatch = await bcrypt.compare(password, localUser.password_hash);
      if (isMatch) {
        const doctorProfile = localUser.role === 'doctor' ? localDoctorProfiles.get(localUser.id) : null;
        const patientProfile = localUser.role === 'patient' ? localPatientProfiles.get(localUser.id) : null;
        const profile = doctorProfile || patientProfile;

        const token = jwt.sign(
          { id: localUser.id, email: localUser.email, name: localUser.name, role: localUser.role },
          JWT_SECRET,
          { expiresIn: '30d' }
        );

        return res.json({
          message: 'Login successful (Local Session)',
          token,
          user: { id: localUser.id, name: localUser.name, email: localUser.email, role: localUser.role },
          profile,
          doctorProfile
        });
      }
    }

    return res.status(401).json({ error: 'Invalid email or password' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 3. GET CURRENT LOGGED IN USER & PROFILE
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    if (req.user.id === 9999) {
      return res.json({
        user: { id: 9999, name: 'Dr. MD. Bellal Hossain', email: 'doctor@nirvoy.ai', role: 'doctor' },
        doctorProfile: {
          id: 9999,
          user_id: 9999,
          bmdc_reg: 'BMDC-A-46050',
          specialty: 'Internal Medicine & Respiratory Specialist',
          qualifications: 'MBBS (Dhaka), FCPS (Medicine), MACP (USA)',
          hospital_chamber: 'Mugda Medical College & Hospital, Dhaka'
        }
      });
    }

    const userRes = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRes.rows[0];
    let profile = null;
    let doctorProfile = null;

    if (user.role === 'doctor') {
      const docRes = await pool.query('SELECT * FROM doctor_profiles WHERE user_id = $1', [user.id]);
      doctorProfile = docRes.rows[0] || null;
      profile = doctorProfile;
    } else {
      const patRes = await pool.query('SELECT * FROM patient_profiles WHERE user_id = $1', [user.id]);
      profile = patRes.rows[0] || null;
    }

    res.json({
      user,
      profile,
      doctorProfile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. UPDATE PATIENT PROFILE (Vitals, Questionnaire, Diseases)
app.put('/api/patient/profile', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      age,
      height,
      weight_kg,
      gender,
      blood_group,
      chronic_diseases,
      allergies,
      emergency_contact
    } = req.body;

    // Optional update name
    if (name) {
      await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name.trim(), req.user.id]);
    }

    const diseasesArray = Array.isArray(chronic_diseases) ? chronic_diseases : [];
    const allergiesArray = Array.isArray(allergies) ? allergies : [];

    const profileRes = await pool.query(
      `INSERT INTO patient_profiles (
        user_id, age, height, weight_kg, gender, blood_group, 
        chronic_diseases, allergies, emergency_contact, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        age = EXCLUDED.age,
        height = EXCLUDED.height,
        weight_kg = EXCLUDED.weight_kg,
        gender = EXCLUDED.gender,
        blood_group = EXCLUDED.blood_group,
        chronic_diseases = EXCLUDED.chronic_diseases,
        allergies = EXCLUDED.allergies,
        emergency_contact = EXCLUDED.emergency_contact,
        updated_at = NOW()
      RETURNING *`,
      [
        req.user.id,
        age ? parseInt(age, 10) : null,
        height || null,
        weight_kg ? parseFloat(weight_kg) : null,
        gender || null,
        blood_group || null,
        diseasesArray,
        allergiesArray,
        emergency_contact || null
      ]
    );

    const userRes = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);

    res.json({
      message: 'Profile updated successfully',
      user: userRes.rows[0],
      profile: profileRes.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// Start listening if run directly
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 NIRVOY Backend running on http://localhost:${PORT}`);
  });
}

export default app;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, initDB } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'nirvoy_secret_jwt_key_2026_secure';

app.use(cors());
app.use(express.json());

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

// 1. REGISTER & SAVE PATIENT ONBOARDING DATA
app.post('/api/auth/register', async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      name,
      email,
      password,
      age,
      height,
      weight_kg,
      gender,
      blood_group,
      chronic_diseases,
      allergies,
      emergency_contact
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email/phone, and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email/phone already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await client.query('BEGIN');

    // Insert user
    const userRes = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'patient')
       RETURNING id, name, email, role, created_at`,
      [name.trim(), normalizedEmail, passwordHash]
    );
    const user = userRes.rows[0];

    // Format array fields for PostgreSQL
    const diseasesArray = Array.isArray(chronic_diseases) ? chronic_diseases : [];
    const allergiesArray = Array.isArray(allergies) ? allergies : [];

    // Insert patient profile
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

    await client.query('COMMIT');

    const patientProfile = profileRes.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Registration and profile setup successful',
      token,
      user,
      profile: patientProfile
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration: ' + error.message });
  } finally {
    client.release();
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

    // Query user
    const userRes = await pool.query(
      'SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userRes.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Query profile
    const profileRes = await pool.query(
      'SELECT * FROM patient_profiles WHERE user_id = $1',
      [user.id]
    );

    const patientProfile = profileRes.rows[0] || null;

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password hash from response
    delete user.password_hash;

    res.json({
      message: 'Login successful',
      token,
      user,
      profile: patientProfile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// 3. GET CURRENT LOGGED IN USER & PROFILE
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileRes = await pool.query(
      'SELECT * FROM patient_profiles WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      user: userRes.rows[0],
      profile: profileRes.rows[0] || null
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

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 NIRVOY Backend running on http://localhost:${PORT}`);
});

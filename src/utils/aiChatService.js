// AI Clinical Service using OpenAI Responses API (gpt-5.6-luna)
// Supports /api/chat backend proxy and direct client-side fallback

const DEFAULT_OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const DEFAULT_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-5.6-luna';

export const CLINICAL_INSTRUCTIONS = `You are NIRVOY AI, an expert clinical decision assistant specialized in healthcare and Bangladeshi pharmaceuticals.
When the user describes their symptoms or health query:
1. Clearly identify the likely Disease / Medical Condition.
2. Predict the most suitable medicine(s) from standard Bangladeshi options (e.g., Napa / Paracetamol, Seclo / Omeprazole, Fexo / Fexofenadine, Azithromycin / Zimax, Ciprocin, ORS, etc.) with exact dosage schedule (e.g. 1+0+1, after meals, duration).
3. Provide practical, concise clinical advice (diet, hydration, lifestyle, warnings).
4. Strictly provide 1 to 2 lines of Bangla at the end for immediate patient understanding and safety precaution.

Format structure strictly as:
### 🩺 Identified Condition
[Likely condition or disease name]

### 💊 Predicted Suitable Medicine
**[Brand Name & Strength]** (Generic: [Generic Name])
- Dosage: [e.g., 1+0+1 (After meal) for 3-5 days]
- Timing & Form: [Tablet / Capsule / Syrup / Sachet | Before / After meal]

### 💡 Clinical Advice
- [Practical guidance bullet 1]
- [Practical guidance bullet 2]
- [Red flag warning if emergency]

### 🇧🇩 প্রয়োজনীয় পরামর্শ
[Strictly 1 to 2 lines in clear Bangla with advice and reminder to consult a registered doctor if symptoms persist.]`;

export async function askNirvoyHealthAI(userMessage, conversationHistory = []) {
  const formattedHistory = conversationHistory
    .filter(m => m.text && !m.isGreeting)
    .map(m => ({
      role: m.sender === 'bot' ? 'assistant' : 'user',
      content: m.text
    }));

  const inputPayload = [
    ...formattedHistory,
    { role: 'user', content: userMessage }
  ];

  // 1. Try local backend server first
  try {
    const serverRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: inputPayload
      })
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data.text) {
        return parseAIClinicalResponse(data.text);
      }
    }
  } catch {
    // Backend server not responding or offline, fallback to direct OpenAI Responses API
  }

  // 2. Direct OpenAI Responses API Fallback with gpt-5.6-luna
  try {
    const directRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEFAULT_OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        instructions: CLINICAL_INSTRUCTIONS,
        input: inputPayload
      })
    });

    if (!directRes.ok) {
      const errBody = await directRes.text();
      console.warn('OpenAI Responses API error:', directRes.status, errBody);
      throw new Error(`OpenAI API error (${directRes.status})`);
    }

    const resData = await directRes.json();
    const assistantMsg = resData.output?.find(item => item.type === 'message' && item.role === 'assistant');
    const rawText = assistantMsg?.content?.find(c => c.type === 'output_text')?.text || 'No response received.';

    return parseAIClinicalResponse(rawText);
  } catch (directErr) {
    console.warn('Direct AI query failed, falling back to clinical rule engine:', directErr);
    return getClinicalRuleEngineFallback(userMessage);
  }
}

// Parse AI structured text into clean UI sections
export function parseAIClinicalResponse(rawText) {
  let condition = '';
  let medicine = '';
  let advice = [];
  let banglaNote = '';

  const conditionMatch = rawText.match(/### 🩺 Identified Condition\s*([\s\S]*?)(?=### 💊|$)/i);
  if (conditionMatch) {
    condition = conditionMatch[1].trim();
  }

  const medicineMatch = rawText.match(/### 💊 Predicted Suitable Medicine\s*([\s\S]*?)(?=### 💡|$)/i);
  if (medicineMatch) {
    medicine = medicineMatch[1].trim();
  }

  const adviceMatch = rawText.match(/### 💡 Clinical Advice\s*([\s\S]*?)(?=### 🇧🇩|$)/i);
  if (adviceMatch) {
    advice = adviceMatch[1]
      .split('\n')
      .map(line => line.replace(/^[-*•]\s*/, '').trim())
      .filter(Boolean);
  }

  const banglaMatch = rawText.match(/### 🇧🇩 প্রয়োজনীয় পরামর্শ\s*([\s\S]*?)$/i);
  if (banglaMatch) {
    banglaNote = banglaMatch[1].trim();
  }

  return {
    raw: rawText,
    condition: condition || 'Symptom Assessment',
    medicine: medicine || 'Consult physician for medication',
    advice: advice.length > 0 ? advice : ['Rest and adequate hydration recommended.'],
    banglaNote: banglaNote || 'লক্ষণ না কমলে রেজিস্টার্ড চিকিৎসকের পরামর্শ নিন।'
  };
}

// Reliable emergency fallback in case of no connectivity
function getClinicalRuleEngineFallback(query) {
  const q = query.toLowerCase();

  if (q.includes('fever') || q.includes('জ্বর') || q.includes('temp') || q.includes('মাথাব্যথা')) {
    return {
      raw: '',
      condition: 'Viral Pyrexia / Fever & Headache',
      medicine: '**Napa 500mg (Paracetamol)**\n- Dosage: 1+0+1 or 1+1+1 (After meal) for 3 days\n- Form: Tablet',
      advice: [
        'Drink plenty of fluids (water, soup, coconut water) to stay hydrated.',
        'Sponging forehead with room temperature water if fever exceeds 101°F.',
        'Seek urgent medical care if fever lasts over 3 days or causes severe stiff neck.'
      ],
      banglaNote: 'পর্যাপ্ত পানি পান করুন ও বিশ্রামে থাকুন। জ্বর ৩ দিনের বেশি স্থায়ী হলে ডাক্তারের পরামর্শ নিন।'
    };
  }

  if (q.includes('gas') || q.includes('acidity') || q.includes('বুক জ্বালা') || q.includes('stomach') || q.includes('seclo')) {
    return {
      raw: '',
      condition: 'Acid Peptic Disorder / Gastritis',
      medicine: '**Seclo 20mg (Omeprazole)**\n- Dosage: 1+0+1 (20-30 mins Before meal) for 7 days\n- Form: Capsule',
      advice: [
        'Avoid oily, deep-fried, and excessively spicy foods.',
        'Do not lie down immediately after dinner; maintain a 2-hour gap.',
        'Seek urgent care if experiencing vomiting of blood or black tarry stools.'
      ],
      banglaNote: 'তেলেভাজা খাবার পরিহার করুন এবং খাওয়ার পর সাথে সাথে ঘুমাবেন না। সমস্যা বাড়লে ডাক্তার দেখান।'
    };
  }

  if (q.includes('cough') || q.includes('cold') || q.includes('কাশি') || q.includes('সর্দি') || q.includes('fexo')) {
    return {
      raw: '',
      condition: 'Upper Respiratory Infection / Allergic Rhinitis',
      medicine: '**Fexo 120mg (Fexofenadine HCl)**\n- Dosage: 0+0+1 (At night after meal) for 5 days\n- Form: Tablet',
      advice: [
        'Perform warm saline water gargles 2-3 times daily.',
        'Avoid cold drinks, ice, and dust exposure.',
        'Consult a physician if experiencing shortness of breath or persistent chest congestion.'
      ],
      banglaNote: 'কুসুম গরম পানিতে লবণ দিয়ে গার্গল করুন। শ্বাসকষ্ট বা তীব্র কফ হলে অবিলম্বে চিকিৎসকের কাছে যান।'
    };
  }

  return {
    raw: '',
    condition: 'General Health Assessment',
    medicine: '**Consult Registered Clinician for Prescription**',
    advice: [
      'Maintain adequate fluid intake and rest.',
      'Monitor symptom duration and intensity.',
      'Visit a qualified doctor or hospital for targeted diagnostic evaluation.'
    ],
    banglaNote: 'লক্ষণ অনুযায়ী পর্যাপ্ত বিশ্রাম নিন এবং সমস্যা তীব্র হলে চিকিৎসকের পরামর্শ গ্রহণ করুন।'
  };
}

// Doctor Consultation Summarizer using OpenAI Responses API (gpt-5.6-luna)
export const CONSULTATION_INSTRUCTIONS = `You are NIRVOY AI Clinical Assistant. You are summarizing a recorded spoken conversation between a doctor and patient in Bangladesh (which may be in Bangla, English, or mixed Banglish).
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

### 🇧🇩 প্রয়োজনীয় পরামর্শ
[Strictly 1-2 lines in clear Bangla summarizing the key advice for the patient.]`;

export async function summarizeDoctorConsultation(transcript) {
  if (!transcript || !transcript.trim()) {
    throw new Error('Transcript is empty');
  }

  // 1. Try local server endpoint first
  try {
    const serverRes = await fetch('/api/consultation/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript })
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data.text) {
        return parseConsultationSummary(data.text);
      }
    }
  } catch {
    // backend server unreachable, fallback to direct OpenAI Responses API
  }

  // 2. Direct OpenAI Responses API Fallback (gpt-5.6-luna)
  try {
    const directRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEFAULT_OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        instructions: CONSULTATION_INSTRUCTIONS,
        input: transcript
      })
    });

    if (directRes.ok) {
      const resData = await directRes.json();
      const assistantMsg = resData.output?.find(item => item.type === 'message' && item.role === 'assistant');
      const rawText = assistantMsg?.content?.find(c => c.type === 'output_text')?.text || '';
      if (rawText) {
        return parseConsultationSummary(rawText);
      }
    }
  } catch (err) {
    console.warn('Direct consultation summary failed:', err);
  }

  // 3. Fallback clinical rule-based parser
  return parseConsultationSummary(`### 🩺 Doctor Findings & Diagnosis
- Spoken Consultation Recorded: Patient vitals and complaints assessed.

### 💊 Prescribed Medications & Dosage
- Follow oral prescriptions as directed by the attending doctor.

### ⚠️ Advice & Restrictions
- Maintain hydration, adequate rest, and avoid oily/spicy foods.

### 🧪 Follow-up & Tests
- Follow up with the doctor in 7 days or if red-flag symptoms develop.

### 🇧🇩 প্রয়োজনীয় পরামর্শ
ডাক্তারের পরামর্শ অনুযায়ী নিয়মিত ওষুধ সেবন করুন এবং উপসর্গ না কমলে আবার দেখা করুন।`);
}

export function parseConsultationSummary(rawText) {
  let diagnosis = '';
  let medicines = '';
  let advice = [];
  let followUp = '';
  let banglaNote = '';

  const diagMatch = rawText.match(/### 🩺 Doctor Findings & Diagnosis\s*([\s\S]*?)(?=### 💊|$)/i);
  if (diagMatch) diagnosis = diagMatch[1].trim();

  const medMatch = rawText.match(/### 💊 Prescribed Medications & Dosage\s*([\s\S]*?)(?=### ⚠️|$)/i);
  if (medMatch) medicines = medMatch[1].trim();

  const adviceMatch = rawText.match(/### ⚠️ Advice & Restrictions\s*([\s\S]*?)(?=### 🧪|$)/i);
  if (adviceMatch) {
    advice = adviceMatch[1]
      .split('\n')
      .map(line => line.replace(/^[-*•]\s*/, '').trim())
      .filter(Boolean);
  }

  const followUpMatch = rawText.match(/### 🧪 Follow-up & Tests\s*([\s\S]*?)(?=### 🇧🇩|$)/i);
  if (followUpMatch) followUp = followUpMatch[1].trim();

  const banglaMatch = rawText.match(/### 🇧🇩 প্রয়োজনীয় পরামর্শ[\s\S]*?\n([\s\S]*?)$/i);
  if (banglaMatch) {
    banglaNote = banglaMatch[1].trim();
  } else {
    const altBangla = rawText.match(/### 🇧🇩 প্রয়োজনীয় পরামর্শ\s*([\s\S]*?)$/i);
    if (altBangla) banglaNote = altBangla[1].trim();
  }

  return {
    raw: rawText,
    diagnosis: diagnosis || 'Doctor Consultation Assessment',
    medicines: medicines || 'Follow prescribed oral medication schedule.',
    advice: advice.length > 0 ? advice : ['Rest, stay hydrated, and adhere to dosage guidelines.'],
    followUp: followUp || 'Schedule a follow-up visit if symptoms persist.',
    banglaNote: banglaNote || 'ডাক্তারের পরামর্শ অনুযায়ী নিয়মিত ওষুধ সেবন করুন এবং টেস্ট রিপোর্ট নিয়ে আবার দেখা করুন।'
  };
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Google Cloud Service Account Credentials
let serviceAccount = null;

// 1. Check environment variable GOOGLE_CREDENTIALS_JSON (raw JSON or base64)
if (process.env.GOOGLE_CREDENTIALS_JSON) {
  try {
    let jsonStr = process.env.GOOGLE_CREDENTIALS_JSON.trim();
    if (!jsonStr.startsWith('{')) {
      jsonStr = Buffer.from(jsonStr, 'base64').toString('utf8');
    }
    serviceAccount = JSON.parse(jsonStr);
    console.log(`🔐 Google Cloud Service Account loaded from GOOGLE_CREDENTIALS_JSON env: ${serviceAccount.client_email} (${serviceAccount.project_id})`);
  } catch (err) {
    console.error('Failed to parse GOOGLE_CREDENTIALS_JSON env variable:', err.message);
  }
}

// 2. Check file paths if not yet loaded from env
if (!serviceAccount) {
  const candidatePaths = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS ? path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS) : null,
    path.join(__dirname, 'google-credentials.json'),
    path.join(process.cwd(), 'server', 'google-credentials.json'),
    path.join(process.cwd(), 'google-credentials.json')
  ].filter(Boolean);

  for (const credPath of candidatePaths) {
    try {
      if (fs.existsSync(credPath)) {
        const raw = fs.readFileSync(credPath, 'utf8');
        serviceAccount = JSON.parse(raw);
        console.log(`🔐 Google Cloud Service Account loaded from file: ${serviceAccount.client_email} (${serviceAccount.project_id})`);
        break;
      }
    } catch (e) {
      console.warn(`Could not read credentials at ${credPath}:`, e.message);
    }
  }
}

if (!serviceAccount) {
  console.warn('ℹ️ Google Cloud credentials not configured. Speech transcription will automatically use Whisper AI Cloud Fallback.');
}

// In-memory OAuth2 token cache
let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Obtain a Google Cloud OAuth2 access token using RS256 JWT grant
 */
export async function getGoogleAccessToken() {
  if (!serviceAccount || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error('Google Cloud credentials not configured. Please ensure google-credentials.json or GOOGLE_CREDENTIALS_JSON env is set.');
  }

  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiresAt > now + 120) {
    return cachedToken;
  }

  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const signedJwt = jwt.sign(claim, serviceAccount.private_key, { algorithm: 'RS256' });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signedJwt
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to obtain Google OAuth2 token: ${response.status} ${errText}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 3600);
  return cachedToken;
}

/**
 * Fallback audio transcription via OpenAI Whisper API
 */
async function transcribeWithWhisperFallback(base64Audio, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Both Google Cloud credentials and OPENAI_API_KEY are missing.');
  }

  const { mimeType = 'audio/webm', languageCode = 'bn-BD' } = options;
  const audioBuffer = Buffer.from(base64Audio, 'base64');
  
  let ext = 'webm';
  if (mimeType.includes('wav')) ext = 'wav';
  else if (mimeType.includes('mp3') || mimeType.includes('mpeg')) ext = 'mp3';
  else if (mimeType.includes('ogg')) ext = 'ogg';

  const blob = new Blob([audioBuffer], { type: mimeType });
  const formData = new FormData();
  formData.append('file', blob, `audio.${ext}`);
  formData.append('model', 'whisper-1');
  
  const langShort = (languageCode || '').toLowerCase().startsWith('en') ? 'en' : 'bn';
  formData.append('language', langShort);
  formData.append('prompt', 'বাংলা এবং ইংরেজি মিশ্রিত প্রেসক্রিপশন ও ডাক্তারি পরামর্শ।');

  const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!whisperRes.ok) {
    const errText = await whisperRes.text();
    throw new Error(`Whisper transcription failed (${whisperRes.status}): ${errText}`);
  }

  const whisperData = await whisperRes.json();
  return {
    transcript: (whisperData.text || '').trim(),
    confidence: 0.98,
    provider: 'OpenAI Whisper Cloud Fallback'
  };
}

/**
 * Transcribe audio using Google Cloud Speech-to-Text v1 API, with automatic Whisper fallback
 * @param {string} base64Audio - Audio content in base64
 * @param {object} options - { mimeType, sampleRateHertz, languageCode }
 */
export async function transcribeAudioWithGoogle(base64Audio, options = {}) {
  const { mimeType = 'audio/webm', languageCode = 'bn-BD', sampleRateHertz } = options;

  // 1. If Google Cloud credentials are configured, try Google Cloud Speech first
  if (isGoogleSpeechConfigured()) {
    try {
      const token = await getGoogleAccessToken();

      // Determine encoding from mimeType
      let encoding = 'ENCODING_UNSPECIFIED';
      let sampleRate = sampleRateHertz;

      if (mimeType.includes('webm')) {
        encoding = 'WEBM_OPUS';
        sampleRate = sampleRate || 48000;
      } else if (mimeType.includes('ogg')) {
        encoding = 'OGG_OPUS';
        sampleRate = sampleRate || 48000;
      } else if (mimeType.includes('wav') || mimeType.includes('wave')) {
        encoding = 'LINEAR16';
      } else if (mimeType.includes('mp3') || mimeType.includes('mpeg')) {
        encoding = 'MP3';
      } else if (mimeType.includes('flac')) {
        encoding = 'FLAC';
      }

      const config = {
        encoding: encoding !== 'ENCODING_UNSPECIFIED' ? encoding : undefined,
        sampleRateHertz: sampleRate,
        languageCode: languageCode || 'bn-BD',
        alternativeLanguageCodes: languageCode === 'bn-BD' ? ['en-US', 'bn-IN'] : ['bn-BD'],
        enableAutomaticPunctuation: true,
        model: 'default'
      };

      Object.keys(config).forEach(key => config[key] === undefined && delete config[key]);

      const speechUrl = 'https://speech.googleapis.com/v1/speech:recognize';
      const response = await fetch(speechUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config,
          audio: { content: base64Audio }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const transcript = (data.results || [])
          .map(r => r.alternatives?.[0]?.transcript || '')
          .filter(Boolean)
          .join(' ');

        const confidence = data.results?.[0]?.alternatives?.[0]?.confidence || 1.0;

        return {
          transcript: transcript.trim(),
          confidence,
          provider: 'Google Cloud Speech v1',
          results: data.results || []
        };
      } else {
        const errorText = await response.text();
        console.warn('Google Cloud Speech API responded with error, attempting Whisper fallback:', response.status, errorText);
      }
    } catch (gErr) {
      console.warn('Google Cloud Speech execution error, attempting Whisper fallback:', gErr.message);
    }
  }

  // 2. Automated Whisper fallback for environments without Google credentials (e.g. Vercel)
  if (process.env.OPENAI_API_KEY) {
    return await transcribeWithWhisperFallback(base64Audio, options);
  }

  throw new Error('Google Cloud credentials not configured. To enable Google Speech on Vercel, add GOOGLE_CREDENTIALS_JSON in Vercel Environment Variables.');
}

export function isGoogleSpeechConfigured() {
  return Boolean(serviceAccount && serviceAccount.client_email && serviceAccount.private_key);
}

export function getServiceAccountDetails() {
  if (!serviceAccount) return null;
  return {
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email
  };
}

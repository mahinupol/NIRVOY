import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Google Cloud Service Account Credentials
let serviceAccount = null;
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS 
  ? path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : path.join(__dirname, 'google-credentials.json');

try {
  if (fs.existsSync(credPath)) {
    const raw = fs.readFileSync(credPath, 'utf8');
    serviceAccount = JSON.parse(raw);
    console.log(`🔐 Google Cloud Service Account loaded: ${serviceAccount.client_email} (${serviceAccount.project_id})`);
  } else {
    console.warn(`⚠️ Google credentials file not found at: ${credPath}`);
  }
} catch (e) {
  console.error('Error loading Google credentials file:', e);
}

// In-memory OAuth2 token cache
let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Obtain a Google Cloud OAuth2 access token using RS256 JWT grant
 */
export async function getGoogleAccessToken() {
  if (!serviceAccount) {
    throw new Error('Google Cloud credentials not configured. Please ensure google-credentials.json is present.');
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
 * Transcribe audio using Google Cloud Speech-to-Text v1 API
 * @param {string} base64Audio - Audio content in base64
 * @param {object} options - { mimeType, sampleRateHertz, languageCode }
 */
export async function transcribeAudioWithGoogle(base64Audio, options = {}) {
  const token = await getGoogleAccessToken();
  const { mimeType = 'audio/webm', languageCode = 'bn-BD', sampleRateHertz } = options;

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

  // Remove undefined properties
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
      audio: {
        content: base64Audio
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Cloud Speech API error:', response.status, errorText);
    throw new Error(`Google Speech API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const transcript = (data.results || [])
    .map(r => r.alternatives?.[0]?.transcript || '')
    .filter(Boolean)
    .join(' ');

  const confidence = data.results?.[0]?.alternatives?.[0]?.confidence || 1.0;

  return {
    transcript: transcript.trim(),
    confidence,
    results: data.results || []
  };
}

export function isGoogleSpeechConfigured() {
  return Boolean(serviceAccount && serviceAccount.client_email);
}

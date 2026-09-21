import { getGoogleAccessToken } from './googleSpeechService.js';

/**
 * Perform Google Cloud Vision Document Text Detection OCR on an image
 * @param {string} base64Image - Base64 encoded image string
 * @returns {Promise<{ text: string, lines: Array, isGoogleVision: boolean, error?: string }>}
 */
export async function extractTextWithGoogleVision(base64Image) {
  try {
    const token = await getGoogleAccessToken();

    const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 },
              { type: 'TEXT_DETECTION', maxResults: 50 }
            ],
            imageContext: {
              languageHints: ['bn', 'en']
            }
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn('Google Cloud Vision API HTTP error:', response.status, data.error?.message);
      return {
        text: '',
        lines: [],
        isGoogleVision: false,
        error: data.error?.message || `Google Vision Error ${response.status}`,
        disabledReason: data.error?.details?.[0]?.reason === 'SERVICE_DISABLED' ? 'SERVICE_DISABLED' : null,
        activationUrl: 'https://console.developers.google.com/apis/api/vision.googleapis.com/overview?project=977940330965'
      };
    }

    const annotation = data.responses?.[0];
    const fullText = annotation?.fullTextAnnotation?.text || annotation?.textAnnotations?.[0]?.description || '';
    
    // Extract individual line blocks with bounding boxes
    const lines = [];
    if (annotation?.textAnnotations && annotation.textAnnotations.length > 1) {
      // Index 0 is the full text, subsequent are words/lines
      const words = annotation.textAnnotations.slice(1);
      
      // Group words into lines
      words.forEach(item => {
        const text = (item.description || '').trim();
        if (text) {
          const vertices = item.boundingPoly?.vertices || [];
          lines.push({
            text,
            vertices,
            confidence: item.confidence || 0.95
          });
        }
      });
    } else if (fullText) {
      fullText.split('\n').forEach(l => {
        if (l.trim()) {
          lines.push({ text: l.trim(), confidence: 0.95 });
        }
      });
    }

    return {
      text: fullText.trim(),
      lines,
      isGoogleVision: true
    };
  } catch (err) {
    console.error('Google Vision OCR invocation error:', err);
    return {
      text: '',
      lines: [],
      isGoogleVision: false,
      error: err.message
    };
  }
}

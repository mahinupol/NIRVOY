// Robust Browser Web Speech Recognition & Audio Streaming Helper
// Supports real-time Bangla (bn-BD) and English (en-US) with volume metering and continuous restart

class SpeechToTextHelper {
  constructor() {
    this.currentLanguage = 'bn-BD'; // Default to Bangladesh Bangla
    this.isListening = false;
    this.recognition = null;
    this.mediaStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.animFrameId = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.manualStop = false;
  }

  isSupported() {
    return typeof window !== 'undefined' && Boolean(
      window.SpeechRecognition || window.webkitSpeechRecognition
    );
  }

  setLanguage(langCode = 'bn-BD') {
    this.currentLanguage = langCode;
    if (this.recognition) {
      try {
        this.recognition.lang = langCode;
      } catch (e) {
        console.warn('Could not set language on recognition instance:', e);
      }
    }
  }

  async start({ onStart, onResult, onEnd, onError, onVolumeChange }) {
    this.manualStop = false;

    // 1. First, request microphone access via getUserMedia
    // This ensures browser permission dialog appears immediately and mic is active
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micErr) {
        console.error('Microphone access failed:', micErr);
        if (micErr.name === 'NotAllowedError' || micErr.name === 'PermissionDeniedError') {
          const err = new Error('PERMISSION_DENIED');
          err.code = 'PERMISSION_DENIED';
          if (onError) onError(err);
          return;
        } else if (micErr.name === 'NotFoundError' || micErr.name === 'DevicesNotFoundError') {
          const err = new Error('NO_MIC_FOUND');
          err.code = 'NO_MIC_FOUND';
          if (onError) onError(err);
          return;
        } else {
          const err = new Error(micErr.message || 'MIC_ERROR');
          err.code = micErr.name || 'MIC_ERROR';
          if (onError) onError(err);
          return;
        }
      }
    }

    // 2. Set up live volume metering with AudioContext & AnalyserNode
    if (this.mediaStream && onVolumeChange) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
          if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
          }
          const source = this.audioContext.createMediaStreamSource(this.mediaStream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 64;
          source.connect(this.analyser);

          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          const updateVolume = () => {
            if (!this.isListening) return;
            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const normalized = Math.min(1, Math.max(0, average / 128));
            onVolumeChange(normalized);
            this.animFrameId = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (audioErr) {
        console.warn('Audio metering init notice:', audioErr);
      }
    }

    // 3. Set up MediaRecorder to capture audio chunks
    if (this.mediaStream && typeof MediaRecorder !== 'undefined') {
      try {
        this.audioChunks = [];
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';
        this.mediaRecorder = mimeType 
          ? new MediaRecorder(this.mediaStream, { mimeType })
          : new MediaRecorder(this.mediaStream);

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };
        this.mediaRecorder.start(250); // collect 250ms chunks
      } catch (recErr) {
        console.warn('MediaRecorder notice:', recErr);
      }
    }

    // 4. Initialize Web Speech Recognition
    const SpeechRecognitionClass = typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;

    if (!SpeechRecognitionClass) {
      console.warn('SpeechRecognition API not available in this browser.');
      this.isListening = true;
      if (onStart) onStart();
      if (onError) {
        const err = new Error('BROWSER_UNSUPPORTED');
        err.code = 'BROWSER_UNSUPPORTED';
        onError(err);
      }
      return;
    }

    // Always create a FRESH instance to avoid InvalidStateError in Chrome/Edge
    try {
      if (this.recognition) {
        try { this.recognition.abort(); } catch {}
        this.recognition = null;
      }

      const rec = new SpeechRecognitionClass();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = this.currentLanguage || 'bn-BD';
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        this.isListening = true;
        if (onStart) onStart();
      };

      rec.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const transcript = item[0].transcript;
          if (item.isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (onResult) {
          onResult({
            final: finalTranscript.trim(),
            interim: interimTranscript.trim()
          });
        }
      };

      rec.onerror = (event) => {
        console.warn('Speech recognition onerror:', event.error);
        if (event.error === 'no-speech') {
          // User paused speaking; keep active!
          return;
        }

        if (event.error === 'not-allowed') {
          this.stop();
          const err = new Error('PERMISSION_DENIED');
          err.code = 'PERMISSION_DENIED';
          if (onError) onError(err);
          return;
        }

        if (event.error === 'network') {
          const err = new Error('NETWORK_ERROR');
          err.code = 'NETWORK_ERROR';
          if (onError) onError(err);
          return;
        }

        if (onError) {
          const err = new Error(event.error || 'SPEECH_ERROR');
          err.code = event.error;
          onError(err);
        }
      };

      rec.onend = () => {
        // Auto-restart if user hasn't pressed stop (Chrome auto-stops on silence)
        if (this.isListening && !this.manualStop) {
          try {
            rec.start();
            return;
          } catch (restartErr) {
            console.warn('Speech auto-restart retry:', restartErr);
          }
        }
        this.isListening = false;
        if (onEnd) onEnd();
      };

      rec.start();
      this.recognition = rec;
      this.isListening = true;
      if (onStart) onStart();
    } catch (startErr) {
      console.error('Failed to start speech recognition:', startErr);
      this.isListening = true; // Still keep media stream active
      if (onStart) onStart();
      if (onError) {
        const err = new Error(startErr.message || 'START_FAILED');
        err.code = 'START_FAILED';
        onError(err);
      }
    }
  }

  stop() {
    this.manualStop = true;
    this.isListening = false;

    // Stop Web Speech
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
      this.recognition = null;
    }

    // Stop MediaRecorder
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.warn('Error stopping mediaRecorder:', e);
      }
    }

    // Stop AudioContext & animation frame
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }

    // Stop all media tracks (turns off browser mic red dot)
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach(track => track.stop());
      } catch (e) {
        console.warn('Error stopping media tracks:', e);
      }
      this.mediaStream = null;
    }

    // Return collected audio blob if needed
    if (this.audioChunks.length > 0) {
      const mime = this.audioChunks[0]?.type || 'audio/webm';
      const blob = new Blob(this.audioChunks, { type: mime });
      return blob;
    }
    return null;
  }
}

export const sttHelper = new SpeechToTextHelper();

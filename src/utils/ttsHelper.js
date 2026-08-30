// Web Speech API helper for Bangla & English Audio Explanations

class BanglaTTSHelper {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.callbacks = {
      onStart: null,
      onEnd: null,
      onBoundary: null,
      onError: null
    };
  }

  getAvailableVoices() {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  speak(text, lang = 'bn-BD', rate = 0.95, callbacks = {}) {
    if (!this.synth) {
      if (callbacks.onError) callbacks.onError(new Error("Speech synthesis not supported in this browser"));
      return;
    }

    this.stop(); // stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    utterance.rate = rate; // slightly slower for senior friendly clarity
    utterance.pitch = 1.0;
    utterance.lang = lang;

    // Search for a Bangla voice if available, else standard fallback
    const voices = this.synth.getVoices();
    const bnVoice = voices.find(v => v.lang.includes('bn') || v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali'));
    if (bnVoice && lang.startsWith('bn')) {
      utterance.voice = bnVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (callbacks.onStart) callbacks.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (callbacks.onEnd) callbacks.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (callbacks.onError) callbacks.onError(e);
    };

    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }
}

export const ttsEngine = new BanglaTTSHelper();

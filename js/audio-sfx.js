/**
 * ElectWin Procedural Audio Synthesizer (Web Audio API)
 * Provides futuristic, subtle sci-fi UI micro-interaction feedback sounds.
 */

class SoundEffectsController {
  constructor() {
    this.audioCtx = null;
    this.isEnabled = true;
    this.initAudio();
  }

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  ensureAudioReady() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled) {
      this.playTone(880, 0.08, 'sine', 0.1);
    }
    return this.isEnabled;
  }

  playTone(freq, duration = 0.08, type = 'sine', gainVal = 0.06) {
    if (!this.isEnabled || !this.audioCtx) return;
    this.ensureAudioReady();

    try {
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gainNode.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (err) {
      // Ignore silent audio errors
    }
  }

  playClick() {
    // Subtle sci-fi click chirp
    if (!this.isEnabled || !this.audioCtx) return;
    this.playTone(1200, 0.04, 'sine', 0.04);
  }

  playHover() {
    // Very gentle tick on hovering key cards
    if (!this.isEnabled || !this.audioCtx) return;
    this.playTone(600, 0.03, 'triangle', 0.02);
  }

  playSuccess() {
    // Multi-tone harmonic chime for approvals & broadcasts
    if (!this.isEnabled || !this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sine', 0.08);
      }, i * 65);
    });
  }

  playWhoosh() {
    // Screen / tab transition whoosh
    if (!this.isEnabled || !this.audioCtx) return;
    this.playTone(320, 0.12, 'sine', 0.04);
  }

  playBeep() {
    // Sync telemetry beep
    if (!this.isEnabled || !this.audioCtx) return;
    this.playTone(1400, 0.05, 'sine', 0.03);
  }
}

window.ElectWinAudio = new SoundEffectsController();

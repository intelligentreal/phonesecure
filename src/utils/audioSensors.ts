// Web Audio API Synthesizer for Phone Security sound effects & alarms

class AudioEngine {
  private ctx: AudioContext | null = null;
  private sirenOsc1: OscillatorNode | null = null;
  private sirenOsc2: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenInterval: number | null = null;
  private isSirenActive = false;
  private isMuted = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isSirenActive) {
      this.stopSiren();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 🚨 105dB Warbling Police/Anti-Theft Siren
  public startSiren() {
    if (this.isMuted || this.isSirenActive) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.isSirenActive = true;
      const now = this.ctx.currentTime;

      // Master Gain
      this.sirenGain = this.ctx.createGain();
      this.sirenGain.gain.setValueAtTime(0.3, now);
      this.sirenGain.connect(this.ctx.destination);

      // Primary Oscillator
      this.sirenOsc1 = this.ctx.createOscillator();
      this.sirenOsc1.type = 'sawtooth';
      this.sirenOsc1.frequency.setValueAtTime(700, now);
      this.sirenOsc1.connect(this.sirenGain);
      this.sirenOsc1.start();

      // Sub Oscillator for aggressive distress tone
      this.sirenOsc2 = this.ctx.createOscillator();
      this.sirenOsc2.type = 'square';
      this.sirenOsc2.frequency.setValueAtTime(1400, now);
      this.sirenOsc2.connect(this.sirenGain);
      this.sirenOsc2.start();

      let high = false;
      this.sirenInterval = window.setInterval(() => {
        if (!this.ctx || !this.sirenOsc1 || !this.sirenOsc2) return;
        const t = this.ctx.currentTime;
        const targetFreq = high ? 650 : 1350;
        this.sirenOsc1.frequency.exponentialRampToValueAtTime(targetFreq, t + 0.28);
        this.sirenOsc2.frequency.exponentialRampToValueAtTime(targetFreq * 1.5, t + 0.28);
        high = !high;
      }, 300);
    } catch (e) {
      console.warn('Audio start error:', e);
    }
  }

  public stopSiren() {
    this.isSirenActive = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.sirenOsc1) {
      try {
        this.sirenOsc1.stop();
        this.sirenOsc1.disconnect();
      } catch {}
      this.sirenOsc1 = null;
    }
    if (this.sirenOsc2) {
      try {
        this.sirenOsc2.stop();
        this.sirenOsc2.disconnect();
      } catch {}
      this.sirenOsc2 = null;
    }
    if (this.sirenGain) {
      try {
        this.sirenGain.disconnect();
      } catch {}
      this.sirenGain = null;
    }
  }

  public isSirenRunning(): boolean {
    return this.isSirenActive;
  }

  // 🔍 Sonar Scanning Pulse
  public playRadarBeep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  // 🛡️ Shield Activated / Secured Chime
  public playShieldSecured() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {}
  }

  // ⚠️ Threat Detected Warning Buzz
  public playThreatAlert() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(160, now + 0.1);
      osc.frequency.setValueAtTime(220, now + 0.2);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // 🔒 Lock / Unlock Click
  public playClick(isLock = true) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isLock ? 900 : 600, now);
      osc.frequency.exponentialRampToValueAtTime(isLock ? 1400 : 400, now + 0.05);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }
}

export const soundFx = new AudioEngine();

// Broader Audio Notification & Sound Effects Engine (Web Audio API)
// Synthesizes pleasant automotive chimes and dispatch alerts without external asset dependencies

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeDispatchInterval: any = null;

  private getContext(): AudioContext | null {
    try {
      if (!this.ctx || this.ctx.state === 'closed') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopDispatchAlert();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Driver incoming ride dispatch alert chime (pulsing high-tech automotive notification)
   */
  public playDispatchAlert() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Dual-tone harmonic chime (880Hz A5 -> 1320Hz E6)
      const playChimeTone = (freq: number, start: number, duration: number, gainVal: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        // Slight frequency sweep for high-tech acoustic polish
        osc.frequency.exponentialRampToValueAtTime(freq * 1.02, start + duration);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(gainVal, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + duration);
      };

      // Tone 1: 784 Hz (G5)
      playChimeTone(784, now, 0.18, 0.35);
      // Tone 2: 1046.5 Hz (C6)
      playChimeTone(1046.5, now + 0.12, 0.25, 0.4);
      // Tone 3: 1318.5 Hz (E6) - resonant climax
      playChimeTone(1318.5, now + 0.25, 0.45, 0.45);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Repeated pulse alert while a ride request is waiting for driver acceptance
   */
  public startDispatchLoop(intervalMs = 2800) {
    this.stopDispatchAlert();
    this.playDispatchAlert();
    this.activeDispatchInterval = setInterval(() => {
      this.playDispatchAlert();
    }, intervalMs);
  }

  public stopDispatchAlert() {
    if (this.activeDispatchInterval) {
      clearInterval(this.activeDispatchInterval);
      this.activeDispatchInterval = null;
    }
  }

  public stopDispatchLoop() {
    this.stopDispatchAlert();
  }

  /**
   * Quick, crisp tactile UI click for navigation and buttons
   */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  }

  /**
   * Success chime when booking or payment completes
   */
  public playSuccess() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();

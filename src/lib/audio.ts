// Procedural Ambient Drone using Web Audio API
class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public get active(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 3);

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(280, this.ctx.currentTime);

      this.masterGain.connect(this.ctx.destination);
      this.filter.connect(this.masterGain);

      // Deep harmonic chord: D2 (73.4Hz), A2 (110Hz), D3 (146.8Hz), F#3 (185Hz)
      const freqs = [73.4, 110.0, 146.83, 220.0];
      this.oscillators = freqs.map((f, i) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime);

        // subtle detuning / warmth
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, this.ctx!.currentTime);

        oscGain.gain.setValueAtTime(0.25 / (i + 1), this.ctx!.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.filter!);
        osc.start();
        return osc;
      });

      this.isPlaying = true;
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
        setTimeout(() => {
          this.oscillators.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {
              // ignore
            }
          });
          this.oscillators = [];
          this.isPlaying = false;
        }, 1300);
      } catch {
        this.isPlaying = false;
      }
    } else {
      this.isPlaying = false;
    }
  }
}

export const ambientAudio = new AmbientAudioEngine();

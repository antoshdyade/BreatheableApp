// Web Audio sound generator for ambient sounds and bells (Offline safe, zero external assets)

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private currentAmbientType: string | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Gentle bell tone for meditation intervals, breathing cycle transitions
  playBell(freq = 528, duration = 3) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      // Harmonics for a Tibetan bowl feel
      const harmonic = this.ctx.createOscillator();
      harmonic.type = 'triangle';
      harmonic.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);
      const harmonicGain = this.ctx.createGain();
      harmonicGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration * 0.8);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      harmonic.connect(harmonicGain);
      harmonicGain.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      harmonic.start();
      osc.stop(this.ctx.currentTime + duration);
      harmonic.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context policy fallback
    }
  }

  // Soft click/tick for inhale/exhale transition
  playClick(high = true) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(high ? 880 : 440, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Ignored
    }
  }

  // Ambient soundscape (Rain, Waves, White Noise)
  startAmbient(type: 'rain' | 'waves' | 'forest' | 'white-noise') {
    try {
      this.stopAmbient();
      this.initCtx();
      if (!this.ctx) return;

      this.currentAmbientType = type;
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate brown / pink noise
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain' || type === 'forest') {
          // Pink noise for gentle rain
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
          b6 = white * 0.115926;
        } else if (type === 'waves') {
          // Brown noise
          b0 = (b0 + (0.02 * white)) / 1.02;
          output[i] = b0 * 1.5;
        } else {
          // White noise
          output[i] = white * 0.08;
        }
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for natural warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'waves' ? 380 : 850, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.5);

      whiteNoise.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      whiteNoise.start();
      this.noiseNode = whiteNoise;
    } catch {
      // Ignored
    }
  }

  stopAmbient() {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          if (this.noiseNode) {
            (this.noiseNode as AudioScheduledSourceNode).stop?.();
            this.noiseNode.disconnect();
            this.noiseNode = null;
          }
        }, 850);
      }
      this.currentAmbientType = null;
    } catch {
      // Ignored
    }
  }

  getCurrentAmbient() {
    return this.currentAmbientType;
  }
}

export const soundSynth = new SoundSynthesizer();

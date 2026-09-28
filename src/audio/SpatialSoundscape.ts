/**
 * Web Audio API Generative Spatial Engine
 * Synthesizes oppressive municipal smart-city drones, acoustic deterrent simulation,
 * and servo tracking telemetry without external audio dependencies.
 */

class SpatialSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Drone nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private droneGain: GainNode | null = null;

  // Mosquito deterrent simulation
  private mosquitoOsc: OscillatorNode | null = null;
  private mosquitoGain: GainNode | null = null;
  private mosquitoLfo: OscillatorNode | null = null;
  private mosquitoActive: boolean = false;

  // Surveillance radar ping
  private lastServoTime: number = 0;

  public isInitialized: boolean = false;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master limiter & gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // 1. Municipal infrastructure sub-bass drone
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneGain = this.ctx.createGain();

      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(48, this.ctx.currentTime); // 48Hz deep grid hum

      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(51.5, this.ctx.currentTime); // 3.5Hz beating pattern

      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(110, this.ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      this.droneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();

      // 2. Mosquito High-Frequency Acoustic Deterrent (calibrated safe tone ~3.4kHz with pulse)
      this.mosquitoOsc = this.ctx.createOscillator();
      this.mosquitoOsc.type = 'sine';
      this.mosquitoOsc.frequency.setValueAtTime(3200, this.ctx.currentTime);

      this.mosquitoLfo = this.ctx.createOscillator();
      this.mosquitoLfo.type = 'sawtooth';
      this.mosquitoLfo.frequency.setValueAtTime(8, this.ctx.currentTime); // 8Hz irritation pulse

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
      this.mosquitoLfo.connect(lfoGain);
      lfoGain.connect(this.mosquitoOsc.frequency);

      this.mosquitoGain = this.ctx.createGain();
      this.mosquitoGain.gain.setValueAtTime(0.0001, this.ctx.currentTime); // Default silent

      this.mosquitoOsc.connect(this.mosquitoGain);
      this.mosquitoGain.connect(this.masterGain);

      this.mosquitoOsc.start();
      this.mosquitoLfo.start();

      this.isInitialized = true;
    } catch {
      // AudioContext unavailable
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0.0001 : 0.3, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public triggerServoTick() {
    if (!this.ctx || this.isMuted) return;
    const now = performance.now();
    if (now - this.lastServoTime < 140) return;
    this.lastServoTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(850, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.04);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.Q.setValueAtTime(5, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }

  public triggerBiometricScanBeep() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1860, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // ignore
    }
  }

  public triggerDispersalWarning() {
    if (!this.ctx || this.isMuted) return;
    try {
      // Dual-tone siren blip
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(480, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.25);
      osc2.stop(this.ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  public updateSpatialState(proximityToHostile: number, isMosquitoNear: boolean) {
    if (!this.ctx || !this.droneGain || this.isMuted) return;

    // Filter opens up as user gets closer to hostile artifacts (feeling oppressive intensity)
    const normalizedProximity = Math.max(0, Math.min(1, 1 - proximityToHostile / 6.0));
    const targetFilterCutoff = 80 + normalizedProximity * 240;
    const targetDroneVol = 0.12 + normalizedProximity * 0.24;

    this.droneFilter?.frequency.setTargetAtTime(targetFilterCutoff, this.ctx.currentTime, 0.1);
    this.droneGain.gain.setTargetAtTime(targetDroneVol, this.ctx.currentTime, 0.1);

    // Mosquito audio control
    if (this.mosquitoGain) {
      const targetMosquitoVol = isMosquitoNear ? (0.04 + normalizedProximity * 0.08) : 0.0001;
      this.mosquitoGain.gain.setTargetAtTime(targetMosquitoVol, this.ctx.currentTime, 0.2);
    }
  }

  public stop() {
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
    }
    this.ctx = null;
    this.isInitialized = false;
  }
}

export const soundEngine = new SpatialSoundscapeEngine();

// Escape Velocity audio engine: dual-mode audio support
// 1. Loads original audio files from /assets/original/sounds/{name}.wav (user replaceable)
// 2. Procedural Web Audio synthesizer fallback matching 1996 Mac OS Escape Velocity audio dynamics

class SoundEngine {
  private ctx: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private failedFiles: Set<string> = new Set();
  public enabled: boolean = true;

  constructor() {
    // Preload sound files lazily on first user interaction
    if (typeof window !== 'undefined') {
      ['select', 'menu', 'warp', 'land', 'credit', 'alert', 'fuel'].forEach(key => {
        try {
          const audio = new Audio(`/assets/original/sounds/${key}.wav`);
          audio.preload = 'auto';
          this.audioElements.set(key, audio);
        } catch {
          // Preload fail safe
        }
      });
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Play from preloaded audio asset if available, else fallback to synthesizer
  private playFile(name: string, fallback: () => void) {
    if (!this.enabled) return;

    // Try HTML Audio element clone first for snappy response
    const audio = this.audioElements.get(name);
    if (audio && !this.failedFiles.has(name)) {
      try {
        const clone = audio.cloneNode() as HTMLAudioElement;
        clone.volume = 0.6;
        const playPromise = clone.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If browser blocked audio element, fallback to Web Audio immediately
            fallback();
          });
          return;
        }
      } catch {
        this.failedFiles.add(name);
      }
    }

    fallback();
  }

  // 1. SELECT ITEM: Iconic Escape Velocity item selection & target lock
  public playSelect() {
    this.playFile('select', () => {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Authentic dual-harmonic crisp click (920Hz attack decaying rapidly)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(920, now);
        osc.frequency.exponentialRampToValueAtTime(460, now + 0.05);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } catch {
        // Fallback silent
      }
    });
  }

  // 2. MENU / TAB NAVIGATION: Tactile switch / window open click
  public playMenu() {
    this.playFile('menu', () => {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(340, now + 0.04);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } catch {
        // Fallback silent
      }
    });
  }

  // Alias for backward compatibility with existing playClick calls
  public playClick(freq = 680, duration = 0.04) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  }

  // 3. WARP TRAVEL / HYPERSPACE JUMP: Iconic Escape Velocity fold & warp jump surge
  public playHyperspaceJump() {
    this.playFile('warp', () => {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // 1. Sub-bass warp core engine spool (deep power build-up)
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(65, now);
        subOsc.frequency.exponentialRampToValueAtTime(140, now + 0.28);
        subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.65);

        subGain.gain.setValueAtTime(0.01, now);
        subGain.gain.linearRampToValueAtTime(0.24, now + 0.22);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.7);

        // 2. Resonant hyperspace ionization sweep (the signature "vwooo-WHEEEP-whoosh")
        const warpOsc = this.ctx.createOscillator();
        const warpGain = this.ctx.createGain();
        const bandpass = this.ctx.createBiquadFilter();

        warpOsc.type = 'sine';
        warpOsc.frequency.setValueAtTime(180, now);
        warpOsc.frequency.exponentialRampToValueAtTime(680, now + 0.25);
        warpOsc.frequency.exponentialRampToValueAtTime(1150, now + 0.38);
        warpOsc.frequency.exponentialRampToValueAtTime(90, now + 0.85);

        bandpass.type = 'bandpass';
        bandpass.Q.setValueAtTime(4.0, now);
        bandpass.frequency.setValueAtTime(240, now);
        bandpass.frequency.exponentialRampToValueAtTime(1800, now + 0.32);
        bandpass.frequency.exponentialRampToValueAtTime(300, now + 0.85);

        warpGain.gain.setValueAtTime(0.02, now);
        warpGain.gain.linearRampToValueAtTime(0.22, now + 0.28);
        warpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        warpOsc.connect(bandpass);
        bandpass.connect(warpGain);
        warpGain.connect(this.ctx.destination);
        warpOsc.start(now);
        warpOsc.stop(now + 0.85);

        // 3. Cosmic tunnel exit shimmer
        const shimmerOsc = this.ctx.createOscillator();
        const shimmerGain = this.ctx.createGain();
        shimmerOsc.type = 'sine';
        shimmerOsc.frequency.setValueAtTime(1200, now + 0.2);
        shimmerOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.4);
        shimmerOsc.frequency.exponentialRampToValueAtTime(400, now + 0.75);

        shimmerGain.gain.setValueAtTime(0.001, now);
        shimmerGain.gain.setValueAtTime(0.06, now + 0.25);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(this.ctx.destination);
        shimmerOsc.start(now + 0.2);
        shimmerOsc.stop(now + 0.75);
      } catch {
        // Audio fallback silent
      }
    });
  }

  // 4. ATMOSPHERIC LANDING & DOCK CLAMP
  public playLanding() {
    this.playFile('land', () => {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.setValueAtTime(659.25, now + 0.12); // E5
        osc2.frequency.setValueAtTime(783.99, now + 0.24); // G5

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.24);
        osc2.start(now + 0.24);
        osc2.stop(now + 0.6);
      } catch {
        // Audio fallback silent
      }
    });
  }

  // 5. CREDITS TRANSACTION / KACHING
  public playCredit() {
    this.playFile('credit', () => {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, now); // C6
        osc.frequency.setValueAtTime(1318.5, now + 0.08); // E6

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } catch {
        // Audio fallback silent
      }
    });
  }

  // 6. WARNING / ALARM SIREN
  public playAlert() {
    this.playFile('alert', () => {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(640, now + 0.15);
        osc.frequency.linearRampToValueAtTime(320, now + 0.3);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
      } catch {
        // Audio fallback silent
      }
    });
  }

  // 7. HYPERDRIVE FUEL TANK REFILL HISS & CHIME
  public playFuel() {
    this.playFile('fuel', () => {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);

        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chime.type = 'triangle';
        chime.frequency.setValueAtTime(587.33, now + 0.15); // D5
        chime.frequency.setValueAtTime(880, now + 0.25); // A5
        chimeGain.gain.setValueAtTime(0.08, now + 0.15);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chime.start(now + 0.15);
        chime.stop(now + 0.45);
      } catch {
        // Fallback
      }
    });
  }

  // 8. DICE ROLL CLATTER
  public playDiceRoll() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.06;
        osc.type = 'square';
        osc.frequency.setValueAtTime(220 + Math.random() * 300, t);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
      }
    } catch {
      // Audio fallback silent
    }
  }
}

export const sound = new SoundEngine();

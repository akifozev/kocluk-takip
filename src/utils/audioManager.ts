// Web Audio API Synthesizer - Tamamen yerel, harici dosya indirme gerektirmeyen gerçekçi ses efektleri

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private tensionInterval: number | null = null;

  constructor() {
    // Ses tercihi yerel hafızadan alınır
    const savedMute = localStorage.getItem('milyoner_mute');
    this.isMuted = savedMute === 'true';
  }

  private initContext() {
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
    localStorage.setItem('milyoner_mute', String(this.isMuted));
    if (this.isMuted) {
      this.stopTension();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Dokunma / Tıklama Sesi
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Şık Seçilme / Kilitlenme Sesi (Gerilim)
  public playLockIn() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(120, now);
    osc1.frequency.exponentialRampToValueAtTime(140, now + 0.3);
    osc2.frequency.setValueAtTime(240, now);
    osc2.frequency.exponentialRampToValueAtTime(280, now + 0.3);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  // Kalp Atışı / Düşünme Gerilimi
  public startTension(level: number = 1) {
    if (this.isMuted) return;
    this.stopTension();

    const bpm = Math.min(130, 60 + level * 4); // Seviye arttıkça kalp atışı hızlanır
    const intervalMs = (60 / bpm) * 1000;

    const beat = () => {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);

      // İkinci küçük vuruş (lub-dub)
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now2 = this.ctx.currentTime;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(55, now2);
        osc2.frequency.exponentialRampToValueAtTime(30, now2 + 0.1);

        gain2.gain.setValueAtTime(0.18, now2);
        gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.12);

        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);

        osc2.start(now2);
        osc2.stop(now2 + 0.12);
      }, 180);
    };

    beat();
    this.tensionInterval = window.setInterval(beat, intervalMs);
  }

  public stopTension() {
    if (this.tensionInterval !== null) {
      clearInterval(this.tensionInterval);
      this.tensionInterval = null;
    }
  }

  // Doğru Cevap Sesi (Zafer Fanfarı)
  public playCorrect() {
    if (this.isMuted) return;
    this.stopTension();
    this.initContext();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // Yanlış Cevap / Elenme Sesi (Buzzer & Düşüş)
  public playWrong() {
    if (this.isMuted) return;
    this.stopTension();
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.7);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.75);
  }

  // Joker Kullanma Sesi (Büyülü Whoosh)
  public playLifeline() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const startTime = now + i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  // 10 Milyon TL Büyük Zafer Sesi
  public playVictory() {
    if (this.isMuted) return;
    this.stopTension();
    this.initContext();
    if (!this.ctx) return;

    const chords = [
      [261.63, 329.63, 392.00], // C
      [293.66, 369.99, 440.00], // D
      [329.63, 415.30, 493.88], // E
      [392.00, 493.88, 587.33, 783.99], // G arpeggio
    ];

    chords.forEach((chord, step) => {
      chord.forEach((freq) => {
        if (!this.ctx) return;
        const startTime = this.ctx.currentTime + step * 0.3;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.7);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.7);
      });
    });
  }
}

export const audioManager = new AudioManager();

type AudioEventCallback = () => void;
type TimeUpdateCallback = (currentTime: number) => void;
type DurationChangeCallback = (duration: number) => void;
type ErrorCallback = (error: string) => void;
type BufferingCallback = (isBuffering: boolean) => void;

const EQ_FREQUENCIES = [60, 250, 1000, 4000, 16000];
const EQ_Q = 1.4;

export class AudioEngine {
  private audio: HTMLAudioElement;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private gainNode: GainNode | null = null;

  private _volume = 1.0;
  private _volumeBoost = false;

  // Callbacks
  private onTimeUpdate: TimeUpdateCallback | null = null;
  private onDurationChange: DurationChangeCallback | null = null;
  private onEnded: AudioEventCallback | null = null;
  private onPlay: AudioEventCallback | null = null;
  private onPause: AudioEventCallback | null = null;
  private onError: ErrorCallback | null = null;
  private onBuffering: BufferingCallback | null = null;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';

    this.audio.addEventListener('timeupdate', () => {
      this.onTimeUpdate?.(this.audio.currentTime);
    });

    this.audio.addEventListener('durationchange', () => {
      if (isFinite(this.audio.duration)) {
        this.onDurationChange?.(this.audio.duration);
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (isFinite(this.audio.duration)) {
        this.onDurationChange?.(this.audio.duration);
      }
    });

    this.audio.addEventListener('ended', () => {
      this.onEnded?.();
    });

    this.audio.addEventListener('play', () => {
      this.onPlay?.();
    });

    this.audio.addEventListener('pause', () => {
      this.onPause?.();
    });

    this.audio.addEventListener('error', () => {
      const code = this.audio.error?.code;
      const msg = this.audio.error?.message || `Audio error (code ${code})`;
      console.error('[Audio]', msg, 'src=', this.audio.src);
      this.onError?.(msg);
    });

    this.audio.addEventListener('loadstart', () => this.onBuffering?.(true));
    this.audio.addEventListener('waiting', () => this.onBuffering?.(true));
    this.audio.addEventListener('playing', () => this.onBuffering?.(false));
    this.audio.addEventListener('canplay', () => this.onBuffering?.(false));
  }

  // ── Web Audio graph (lazy init on first play) ──────────────────────────

  private initAudioGraph(): void {
    if (this.audioContext) return;

    this.audioContext = new AudioContext();
    this.sourceNode = this.audioContext.createMediaElementSource(this.audio);

    // Create 5-band parametric EQ
    let prevNode: AudioNode = this.sourceNode;
    this.eqFilters = EQ_FREQUENCIES.map((freq) => {
      const filter = this.audioContext!.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = freq;
      filter.Q.value = EQ_Q;
      filter.gain.value = 0; // flat by default
      prevNode.connect(filter);
      prevNode = filter;
      return filter;
    });

    // Gain node for volume + boost
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = this.computeGain();
    prevNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  }

  private computeGain(): number {
    return this._volume * (this._volumeBoost ? 2.0 : 1.0);
  }

  // ── Public API ─────────────────────────────────────────────────────────

  loadChapter(filePath: string, startTime?: number): void {
    const url = `audiobook-file://${encodeURIComponent(filePath)}`;
    this.audio.src = url;
    this.audio.load();

    if (startTime && startTime > 0) {
      const onCanPlay = () => {
        this.audio.currentTime = startTime;
        this.audio.removeEventListener('canplay', onCanPlay);
      };
      this.audio.addEventListener('canplay', onCanPlay);
    }
  }

  async play(): Promise<void> {
    this.initAudioGraph();
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
    await this.audio.play();
  }

  pause(): void {
    this.audio.pause();
  }

  seek(seconds: number): void {
    this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration || Infinity));
  }

  skip(seconds: number): void {
    this.seek(this.audio.currentTime + seconds);
  }

  setPlaybackRate(rate: number): void {
    this.audio.playbackRate = rate;
  }

  setVolume(v: number): void {
    this._volume = Math.max(0, Math.min(v, 1));
    if (this.gainNode) {
      this.gainNode.gain.value = this.computeGain();
    }
  }

  setVolumeBoost(enabled: boolean): void {
    this._volumeBoost = enabled;
    if (this.gainNode) {
      this.gainNode.gain.value = this.computeGain();
    }
  }

  setEqBands(bands: number[]): void {
    bands.forEach((db, i) => {
      if (this.eqFilters[i]) {
        this.eqFilters[i].gain.value = db;
      }
    });
  }

  get currentTime(): number {
    return this.audio.currentTime;
  }

  get duration(): number {
    return isFinite(this.audio.duration) ? this.audio.duration : 0;
  }

  get paused(): boolean {
    return this.audio.paused;
  }

  get ready(): boolean {
    return this.audio.readyState >= 1;
  }

  get playbackRate(): number {
    return this.audio.playbackRate;
  }

  get volume(): number {
    return this._volume;
  }

  get volumeBoost(): boolean {
    return this._volumeBoost;
  }

  // ── Event registration ─────────────────────────────────────────────────

  on(event: 'timeupdate', cb: TimeUpdateCallback): void;
  on(event: 'durationchange', cb: DurationChangeCallback): void;
  on(event: 'ended' | 'play' | 'pause', cb: AudioEventCallback): void;
  on(event: 'error', cb: ErrorCallback): void;
  on(event: 'buffering', cb: BufferingCallback): void;
  on(event: string, cb: (...args: any[]) => void): void {
    switch (event) {
      case 'timeupdate': this.onTimeUpdate = cb as TimeUpdateCallback; break;
      case 'durationchange': this.onDurationChange = cb as DurationChangeCallback; break;
      case 'ended': this.onEnded = cb as AudioEventCallback; break;
      case 'play': this.onPlay = cb as AudioEventCallback; break;
      case 'pause': this.onPause = cb as AudioEventCallback; break;
      case 'error': this.onError = cb as ErrorCallback; break;
      case 'buffering': this.onBuffering = cb as BufferingCallback; break;
    }
  }

  off(event: string): void {
    switch (event) {
      case 'timeupdate': this.onTimeUpdate = null; break;
      case 'durationchange': this.onDurationChange = null; break;
      case 'ended': this.onEnded = null; break;
      case 'play': this.onPlay = null; break;
      case 'pause': this.onPause = null; break;
      case 'error': this.onError = null; break;
      case 'buffering': this.onBuffering = null; break;
    }
  }

  destroy(): void {
    this.audio.pause();
    this.audio.src = '';
    this.audioContext?.close();
    this.audioContext = null;
    this.sourceNode = null;
    this.eqFilters = [];
    this.gainNode = null;
    this.onBuffering = null;
  }
}

// Singleton
let instance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (!instance) {
    instance = new AudioEngine();
  }
  return instance;
}

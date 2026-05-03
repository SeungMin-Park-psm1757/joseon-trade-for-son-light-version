import { useCallback, useEffect, useMemo, useState } from 'react';

type AudioScene = 'port' | 'market' | 'map' | 'office' | 'shipyard' | 'tavern' | 'danger';
export type SfxKey =
  | 'click'
  | 'door'
  | 'page'
  | 'buy'
  | 'sell'
  | 'reward'
  | 'depart'
  | 'cart'
  | 'arrive'
  | 'danger'
  | 'bandit'
  | 'pirate'
  | 'quest'
  | 'ship'
  | 'repair'
  | 'fish'
  | 'fishCast'
  | 'fishHaul'
  | 'fishSuccess'
  | 'fishFail'
  | 'companion'
  | 'error';

export type AudioSettings = {
  music: boolean;
  sfx: boolean;
  volume: number;
};

type AudioSource = 'file' | 'procedural' | 'none';

type AudioDebugState = {
  unlocked: boolean;
  ctxState: AudioContextState | 'missing' | 'none';
  scene: AudioScene;
  lastSfx: SfxKey | '';
  musicTicks: number;
  musicOn: boolean;
  sfxOn: boolean;
  volume: number;
  musicSource: AudioSource;
  currentTrack: string;
  lastSfxSource: AudioSource;
  lastSfxTrack: string;
  sfxChannels: number;
  ducking: boolean;
  musicFading: boolean;
};

type SfxTrack = { file: string; maxMs: number; volume: number; priority?: number; dedupeMs?: number; duck?: number; duckMs?: number };

const AUDIO_STORAGE_KEY = 'joseon_trade_audio_v1';
const DEFAULT_AUDIO_SETTINGS: AudioSettings = { music: true, sfx: true, volume: 0.62 };
const AUDIO_BASE = '/assets/audio/';

const MUSIC_TRACKS: Record<AudioScene, string[]> = {
  port: [`${AUDIO_BASE}bgm-port-harbor-first-light.mp3`],
  market: [`${AUDIO_BASE}bgm-market-wooden-port.mp3`],
  map: [`${AUDIO_BASE}bgm-map-village-gate.mp3`],
  office: [`${AUDIO_BASE}bgm-office-morning-tide.mp3`],
  shipyard: [`${AUDIO_BASE}bgm-shipyard-dockyard.mp3`],
  tavern: [`${AUDIO_BASE}bgm-tavern-rumors.mp3`],
  danger: [`${AUDIO_BASE}bgm-danger-mountain-pass.mp3`]
};

const SFX_TRACKS: Partial<Record<SfxKey, SfxTrack>> = {
  click: { file: `${AUDIO_BASE}sfx-page-vellum.mp3`, maxMs: 260, volume: 0.28, priority: 1, dedupeMs: 55, duck: 0.82, duckMs: 120 },
  door: { file: `${AUDIO_BASE}sfx-shop-door-bell.mp3`, maxMs: 1300, volume: 0.7, priority: 3, dedupeMs: 160, duck: 0.55, duckMs: 520 },
  page: { file: `${AUDIO_BASE}sfx-page-vellum.mp3`, maxMs: 900, volume: 0.52, priority: 2, dedupeMs: 90, duck: 0.72, duckMs: 260 },
  buy: { file: `${AUDIO_BASE}sfx-buy-market-crossing.mp3`, maxMs: 900, volume: 0.58, priority: 3, dedupeMs: 110, duck: 0.62, duckMs: 330 },
  sell: { file: `${AUDIO_BASE}sfx-sell-silk-salt.mp3`, maxMs: 900, volume: 0.58, priority: 3, dedupeMs: 110, duck: 0.62, duckMs: 330 },
  reward: { file: `${AUDIO_BASE}sfx-reward-pocket-gold.mp3`, maxMs: 1200, volume: 0.58, priority: 4, dedupeMs: 120, duck: 0.5, duckMs: 620 },
  depart: { file: `${AUDIO_BASE}sfx-ship-departure.mp3`, maxMs: 1500, volume: 0.6, priority: 4, dedupeMs: 260, duck: 0.5, duckMs: 650 },
  cart: { file: `${AUDIO_BASE}sfx-cart-jade-waters.mp3`, maxMs: 1200, volume: 0.58, priority: 3, dedupeMs: 180, duck: 0.6, duckMs: 420 },
  arrive: { file: `${AUDIO_BASE}sfx-arrival-salt-air.mp3`, maxMs: 1100, volume: 0.55, priority: 3, dedupeMs: 180, duck: 0.62, duckMs: 420 },
  danger: { file: `${AUDIO_BASE}sfx-danger-joseon-sky.mp3`, maxMs: 1200, volume: 0.62, priority: 5, dedupeMs: 200, duck: 0.46, duckMs: 720 },
  bandit: { file: `${AUDIO_BASE}sfx-bandit-twigs-underfoot.mp3`, maxMs: 1200, volume: 0.65, priority: 5, dedupeMs: 200, duck: 0.46, duckMs: 720 },
  pirate: { file: `${AUDIO_BASE}sfx-pirate-mountain-pass.mp3`, maxMs: 1200, volume: 0.65, priority: 5, dedupeMs: 200, duck: 0.46, duckMs: 720 },
  quest: { file: `${AUDIO_BASE}sfx-discovery-arrival-fanfare.mp3`, maxMs: 4200, volume: 0.58, priority: 4, dedupeMs: 240, duck: 0.48, duckMs: 950 },
  ship: { file: `${AUDIO_BASE}sfx-ship-departure.mp3`, maxMs: 1400, volume: 0.55, priority: 3, dedupeMs: 180, duck: 0.6, duckMs: 420 },
  repair: { file: `${AUDIO_BASE}sfx-repair-market-crossing.mp3`, maxMs: 1000, volume: 0.58, priority: 3, dedupeMs: 130, duck: 0.62, duckMs: 360 },
  fish: { file: `${AUDIO_BASE}sfx-fishing-jade-waters.mp3`, maxMs: 1200, volume: 0.58, priority: 3, dedupeMs: 160, duck: 0.58, duckMs: 420 },
  fishCast: { file: `${AUDIO_BASE}sfx-fishing-jade-waters.mp3`, maxMs: 720, volume: 0.42, priority: 2, dedupeMs: 100, duck: 0.68, duckMs: 260 },
  fishHaul: { file: `${AUDIO_BASE}sfx-fishing-jade-waters.mp3`, maxMs: 980, volume: 0.56, priority: 3, dedupeMs: 130, duck: 0.56, duckMs: 420 },
  fishSuccess: { file: `${AUDIO_BASE}sfx-reward-pocket-gold.mp3`, maxMs: 1300, volume: 0.62, priority: 4, dedupeMs: 160, duck: 0.5, duckMs: 650 },
  fishFail: { file: `${AUDIO_BASE}sfx-danger-joseon-sky.mp3`, maxMs: 780, volume: 0.38, priority: 3, dedupeMs: 160, duck: 0.66, duckMs: 330 },
  companion: { file: `${AUDIO_BASE}sfx-companion-joseon-sky.mp3`, maxMs: 1400, volume: 0.6, priority: 3, dedupeMs: 180, duck: 0.58, duckMs: 430 },
  error: { file: `${AUDIO_BASE}sfx-danger-joseon-sky.mp3`, maxMs: 650, volume: 0.45, priority: 4, dedupeMs: 130, duck: 0.58, duckMs: 360 }
};

function loadSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(AUDIO_STORAGE_KEY);
    if (!raw) return DEFAULT_AUDIO_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AudioSettings>;
    return {
      music: parsed.music ?? DEFAULT_AUDIO_SETTINGS.music,
      sfx: parsed.sfx ?? DEFAULT_AUDIO_SETTINGS.sfx,
      volume: Math.min(1, Math.max(0, parsed.volume ?? DEFAULT_AUDIO_SETTINGS.volume))
    };
  } catch {
    return DEFAULT_AUDIO_SETTINGS;
  }
}

function saveSettings(settings: AudioSettings) {
  try {
    localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Audio settings are optional; gameplay must never fail because of them.
  }
}

class AudioEngine {
  private ctx?: AudioContext;
  private master?: GainNode;
  private musicGain?: GainNode;
  private sfxGain?: GainNode;
  private musicTimer?: number;
  private fileMusicTimer?: number;
  private musicStep = 0;
  private musicTicks = 0;
  private scene: AudioScene = 'port';
  private settings: AudioSettings = DEFAULT_AUDIO_SETTINGS;
  private lastSfx: SfxKey | '' = '';
  private musicAudio?: HTMLAudioElement;
  private musicVariant: Record<AudioScene, number> = {
    port: 0,
    market: 0,
    map: 0,
    office: 0,
    shipyard: 0,
    tavern: 0,
    danger: 0
  };
  private musicSource: AudioSource = 'none';
  private currentTrack = '';
  private lastSfxSource: AudioSource = 'none';
  private lastSfxTrack = '';
  private activeSfx: Array<{ key: SfxKey; audio: HTMLAudioElement; priority: number; stopTimer: number; startedAt: number }> = [];
  private lastSfxAt: Partial<Record<SfxKey, number>> = {};
  private duckTimer?: number;
  private duckLevel = 1;
  private musicFadeTimer?: number;
  private musicFading = false;
  private maxSfxChannels = 5;
  unlocked = false;

  setSettings(settings: AudioSettings) {
    this.settings = settings;
    this.applyGains();
    if (this.musicAudio) this.musicAudio.volume = this.musicVolume();
    if (!settings.music) this.stopMusic();
    if (settings.music && this.unlocked) this.startMusic(this.scene);
    this.publishDebug();
  }

  async unlock() {
    try {
      this.ensureContext();
      if (this.ctx?.state === 'suspended') await this.ctx.resume();
      this.unlocked = Boolean(this.ctx && this.ctx.state !== 'closed');
      this.applyGains();
      if (this.settings.music) this.startMusic(this.scene);
      this.publishDebug();
    } catch {
      this.unlocked = false;
      this.publishDebug();
    }
  }

  async prime(settings?: AudioSettings) {
    if (settings) this.setSettings(settings);
    await this.unlock();
    this.playSfx('quest');
  }

  startMusic(scene: AudioScene) {
    this.scene = scene;
    if (!this.settings.music || !this.unlocked) {
      this.publishDebug();
      return;
    }
    const nextTrack = this.nextMusicTrack(scene);
    if (this.musicAudio && this.musicSource === 'file' && this.currentTrack === nextTrack) {
      this.publishDebug();
      return;
    }
    if (this.tryStartFileMusic(scene)) return;
    this.startProceduralMusic(scene);
  }

  stopMusic() {
    if (this.musicTimer) window.clearInterval(this.musicTimer);
    if (this.fileMusicTimer) window.clearInterval(this.fileMusicTimer);
    if (this.musicFadeTimer) window.clearInterval(this.musicFadeTimer);
    this.musicTimer = undefined;
    this.fileMusicTimer = undefined;
    this.musicFadeTimer = undefined;
    if (this.musicAudio) {
      const audio = this.musicAudio;
      this.fadeAudio(audio, audio.volume, 0, 260, () => {
        audio.pause();
        audio.src = '';
      });
    }
    this.musicAudio = undefined;
    this.musicSource = 'none';
    this.currentTrack = '';
    this.musicFading = false;
    this.publishDebug();
  }

  switchScene(scene: AudioScene) {
    if (this.scene === scene) {
      this.startMusic(scene);
      return;
    }
    this.scene = scene;
    this.startMusic(scene);
  }

  playSfx(key: SfxKey) {
    if (!this.settings.sfx) return;
    this.lastSfx = key;
    void this.unlock().then(() => {
      this.duckForSfx(key);
      if (this.tryPlayFileSfx(key)) return;
      this.playProceduralSfx(key);
    });
    this.publishDebug();
  }

  getDebugState(): AudioDebugState {
    return {
      unlocked: this.unlocked,
      ctxState: this.ctx?.state ?? (typeof window === 'undefined' ? 'none' : 'missing'),
      scene: this.scene,
      lastSfx: this.lastSfx,
      musicTicks: this.musicTicks,
      musicOn: this.settings.music,
      sfxOn: this.settings.sfx,
      volume: this.settings.volume,
      musicSource: this.musicSource,
      currentTrack: this.currentTrack,
      lastSfxSource: this.lastSfxSource,
      lastSfxTrack: this.lastSfxTrack,
      sfxChannels: this.activeSfx.length,
      ducking: this.duckLevel < 1,
      musicFading: this.musicFading
    };
  }

  private nextMusicTrack(scene: AudioScene) {
    const tracks = MUSIC_TRACKS[scene];
    if (!tracks.length) return '';
    const index = this.musicVariant[scene] % tracks.length;
    return tracks[index];
  }

  private tryStartFileMusic(scene: AudioScene) {
    const tracks = MUSIC_TRACKS[scene];
    if (!tracks.length) return false;
    const track = this.nextMusicTrack(scene);
    this.musicVariant[scene] += 1;
    const previous = this.musicAudio;
    const audio = new Audio(track);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = previous ? 0 : this.musicVolume();
    this.musicAudio = audio;
    this.musicSource = 'file';
    this.currentTrack = track;
    void audio.play().then(() => {
      if (this.musicTimer) window.clearInterval(this.musicTimer);
      if (this.fileMusicTimer) window.clearInterval(this.fileMusicTimer);
      this.fileMusicTimer = window.setInterval(() => {
        this.musicTicks += 1;
        this.publishDebug();
      }, 500);
      if (previous && previous !== audio) {
        this.crossfadeMusic(previous, audio);
      } else {
        audio.volume = this.musicVolume();
      }
      this.publishDebug();
    }).catch(() => {
      if (this.musicAudio === audio) {
        this.musicAudio = undefined;
        this.musicSource = 'none';
        this.currentTrack = '';
        this.startProceduralMusic(scene);
      }
    });
    this.publishDebug();
    return true;
  }

  private tryPlayFileSfx(key: SfxKey) {
    const track = SFX_TRACKS[key];
    if (!track) return false;
    const now = performance.now();
    const lastPlayed = this.lastSfxAt[key] ?? 0;
    if (now - lastPlayed < (track.dedupeMs ?? 80)) {
      this.publishDebug();
      return true;
    }
    this.lastSfxAt[key] = now;
    this.pruneSfxChannels();
    const priority = track.priority ?? 2;
    if (this.activeSfx.length >= this.maxSfxChannels) {
      const lowest = [...this.activeSfx].sort((a, b) => a.priority - b.priority || a.startedAt - b.startedAt)[0];
      if (lowest && lowest.priority <= priority) this.stopSfxChannel(lowest);
      if (this.activeSfx.length >= this.maxSfxChannels) return true;
    }
    const audio = new Audio(track.file);
    audio.preload = 'auto';
    audio.volume = Math.min(1, this.settings.volume * track.volume);
    this.lastSfxSource = 'file';
    this.lastSfxTrack = track.file;
    const channel = { key, audio, priority, stopTimer: 0, startedAt: now };
    const stopTimer = window.setTimeout(() => {
      this.stopSfxChannel(channel);
    }, track.maxMs);
    channel.stopTimer = stopTimer;
    this.activeSfx.push(channel);
    audio.addEventListener('ended', () => this.stopSfxChannel(channel), { once: true });
    void audio.play().catch(() => {
      this.stopSfxChannel(channel);
      this.lastSfxSource = 'procedural';
      this.lastSfxTrack = '';
      this.playProceduralSfx(key);
    });
    this.publishDebug();
    return true;
  }

  private crossfadeMusic(previous: HTMLAudioElement, next: HTMLAudioElement) {
    const duration = 620;
    const started = performance.now();
    const fromVolume = previous.volume;
    const target = this.musicVolume();
    if (this.musicFadeTimer) window.clearInterval(this.musicFadeTimer);
    this.musicFading = true;
    this.musicFadeTimer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / duration);
      const eased = progress * progress * (3 - 2 * progress);
      previous.volume = Math.max(0, fromVolume * (1 - eased));
      next.volume = Math.max(0, target * eased);
      if (progress >= 1) {
        window.clearInterval(this.musicFadeTimer);
        this.musicFadeTimer = undefined;
        previous.pause();
        previous.src = '';
        next.volume = this.musicVolume();
        this.musicFading = false;
        this.publishDebug();
      }
    }, 40);
  }

  private fadeAudio(audio: HTMLAudioElement, from: number, to: number, duration: number, done?: () => void) {
    const started = performance.now();
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / duration);
      audio.volume = from + (to - from) * progress;
      if (progress >= 1) {
        window.clearInterval(timer);
        done?.();
      }
    }, 40);
  }

  private pruneSfxChannels() {
    this.activeSfx = this.activeSfx.filter((channel) => !channel.audio.ended && channel.audio.src);
  }

  private stopSfxChannel(channel: { audio: HTMLAudioElement; stopTimer: number }) {
    window.clearTimeout(channel.stopTimer);
    channel.audio.pause();
    channel.audio.src = '';
    this.activeSfx = this.activeSfx.filter((item) => item !== channel);
    this.publishDebug();
  }

  private duckForSfx(key: SfxKey) {
    const track = SFX_TRACKS[key];
    const level = track?.duck ?? 0.65;
    const duration = track?.duckMs ?? 320;
    this.duckLevel = Math.min(this.duckLevel, level);
    this.applyGains();
    if (this.duckTimer) window.clearTimeout(this.duckTimer);
    this.duckTimer = window.setTimeout(() => {
      this.duckLevel = 1;
      this.applyGains();
      this.publishDebug();
    }, duration);
    this.publishDebug();
  }

  private startProceduralMusic(scene: AudioScene) {
    this.ensureContext();
    if (!this.ctx || !this.musicGain) return;
    if (this.musicTimer) return;
    this.musicSource = 'procedural';
    this.currentTrack = '';
    this.musicStep = 0;
    this.tickMusic();
    this.musicTimer = window.setInterval(() => this.tickMusic(), scene === 'map' ? 430 : scene === 'market' ? 360 : 520);
    this.publishDebug();
  }

  private playProceduralSfx(key: SfxKey) {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    this.lastSfxSource = 'procedural';
    this.lastSfxTrack = '';
    if (key === 'door') {
      this.playTone(1180, now, 0.06, 'triangle', 0.18, this.sfxGain);
      this.playTone(1580, now + 0.065, 0.18, 'sine', 0.13, this.sfxGain);
      return;
    }
    if (key === 'page' || key === 'click') {
      this.playNoise(now, 0.11, 0.08, 900, this.sfxGain);
      this.playTone(520, now + 0.04, 0.07, 'triangle', 0.08, this.sfxGain);
      return;
    }
    if (key === 'fish' || key === 'fishCast' || key === 'fishHaul') {
      this.playTone(330, now, 0.08, 'sine', 0.13, this.sfxGain);
      this.playNoise(now + 0.04, key === 'fishHaul' ? 0.24 : 0.16, key === 'fishCast' ? 0.07 : 0.1, 600, this.sfxGain);
      return;
    }
    const patterns: Record<SfxKey, Array<[number, number, OscillatorType, number]>> = {
      click: [[520, 0.045, 'triangle', 0.18]],
      door: [[1180, 0.06, 'triangle', 0.18], [1580, 0.18, 'sine', 0.13]],
      page: [[520, 0.07, 'triangle', 0.08]],
      buy: [[520, 0.07, 'square', 0.16], [760, 0.08, 'triangle', 0.16]],
      sell: [[820, 0.06, 'triangle', 0.17], [620, 0.08, 'sine', 0.13], [980, 0.08, 'triangle', 0.1]],
      reward: [[660, 0.08, 'triangle', 0.16], [880, 0.1, 'triangle', 0.14], [1180, 0.14, 'sine', 0.12]],
      depart: [[180, 0.12, 'sawtooth', 0.12], [260, 0.16, 'triangle', 0.12], [330, 0.18, 'sine', 0.08]],
      cart: [[220, 0.09, 'square', 0.12], [280, 0.12, 'triangle', 0.1]],
      arrive: [[360, 0.07, 'triangle', 0.14], [520, 0.11, 'sine', 0.13], [720, 0.12, 'triangle', 0.09]],
      danger: [[140, 0.16, 'sawtooth', 0.17], [110, 0.22, 'square', 0.13], [92, 0.28, 'sawtooth', 0.08]],
      bandit: [[160, 0.1, 'square', 0.15], [120, 0.22, 'sawtooth', 0.1]],
      pirate: [[130, 0.14, 'sawtooth', 0.16], [220, 0.18, 'triangle', 0.1]],
      quest: [[580, 0.08, 'triangle', 0.16], [760, 0.08, 'triangle', 0.15], [980, 0.16, 'sine', 0.14]],
      ship: [[180, 0.12, 'triangle', 0.16], [260, 0.16, 'sine', 0.13], [390, 0.22, 'triangle', 0.08]],
      repair: [[300, 0.05, 'square', 0.15], [360, 0.05, 'square', 0.14], [460, 0.1, 'triangle', 0.12]],
      fish: [[330, 0.08, 'sine', 0.13]],
      fishCast: [[280, 0.07, 'sine', 0.1], [420, 0.08, 'triangle', 0.08]],
      fishHaul: [[210, 0.1, 'triangle', 0.13], [300, 0.16, 'sine', 0.1]],
      fishSuccess: [[520, 0.08, 'triangle', 0.15], [760, 0.1, 'sine', 0.14], [980, 0.12, 'triangle', 0.12]],
      fishFail: [[180, 0.12, 'sawtooth', 0.11], [120, 0.18, 'square', 0.08]],
      companion: [[520, 0.08, 'triangle', 0.14], [720, 0.12, 'sine', 0.12]],
      error: [[180, 0.12, 'square', 0.16], [140, 0.14, 'sawtooth', 0.11]]
    };
    patterns[key].forEach(([frequency, duration, type, gain], index) => {
      this.playTone(frequency, now + index * 0.065, duration, type, gain, this.sfxGain!);
    });
  }

  private tickMusic() {
    if (!this.ctx || !this.musicGain || !this.settings.music) return;
    const now = this.ctx.currentTime;
    const patterns: Record<AudioScene, number[]> = {
      port: [392, 494, 587, 494, 440, 523, 659, 523],
      market: [523, 659, 587, 659, 523, 440, 494, 587],
      map: [330, 392, 494, 587, 494, 392, 440, 523],
      office: [349, 440, 523, 440, 392, 494, 587, 494],
      shipyard: [294, 392, 440, 523, 440, 392, 330, 392],
      tavern: [440, 523, 659, 587, 523, 440, 392, 494],
      danger: [196, 233, 262, 233, 220, 196, 175, 196]
    };
    const note = patterns[this.scene][this.musicStep % patterns[this.scene].length];
    const bass = this.scene === 'map' ? note / 2 : this.scene === 'market' ? note / 4 : note / 3;
    this.playTone(note, now, this.scene === 'market' ? 0.18 : 0.24, 'triangle', 0.105, this.musicGain);
    this.playTone(bass, now, 0.38, 'sine', 0.052, this.musicGain);
    this.musicStep += 1;
    this.musicTicks += 1;
    this.publishDebug();
  }

  private ensureContext() {
    if (this.ctx) return;
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    this.ctx = new AudioCtor();
    this.master = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    this.musicGain.connect(this.master);
    this.sfxGain.connect(this.master);
    this.master.connect(this.ctx.destination);
    this.applyGains();
  }

  private applyGains() {
    if (this.master) this.master.gain.value = this.settings.volume;
    if (this.musicGain) this.musicGain.gain.value = (this.settings.music ? 0.42 : 0) * this.duckLevel;
    if (this.sfxGain) this.sfxGain.gain.value = this.settings.sfx ? 0.78 : 0;
    if (this.musicAudio && !this.musicFading) this.musicAudio.volume = this.musicVolume();
  }

  private musicVolume() {
    return this.settings.music ? Math.min(1, this.settings.volume * 0.46 * this.duckLevel) : 0;
  }

  private playTone(frequency: number, start: number, duration: number, type: OscillatorType, gainValue: number, output: GainNode) {
    if (!this.ctx) return;
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(gainValue, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  private playNoise(start: number, duration: number, gainValue: number, filterFrequency: number, output: GainNode) {
    if (!this.ctx) return;
    const sampleRate = this.ctx.sampleRate;
    const frameCount = Math.max(1, Math.floor(sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, frameCount, sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < frameCount; index += 1) {
      channel[index] = (Math.random() * 2 - 1) * (1 - index / frameCount);
    }
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFrequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(gainValue, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  private publishDebug() {
    try {
      (window as unknown as { __JOSEON_AUDIO_DEBUG__?: AudioDebugState }).__JOSEON_AUDIO_DEBUG__ = this.getDebugState();
    } catch {
      // Debug state is only for browser verification.
    }
  }
}

const engine = new AudioEngine();

export function useGameAudio(scene: AudioScene) {
  const [settings, setSettingsState] = useState<AudioSettings>(() => loadSettings());
  const [ready, setReady] = useState(() => engine.unlocked);

  useEffect(() => {
    engine.setSettings(settings);
    saveSettings(settings);
  }, [settings]);

  const unlock = useCallback(async () => {
    await engine.unlock();
    setReady(engine.unlocked);
  }, []);

  const primeAudio = useCallback(async () => {
    const next = {
      music: true,
      sfx: true,
      volume: Math.max(settings.volume, 0.55)
    };
    engine.setSettings(next);
    saveSettings(next);
    setSettingsState(next);
    await engine.prime(next);
    setReady(engine.unlocked);
  }, [settings]);

  useEffect(() => {
    const unlockOnGesture = () => {
      void unlock();
    };
    window.addEventListener('pointerdown', unlockOnGesture, { once: true });
    window.addEventListener('keydown', unlockOnGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
    };
  }, [unlock]);

  useEffect(() => {
    engine.switchScene(scene);
  }, [scene]);

  const playSfx = useCallback((key: SfxKey) => {
    engine.playSfx(key);
    setReady(engine.unlocked);
  }, []);

  return useMemo(() => ({
    settings,
    unlocked: ready,
    playSfx,
    primeAudio,
    toggleMusic: () => setSettingsState((current) => ({ ...current, music: !current.music })),
    toggleSfx: () => setSettingsState((current) => ({ ...current, sfx: !current.sfx })),
    setVolume: (volume: number) => setSettingsState((current) => ({ ...current, volume: Math.min(1, Math.max(0, volume)) }))
  }), [playSfx, primeAudio, ready, settings]);
}

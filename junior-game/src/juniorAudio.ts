import { useCallback, useEffect, useMemo, useState } from 'react';

export type JuniorAudioScene = 'city' | 'market' | 'map' | 'travel' | 'event' | 'shop' | 'ending';
export type JuniorSfxKey = 'click' | 'buy' | 'sell' | 'depart' | 'cart' | 'arrive' | 'event' | 'correct' | 'wrong' | 'reward' | 'shop';

export type JuniorAudioSettings = {
  music: boolean;
  sfx: boolean;
  volume: number;
};

type JuniorAudioDebug = {
  unlocked: boolean;
  scene: JuniorAudioScene;
  musicOn: boolean;
  sfxOn: boolean;
  volume: number;
  currentTrack: string;
  lastSfx: JuniorSfxKey | '';
  fileBacked: boolean;
};

const JUNIOR_AUDIO_KEY = 'joseon_trade_junior_audio_v1';
const DEFAULT_SETTINGS: JuniorAudioSettings = { music: true, sfx: true, volume: 0.58 };

function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}

const MUSIC: Record<JuniorAudioScene, string> = {
  city: assetUrl('assets/audio/bgm-port-harbor-first-light.mp3'),
  market: assetUrl('assets/audio/bgm-market-wooden-port.mp3'),
  map: assetUrl('assets/audio/bgm-map-village-gate.mp3'),
  travel: assetUrl('assets/audio/bgm-map-road-to-sea.mp3'),
  event: assetUrl('assets/audio/bgm-event-southern-tide.mp3'),
  shop: assetUrl('assets/audio/bgm-shipyard-dockyard.mp3'),
  ending: assetUrl('assets/audio/sfx-discovery-arrival-fanfare.mp3')
};

const SFX: Record<JuniorSfxKey, string> = {
  click: assetUrl('assets/audio/sfx-page-vellum.mp3'),
  buy: assetUrl('assets/audio/sfx-buy-market-crossing.mp3'),
  sell: assetUrl('assets/audio/sfx-sell-silk-salt.mp3'),
  depart: assetUrl('assets/audio/sfx-ship-departure.mp3'),
  cart: assetUrl('assets/audio/sfx-cart-jade-waters.mp3'),
  arrive: assetUrl('assets/audio/sfx-arrival-salt-air.mp3'),
  event: assetUrl('assets/audio/sfx-danger-joseon-sky.mp3'),
  correct: assetUrl('assets/audio/sfx-reward-pocket-gold.mp3'),
  wrong: assetUrl('assets/audio/sfx-danger-joseon-sky.mp3'),
  reward: assetUrl('assets/audio/sfx-reward-pocket-gold.mp3'),
  shop: assetUrl('assets/audio/sfx-shop-door-bell.mp3')
};

function loadSettings(): JuniorAudioSettings {
  try {
    const raw = localStorage.getItem(JUNIOR_AUDIO_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<JuniorAudioSettings>;
    return {
      music: parsed.music ?? DEFAULT_SETTINGS.music,
      sfx: parsed.sfx ?? DEFAULT_SETTINGS.sfx,
      volume: Math.min(1, Math.max(0, parsed.volume ?? DEFAULT_SETTINGS.volume))
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: JuniorAudioSettings) {
  try {
    localStorage.setItem(JUNIOR_AUDIO_KEY, JSON.stringify(settings));
  } catch {
    // Sound settings are optional; saving must never stop the game.
  }
}

class JuniorAudioEngine {
  private ctx?: AudioContext;
  private music?: HTMLAudioElement;
  private settings: JuniorAudioSettings = DEFAULT_SETTINGS;
  private scene: JuniorAudioScene = 'city';
  private lastSfx: JuniorSfxKey | '' = '';
  private currentTrack = '';
  private fileBacked = false;
  unlocked = false;

  setSettings(settings: JuniorAudioSettings) {
    this.settings = settings;
    if (this.music) this.music.volume = this.musicVolume();
    if (!settings.music) this.stopMusic();
    if (settings.music && this.unlocked) this.startMusic(this.scene);
    this.publish();
  }

  async prime(settings?: JuniorAudioSettings) {
    if (settings) this.setSettings(settings);
    await this.unlock();
    this.playSfx('click');
  }

  switchScene(scene: JuniorAudioScene) {
    this.scene = scene;
    this.startMusic(scene);
  }

  async unlock() {
    if (this.unlocked) return;
    try {
      const AudioCtor = window.AudioContext ?? window.webkitAudioContext;
      if (AudioCtor) {
        this.ctx = this.ctx ?? new AudioCtor();
        if (this.ctx.state === 'suspended') await this.ctx.resume();
      }
      this.unlocked = true;
      this.startMusic(this.scene);
    } catch {
      this.unlocked = false;
    }
    this.publish();
  }

  startMusic(scene: JuniorAudioScene) {
    this.scene = scene;
    if (!this.settings.music || !this.unlocked) {
      this.publish();
      return;
    }
    const track = MUSIC[scene];
    if (this.music && this.currentTrack === track) return;
    this.stopMusic();
    const audio = new Audio(track);
    audio.loop = scene !== 'ending';
    audio.preload = 'auto';
    audio.volume = this.musicVolume();
    this.music = audio;
    this.currentTrack = track;
    void audio.play().then(() => {
      this.fileBacked = true;
      this.publish();
    }).catch(() => {
      this.fileBacked = false;
      this.playTone(scene === 'event' ? 260 : 392, 0.12, 0.035);
      this.publish();
    });
  }

  stopMusic() {
    if (!this.music) return;
    this.music.pause();
    this.music.src = '';
    this.music = undefined;
    this.currentTrack = '';
  }

  playSfx(key: JuniorSfxKey) {
    if (!this.settings.sfx) return;
    this.lastSfx = key;
    void this.unlock().then(() => {
      const audio = new Audio(SFX[key]);
      audio.preload = 'auto';
      audio.volume = Math.min(1, this.settings.volume * (key === 'wrong' || key === 'event' ? 0.42 : 0.62));
      void audio.play().catch(() => {
        const notes: Record<JuniorSfxKey, number> = {
          click: 520,
          buy: 660,
          sell: 740,
          depart: 392,
          cart: 330,
          arrive: 784,
          event: 220,
          correct: 880,
          wrong: 196,
          reward: 988,
          shop: 620
        };
        this.playTone(notes[key], key === 'wrong' ? 0.16 : 0.11, key === 'wrong' ? 0.05 : 0.08);
      });
      window.setTimeout(() => {
        audio.pause();
        audio.src = '';
      }, key === 'depart' ? 1500 : 900);
    });
    this.publish();
  }

  getDebug(): JuniorAudioDebug {
    return {
      unlocked: this.unlocked,
      scene: this.scene,
      musicOn: this.settings.music,
      sfxOn: this.settings.sfx,
      volume: this.settings.volume,
      currentTrack: this.currentTrack,
      lastSfx: this.lastSfx,
      fileBacked: this.fileBacked
    };
  }

  private musicVolume() {
    return Math.min(0.52, this.settings.volume * 0.46);
  }

  private playTone(frequency: number, duration: number, gainValue: number) {
    if (!this.ctx) return;
    const gain = this.ctx.createGain();
    const oscillator = this.ctx.createOscillator();
    const now = this.ctx.currentTime;
    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue * this.settings.volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(this.ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  private publish() {
    window.__JUNIOR_AUDIO_DEBUG__ = this.getDebug();
  }
}

const engine = new JuniorAudioEngine();

export function useJuniorAudio(scene: JuniorAudioScene) {
  const [settings, setSettings] = useState<JuniorAudioSettings>(() => loadSettings());
  const [unlocked, setUnlocked] = useState(engine.unlocked);

  useEffect(() => {
    engine.setSettings(settings);
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    engine.switchScene(scene);
  }, [scene, settings.music]);

  const prime = useCallback(async () => {
    await engine.prime(settings);
    setUnlocked(engine.unlocked);
  }, [settings]);

  const playSfx = useCallback((key: JuniorSfxKey) => {
    engine.playSfx(key);
    setUnlocked(engine.unlocked);
  }, []);

  return useMemo(() => ({
    settings,
    unlocked,
    prime,
    playSfx,
    toggleMusic: () => setSettings((current) => ({ ...current, music: !current.music })),
    toggleSfx: () => setSettings((current) => ({ ...current, sfx: !current.sfx })),
    setVolume: (volume: number) => setSettings((current) => ({ ...current, volume: Math.min(1, Math.max(0, volume)) }))
  }), [playSfx, prime, settings, unlocked]);
}

export function playJuniorSuccessSound() {
  engine.playSfx('reward');
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    __JUNIOR_AUDIO_DEBUG__?: JuniorAudioDebug;
  }
}

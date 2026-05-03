# Audio Asset Manifest

Updated: 2026-04-28

The MP3 files in `starter/public/assets/audio/` are user-generated assets made for this project. No third-party download was added by Codex in this pass.

## Web Runtime Files

All files were recompressed with `ffmpeg-static` for web delivery.

| File | Use | Notes |
|---|---|---|
| `bgm-port-jade-harbor.mp3` | Port BGM | Calm harbor loop, 64 kbps mono |
| `bgm-port-wooden-dock.mp3` | Port alternate BGM | Wooden dock mood, 64 kbps mono |
| `bgm-market-valley-day.mp3` | Market BGM | Brighter market loop, 64 kbps mono |
| `bgm-map-road-to-sea.mp3` | Map/travel BGM | Land and route planning loop, 64 kbps mono |
| `bgm-sea-salt-air.mp3` | Sea/travel BGM | Sailing mood loop, 64 kbps mono |
| `bgm-event-southern-tide.mp3` | Event mood reserve | Danger/event loop reserve, 64 kbps mono |
| `sfx-quest-palace-gate.mp3` | Quest complete | Trimmed short cue |
| `sfx-shop-door-bell.mp3` | Market/facility entry | Trimmed short cue |
| `sfx-buy-market-crossing.mp3` | Buy goods | Trimmed short cue |
| `sfx-sell-silk-salt.mp3` | Sell goods | Trimmed short cue |
| `sfx-reward-pocket-gold.mp3` | Money/reward | Trimmed short cue |
| `sfx-page-vellum.mp3` | Page/click | Trimmed short cue |
| `sfx-ship-departure.mp3` | Ship departure/call | Trimmed short cue |
| `sfx-arrival-salt-air.mp3` | Arrival | Trimmed short cue |
| `sfx-cart-jade-waters.mp3` | Cart departure | Trimmed short cue |
| `sfx-danger-joseon-sky.mp3` | Generic danger | Trimmed short cue |
| `sfx-bandit-twigs-underfoot.mp3` | Bandit event | Trimmed short cue |
| `sfx-pirate-mountain-pass.mp3` | Pirate event | Trimmed short cue |
| `sfx-repair-market-crossing.mp3` | Repair | Trimmed short cue |
| `sfx-fishing-jade-waters.mp3` | Fishing | Trimmed short cue |
| `sfx-companion-joseon-sky.mp3` | Companion join | Trimmed short cue |

## Size Result

Before this pass, most BGM/SFX source MP3 files were around 1.3-2.2 MB each. Runtime files are now:

- BGM: about 460-500 KB each.
- SFX: about 9-29 KB each.
- Total runtime audio folder: about 3.0 MB.

The original user-generated files in `bgm/` were left untouched for review and re-export.

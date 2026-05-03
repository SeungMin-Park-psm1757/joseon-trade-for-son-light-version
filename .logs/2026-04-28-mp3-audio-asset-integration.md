# 2026-04-28 MP3 Audio Asset Integration

## 1. Change Summary

- Copied the user-generated MP3 files from `bgm/` into `starter/public/assets/audio/` with stable numbered names.
- Updated `starter/src/audio.ts` so MP3 playback is the primary BGM/SFX source.
- Kept Web Audio procedural tones/noise as fallback when media playback fails.
- Added distinct route/event SFX: land cart, sea departure, bandit, pirate, fishing, companion join.
- Strengthened smoke tests so they verify file-backed audio, not just procedural fallback.

## 2. Asset Mapping

The source files were sorted by `LastWriteTime, Name`, matching the user-provided prompt order.

| Stable file | Use |
|---|---|
| `01_common_joseon_loop.mp3` | Port/common BGM variant |
| `02_harbor_bgm.mp3` | Port/harbor BGM variant |
| `03_market_bgm.mp3` | Market BGM |
| `04_map_travel_bgm.mp3` | Map/travel BGM variant |
| `05_sea_departure_bgm.mp3` | Map/sea travel BGM variant |
| `06_danger_event_bgm.mp3` | Reserved danger-event music/stinger |
| `07_quest_complete_jingle.mp3` | Quest complete / sound-prime jingle |
| `08_shop_door_bell.mp3` | Market/shop entry |
| `09_buy_item.mp3` | Buy item |
| `10_sell_item.mp3` | Sell item |
| `11_money_reward.mp3` | Reward / money |
| `12_page_turn.mp3` | Page/map/ledger/click |
| `13_ship_departure.mp3` | Ship departure / ship call |
| `14_arrival.mp3` | Arrival |
| `15_cart_departure.mp3` | Land cart departure |
| `16_danger_alert.mp3` | Generic danger / blocked warning |
| `17_bandit_event.mp3` | Bandit/tiger/land danger |
| `18_pirate_event.mp3` | Pirate/sea danger |
| `19_repair.mp3` | Repair |
| `20_fishing.mp3` | Fishing |
| `21_companion_join.mp3` | Companion recruitment |

## 3. Implementation Notes

- BGM uses looping `HTMLAudioElement` tracks.
- SFX uses one-shot `HTMLAudioElement` playback with short maximum durations so long generated files do not overrun the UI.
- Browser autoplay policy is respected through the existing `소리 시작` button and pointer/key unlock.
- `window.__JOSEON_AUDIO_DEBUG__` now exposes:
  - `musicSource`
  - `currentTrack`
  - `lastSfxSource`
  - `lastSfxTrack`
  - `musicTicks`

## 4. Test Results

Original workspace:

- `npm run validate:data`: passed.
- `npm run audit:consistency`: passed with the expected non-Git-checkout warning.
- `npm run build`: failed due the known Google Drive `node_modules/.bin/tsc` path issue.

Temp copy:

- Path: `C:\Users\QuIC\AppData\Local\Temp\joseon-trade-ui-crew-pass`
- `npm run build`: passed.
- `npm run test:smoke`: passed, 4 tests.
- `npm run test:visual`: passed.

The smoke test now confirms:

- audio unlock works
- `AudioContext` reaches `running`
- market scene uses file-backed BGM
- market track is `03_market_bgm.mp3`
- shop-entry SFX uses `08_shop_door_bell.mp3`
- BGM ticks increase

## 5. Remaining Limits

- Several generated SFX files are long MP3s, so playback is intentionally clipped with `maxMs`.
- `06_danger_event_bgm.mp3` is copied and reserved, but the current event UI uses short danger stingers rather than switching to a full danger BGM layer.
- Future polish can add event-scoped temporary music ducking and fade transitions.

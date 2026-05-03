# 2026-04-28 Audio Recheck Pass

## 1. Change Summary

- Rebuilt the Web Audio helper so BGM/SFX clearly unlock after a user gesture.
- Added a visible `소리 시작` button in the status bar.
- Increased default volume and gain levels so procedural audio is easier to hear.
- Added differentiated SFX cues for market entry, ledger/page actions, fishing, blocked actions, buying, selling, travel, reward, danger, ship call, and repair.
- Added Playwright smoke verification for audio context unlock, scene switching, market-entry door cue, and BGM tick activity.

## 2. Audio Structure

File:

- `starter/src/audio.ts`

The audio system still uses Web Audio API procedural tones and noise. No external audio files were imported, so no additional license risk was introduced.

Key points:

- Browser autoplay policy is respected.
- Audio starts only after pointer/key input or the explicit `소리 시작` button.
- Audio settings remain stored in `joseon_trade_audio_v1`.
- Debug state is exposed as `window.__JOSEON_AUDIO_DEBUG__` for automated browser verification.

## 3. BGM

Procedural loops are separated by scene:

- Port: slower calm pentatonic-style pattern.
- Market: brighter, quicker shop rhythm.
- Map: slightly more adventurous travel rhythm.

## 4. SFX

Added/strengthened:

- `door`: market/facility entry bell-like cue.
- `page`: map, quest, cargo, ledger style page cue.
- `buy`: item purchase.
- `sell`: item sale / money cue.
- `fish`: fishing splash cue.
- `error`: blocked action warning.
- `depart`, `arrive`, `danger`, `quest`, `ship`, `repair`, `reward`.

## 5. UI

- Status bar audio controls now include an explicit `소리 시작` / `소리` state button.
- Music toggle, SFX toggle, and volume slider remain compact.
- The locked state uses a warm highlight so the player knows sound still needs a tap.

## 6. Verification

Original workspace:

- `npm run validate:data`: passed.
- `npm run audit:consistency`: passed with the expected warning that this local folder is not a Git checkout.
- `npm run build`: failed due the known Google Drive `node_modules/.bin`/`tsc` path issue.

Temp copy:

- Path: `C:\Users\QuIC\AppData\Local\Temp\joseon-trade-ui-crew-pass`
- `npm run build`: passed.
- `npm run test:smoke`: passed, 4 tests.
- `npm run test:visual`: passed.

Smoke now includes:

- Audio unlock state becomes true.
- AudioContext reaches `running`.
- Market tab switches the audio scene to `market`.
- Last SFX becomes `door`.
- BGM music tick count increases above 0.

## 7. Remaining Limits

- The current BGM/SFX are procedural, lightweight, and safe, but not as rich as recorded traditional instruments.
- If richer music is needed later, use only public-domain or clearly licensed files and record them in `asset_plan/LICENSE_CHECKLIST.md`.
- Future audio pass can add short licensed loops for calm harbor, lively market, route travel, and danger events.

# Audio Asset Integration Prompt

You are the principal engineer + browser game audio designer for the mobile landscape pixel-art Joseon trade RPG `팔도상단: 조선의 바람`.

The user generated MP3 files under `bgm/` using the previously supplied music/SFX prompts. The files are in prompt order. Integrate them into the game, keeping browser autoplay policy, mobile usability, and fallback safety in mind.

## Goals

1. Copy the generated MP3 files into the public asset tree with stable names.
2. Map the files in prompt order:
   - common/port BGM
   - harbor BGM
   - market BGM
   - map/travel BGM
   - sea/travel BGM
   - danger event BGM/stinger
   - quest complete jingle
   - shop door bell
   - buy
   - sell
   - money reward
   - page/ledger
   - ship departure
   - arrival
   - cart departure
   - danger alert
   - bandit event
   - pirate event
   - repair
   - fishing
   - companion join
3. Make MP3 playback the primary audio source.
4. Keep the existing Web Audio procedural sounds as fallback.
5. Respect autoplay: audio starts only after a user gesture or the explicit `소리 시작` button.
6. Keep music/SFX/volume settings in localStorage.
7. Add debug state so Playwright can verify audio source, current track, SFX source, and BGM ticks.
8. Update smoke tests, asset plan, and work log.

## Verification

Run:

- `npm run validate:data`
- `npm run audit:consistency`
- `npm run build`
- `npm run test:smoke`
- `npm run test:visual`

If Google Drive path issues break build in the original workspace, verify in a temp copy and record that in the log.

## Reporting

Report:

- asset mapping
- BGM/SFX behavior
- test results
- local URL
- remaining limits

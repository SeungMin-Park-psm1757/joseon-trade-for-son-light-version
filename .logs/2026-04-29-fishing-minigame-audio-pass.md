# 2026-04-29 Fishing Minigame Narrative Audio Pass

## Scope

- Replace one-click fishing rewards with a compact minigame.
- Make the guide spirit react during fishing instead of acting as static decoration.
- Improve runtime audio overlap behavior with channel limits, dedupe, fade, and ducking.

## Changed Files

- `starter/src/App.tsx`
- `starter/src/audio.ts`
- `starter/src/styles.css`
- `starter/src/types.ts`
- `starter/tests/smoke.spec.ts`
- `PLAN.md`

## Fishing Flow

1. Preparation: player opens fishing from a fishing-capable port and reads tide, month, fatigue, ship, and risk.
2. Ground choice: safe harbor shoal, open current, or reef shadow. Each has risk, yield, timing, haul, and reward profile.
3. Timing: player chooses a current window on a pixel gauge.
4. Haul: player chooses a net recovery method based on the catch signal.
5. Result: success, normal, or failure applies cargo, fatigue, morale, possible ship damage, ledger record, quest progress, and autosave.

## Guide Spirit States

- First fishing: calm tutorial line.
- Good fishing port: happy encouragement.
- Storm or rough sea: warning line.
- Cast stage: spot-specific hint.
- Correct timing: happy response before hauling.
- Missed timing: warning response.
- Success or big catch: happy result line.
- Failure or empty net: warning result line.

## Audio Changes

- File BGM now crossfades during scene switches instead of hard stop/start.
- SFX uses a 5-channel pool with priority. Higher priority cues can replace low priority spam.
- Repeated identical cues are deduped with short cooldowns.
- SFX ducks BGM briefly; strong cues such as danger, quest, departure, and reward duck more deeply.
- Fishing received separate cast, haul, success, and fail cue keys while reusing local audio assets.

## Verification

- `npm run build`: passed.
- `npm run test:smoke`: passed, 6 tests including the new fishing minigame flow.
- Browser screenshots captured in `.logs/gameplay-audio-narrative-pass/`.
- 844x390, 1365x768, 1920x1080: no horizontal overflow.
- 844x390, 1365x768, 1920x1080: fishing hero CTA is clear of the tutorial coach.
- 844x390, 1365x768, 1920x1080: fishing result CTA is visible.
- Ledger record appears after accepting the fishing result.

## Remaining Risks

- Fishing values are deterministic enough for smoke tests but still need longer balance playtests across other fishing ports and storm months.
- Fishing BGM is still the port scene track; a dedicated fishing loop could be added later.
- Current catch display uses existing goods icons rather than separate fish sprites per rarity.

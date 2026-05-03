# 2026-04-29 Sale Guide, Companion, Equipment Pass Prompt

You are the principal engineer, pixel-art UX designer, browser playtester, and systems designer for `팔도상단: 조선의 바람`.

Work without asking questions. Keep the game scoped to the current Joseon trade MVP. Do not add mainland China, mainland Japan, port investment, server save, or real-time combat.

## Goal

Make the next long polish pass feel like a real game system pass:

1. Owned cargo should directly tell the player where to sell on the map.
2. Companions and personal equipment should visibly help in event choices, not only sit in a stats panel.
3. Personal equipment should have a clearer growth path after the first basic tools.
4. The work must be verified by data validation, build, smoke tests, visual checks, and browser screenshots.

## Required Work

### A. Map Sale Guide Overlay

- If the player owns cargo and a profitable adjacent sale route exists, highlight the destination port and route on the map.
- Show a small floating map label with the good icon, destination, and expected profit.
- The map route preview should default to the best sale route when no route is manually selected.
- The route panel should distinguish:
  - "지금 팔 곳"
  - "다음에 살 것"
- Clicking recommended sale cards must continue to select the route.

### B. Companion And Tool Event Help

- Add a helper that calculates effective skill values from:
  - base `state.skills`
  - owned tool stats
  - joined companion stats
- Skill checks should use these effective values.
- Combat resolution should use guard/tool/companion stats.
- Event choice buttons should show short support hints such as:
  - `항해 3 / 목표 7`
  - `교역 2 / 목표 7`
  - `호위 +3`
  - `필요: 목재 1`
- Choices that require missing goods or permits should be visibly disabled with a clear hint.

### C. Equipment Growth Path

- Keep existing `tools.json` structure if possible.
- If more tools are added, add only a few sensible tier upgrades:
  - better guard tool
  - better fishing tool
  - better navigation tool
  - better trade tool
  - better language/trade preparation tool
- Show owned/basic/next tools in a compact visual "personal kit path".
- Avoid adding heavy inventory complexity.

### D. Verification

Run:

- `npm run validate:data`
- `npm run audit:consistency`
- `npm run build`
- `npm run test:smoke`
- `npm run test:visual`

If the Google Drive path fails on build, verify in a temp copy and keep source changes in the original workspace.

Use Playwright/browser screenshots at 844x390 and save them to:

`.logs/sale-guide-companion-equipment-pass/`

Required screenshots:

- `map-sale-guide.png`
- `event-choice-support.png`
- `equipment-kit-path.png`

## Completion Report

Report:

- Changed files
- Implemented systems
- Test results
- Browser verification
- Remaining limits
- Next recommended pass, then immediately start that next pass if time remains.

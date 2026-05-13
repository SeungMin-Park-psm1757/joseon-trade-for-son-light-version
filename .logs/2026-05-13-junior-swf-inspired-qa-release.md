# Junior SWF-Inspired QA Release Log

Date: 2026-05-14
Branch: `codex/junior-swf-inspired-redesign`

## 1. Implementation QA Result

Automated browser playthrough covered:

1. App launch.
2. Start flow.
3. Today's goal card.
4. Market purchase.
5. Cargo feedback.
6. Map city selection.
7. Route card.
8. Travel scene.
9. Tutorial event/quiz.
10. Result card.
11. First sale.
12. Equipment goal.
13. Handcart and boat purchase.
14. City stamps and badges.
15. Ending hint.
16. Ending selection.

Result: Pass.

First loop automated result:

- Elapsed browser automation time: 8 seconds.
- Coins after first buy/travel/event/sale loop: 44.
- Stars after first loop: 2.
- Console/page/asset errors: 0.

## 2. Child UX Review

- Start action is visible immediately.
- "오늘 할 일" gives one clear next action.
- Market cards keep the child inside the market after buy/sell.
- Money feedback appears immediately after buy/sell.
- Route card does not expose risk numbers.
- Event result card uses short reward chips.
- Wrong answers do not end the game.
- Equipment goal and upgrade celebration make the handcart/boat goal visible.
- 300 coin ending hint appears clearly.

No extra feature work was added in this QA pass.

## 3. Balance Review

Target pacing:

- First trade success: 3-5 minutes.
- 100 coins: 8-12 minutes.
- Handcart: around 10 minutes.
- Boat: 15-20 minutes.
- Ending: 20-30 minutes.

Judgment:

- Current economy fits the target range.
- Same-city resale protection works.
- Event penalties are not too harsh for junior mode.
- No balance numbers were changed in this QA pass.

## 4. Mobile And PWA Review

Local viewport checks:

| Viewport | Result |
| --- | --- |
| 360x800 | Pass |
| 390x844 | Pass |
| 412x915 | Pass |
| 430x932 | Pass |
| 844x390 | Pass |

PWA checks:

- Manifest: Pass.
- Service worker file: Pass.
- Offline fallback file: Pass.
- Primary CTA not hidden by viewport bottom: Pass.
- Local console/page/asset errors: 0.

GitHub Pages pre-push check:

- URL: `https://seungmin-park-psm1757.github.io/joseon-trade-for-son-light-version/`
- HTTP status: 200.
- Title: `정우의 꼬마 거상 모험`.
- Manifest/service worker/offline fallback: Pass.
- Console/page/request issues: 0.

## 5. Test Result

Commands:

```bash
cd junior-game
npm run build
npm run test
```

Results:

- `npm run build`: Pass.
- `npm run test`: Pass, 72 passed.

Root repository:

- No root `package.json` exists, so root `npm run build` / `npm run test` are not applicable.

## 6. Commit Scope Guard

Do not include:

- `starter/`
- `reference-swf/`
- `swf reference/`
- SWF originals or extracted assets
- full-mode implementation files

Commit candidates are junior-game files and junior-specific docs/logs only.

## 7. Remaining Limits

- This is not a real child playtest. It is automated QA plus child-UX review.
- Timing targets should be confirmed with one child and one quiet adult observer.
- If boat progression feels slow in real play, lower the small ferry cost from 200 to 180.

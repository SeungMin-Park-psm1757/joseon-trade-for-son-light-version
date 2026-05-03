# Scene-first UI Pass 2 Review Addendum

## Self Review

- Initial reviewed score: 82/100.
- Reason: the quest screen had the right direction but the first-30-minute route did not dominate enough; the equipment screen still showed the purchase list too prominently at 844x390; the ledger screen showed cargo before achievement progress.
- Final reviewed score after additional polish: 87/100.

## Additional Fixes

- Quest screen: widened the main progression area at compact landscape sizes and reduced the office side panel footprint.
- Equipment screen: restored a two-column compact landscape layout so the growth hero stays dominant while the purchase list becomes a smaller side signboard.
- Equipment screen: compressed shop rows in compact landscape so the right panel reads as a support dock rather than the main screen.
- Ledger/codex screen: reordered sections so codex progress and next achievement appear before cargo details.
- Re-captured the pass-2 screens into a new after folder.

## Before / After Captures

- Before: `.logs/scene-first-ui-pass-2/`
- After: `.logs/scene-first-ui-pass-2-after/`

Key after screenshots:

- `quests-main-844x390.png`
- `first-30-growth-route-844x390.png`
- `equipment-main-844x390.png`
- `equipment-purchase-modal-844x390.png`
- `ledger-achievements-844x390.png`
- `ledger-seals-achievements-844x390.png`

## Verification

- `npm run validate:data`: success.
- `npm run audit:consistency`: success with the expected temp-copy Git checkout warning.
- `npm run build`: success.
- `npm run test:smoke`: success, 5 passed.
- `npm run test:visual`: success.

## Remaining Limits

- Quest growth route is now clearer, but a dedicated illustrated pixel route would be stronger.
- Equipment screen still has a purchasable ship/cart side dock, but it is no longer the dominant first read.
- Ledger achievement cards are clearer, but item-level codex detail popovers are still future work.

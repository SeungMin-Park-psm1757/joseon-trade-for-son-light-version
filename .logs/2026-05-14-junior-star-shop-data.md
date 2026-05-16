# 2026-05-14 junior star shop data

## 별 구조 변경

- Added `totalStarsEarned` for lifetime stars.
- Added `starBalance` for spendable stars.
- Kept `stars` as a compatibility alias for the visible balance.
- Added `ownedStarItemIds`, `equippedStarItems`, and `consumableItems`.

## 저장 마이그레이션

- Old saves with only `stars` are normalized into both `totalStarsEarned` and `starBalance`.
- Spending stars reduces only `starBalance`.
- Badge checks now use `totalStarsEarned`.

## 아이템 목록

- Added 18 star items in `JUNIOR_STAR_ITEMS`.
- Cosmetic items include weapon decorations, armor skins, old tools, badges, and fairy decorations.
- Consumables include fast travel, half-price good, cargo guard, quiz retry, market tip, and extra rumor tickets.

## 소모성 아이템 정책

- Consumables are convenience-only.
- They do not replace coins or improve trading stats directly.
- Their effect metadata is present; detailed effect hooks can be connected in a later pass.

## 테스트 결과

- Targeted star tests passed: legacy migration, reward increase, spending, item data validity, consumable effects, cosmetic no-stat policy, shop purchase flow.
- Full junior verification passed on 2026-05-16:
  - `cd junior-game && npm run build`
  - `cd junior-game && npm run test -- --reporter=line`
  - Result: 144/144 Playwright tests passed across junior portrait and landscape projects.

## 남은 한계

- Individual consumable effects are represented in state/data but not yet wired into travel, market, quiz, and rumor flows.
- Star shop art currently reuses existing safe internal icons.

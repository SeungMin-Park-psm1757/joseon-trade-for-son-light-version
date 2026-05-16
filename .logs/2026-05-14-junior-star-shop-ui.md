# 2026-05-14 junior star shop UI

## 별 상점 진입 방식

- The top-bar `별 N` chip is now a button.
- Tapping it opens a separate reward menu instead of adding another bottom tab.
- The cart/boat screen no longer carries star-shop item cards.

## 보물함 구조

- The reward menu has two modes: `별 상점` and `보물함`.
- `별 상점` has three tabs: `꾸미기`, `요정`, `소모품`.
- `보물함` shows Jeongwoo preview labels, Barami preview labels, equipped decorations, owned cosmetics, and owned consumables.

## 착용 로직

- Cosmetics use one item per slot.
- Supported visible slots: weapon, armor, tool, badge, fairy.
- `equipStarItem` stores the selected item id in `equippedStarItems`.
- `unequipStarItem` removes only the selected slot.
- Cosmetic items do not change coins, cargo, prices, route access, or combat.

## 구매 로직

- `buyStarItem` spends only `starBalance`.
- `totalStarsEarned` is preserved after purchases.
- Non-consumable cosmetics cannot be bought twice in the UI.
- Consumables increase `consumableItems[itemId]` until `maxOwned`.
- Not-enough-star items are disabled and say `별이 부족해`.

## 저장 로직

- Existing migration from legacy `stars` remains in place.
- Equipped items and consumable counts are stored in the junior save key `joseon_trade_junior_save_v1`.

## 테스트 결과

- Targeted Playwright pass: star chip, purchase, lifetime-star preservation, equip, unequip, consumable count, not-enough-stars, duplicate prevention, vehicle upgrade flow.
- Full verification passed on 2026-05-16:
  - `cd junior-game && npm run build`
  - `cd junior-game && npm run test -- --reporter=line`
  - Result: 172/172 Playwright tests passed.

## 스크린샷 경로

- `.logs/2026-05-14-junior-star-shop-ui/`
- `star-shop-main.png`
- `star-shop-cosmetics.png`
- `star-shop-consumables.png`
- `inventory-preview.png`
- `equipped-item.png`
- `not-enough-stars.png`

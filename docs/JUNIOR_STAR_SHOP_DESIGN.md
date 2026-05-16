# Junior Star Shop Design

## Purpose

Stars are praise points. Coins stay as the trading currency for goods, carts, boats, and the 300-coin ending. Stars give children a reason to enjoy correct answers, good trades, and kind events without breaking the trade economy.

## Save Fields

- `totalStarsEarned`: lifetime stars earned.
- `starBalance`: stars currently available to spend.
- `stars`: compatibility alias for `starBalance`.
- `ownedStarItemIds`: owned cosmetic star items.
- `equippedStarItems`: equipped cosmetic item by slot.
- `consumableItems`: owned consumable item counts.

Legacy migration:

- If an old save only has `stars`, set `totalStarsEarned = stars`.
- If an old save only has `stars`, set `starBalance = stars`.
- Spending stars reduces only `starBalance`.
- Badge milestones use `totalStarsEarned`.

## Item Rules

- Skin and decoration items are cosmetic only.
- Decorative weapons and armor do not add attack, defense, cargo, price, or route bonuses.
- Consumables are small convenience items only.
- Consumables have max-owned limits to prevent hoarding.

## Initial Items

| Item | Cost | Type | Slot | Effect |
| --- | ---: | --- | --- | --- |
| 청룡언월도 장식 | 8 | Skin | Weapon | Cosmetic |
| 충무공 검 장식 | 10 | Skin | Weapon | Cosmetic |
| 장터 호신봉 장식 | 4 | Skin | Weapon | Cosmetic |
| 장군 갑옷 | 10 | Skin | Armor | Cosmetic |
| 비단 도포 | 7 | Skin | Armor | Cosmetic |
| 상인 두루마기 | 5 | Skin | Armor | Cosmetic |
| 측우기 | 7 | Decoration | Tool | Cosmetic |
| 나침반 | 6 | Decoration | Tool | Cosmetic |
| 호패 | 5 | Decoration | Badge | Cosmetic |
| 금빛 장부 | 12 | Decoration | Tool | Cosmetic |
| 요정 리본 | 4 | Decoration | Fairy | Cosmetic |
| 요정 별지팡이 | 6 | Decoration | Fairy | Cosmetic |
| 신속 이동권 | 5 | Consumable | None | Fast travel convenience |
| 물건 1개 반값권 | 6 | Consumable | None | One discounted buy |
| 짐 보호 부적 | 5 | Consumable | None | Prevent one cargo loss |
| 퀴즈 다시풀기권 | 4 | Consumable | None | Retry one quiz |
| 장터 추천권 | 3 | Consumable | None | Highlight market hint |
| 소문 듣기권 | 3 | Consumable | None | Trigger one rumor |

## Current Implementation

- Data lives in `JUNIOR_STAR_ITEMS`.
- Item art lives in `junior-game/public/assets/star-items/`.
- Asset provenance and QA status live in `docs/JUNIOR_STAR_ITEM_ASSET_MANIFEST.md`.
- Purchase/equip state lives in `JuniorSave`.
- The top-bar `별 N` chip opens a separate reward menu.
- The reward menu has two simple modes: `별 상점` for getting new items and `보물함` for viewing, equipping, removing, and using owned items.
- The vehicle screen no longer contains star-shop cards, so cart/boat growth stays focused.
- Buying a cosmetic spends `starBalance` and adds the item to `ownedStarItemIds`.
- Equipping a cosmetic writes to `equippedStarItems`.
- Removing a cosmetic clears that one slot only.
- Buying a consumable spends `starBalance` and increments `consumableItems`.
- The inventory preview lists Jeongwoo's weapon/armor/tool and Barami's fairy/badge decoration as badge-style labels instead of complex character overlays.

## Consumable Effects

Consumables are now connected to the junior game loop. They remain convenience rewards, not core economy upgrades.

| Item | Where Used | Effect | Balance Guard |
| --- | --- | --- | --- |
| 신속 이동권 | Map / route card | Starts the selected trip with a short fast-travel message | One ticket per trip; route arrival and events still resolve normally |
| 물건 1개 반값권 | Market good card | Marks one chosen good and halves the next purchase price once | One good only; ticket is consumed only when the discounted purchase happens |
| 짐 보호 부적 | Event / quiz | Blocks one cargo-loss penalty | One event only; then the effect clears |
| 퀴즈 다시풀기권 | Quiz event | Lets the child retry once after a wrong answer | One quiz only; no reward is granted until the retry is answered |
| 장터 추천권 | Market | Highlights one useful good in the current city | City-scoped hint; does not change prices |
| 소문 듣기권 | City / market | Opens one local regional story or merchant rumor | Requires a local event; consumes one ticket on success |

Child-facing feedback is short and reassuring, such as "부적이 짐을 지켜줬어!" and "요정이 좋은 물건을 알려줬어." Spending a consumable decreases only that item's count and never changes `totalStarsEarned`.

## Art Direction

- Star-item icons use a bright 2D storybook style with transparent PNG output.
- Icons should stay readable at mobile card size and avoid realistic photo or copied game-icon aesthetics.
- Decorative weapons and armor must look collectible and ceremonial rather than threatening.
- If an icon ever falls below the approved junior asset quality bar, replace it with a new original raster asset and update the manifest.

## QA Release Check 2026-05-16

- Star-shop and treasure-box flows passed automated checks across 390x844, 412x915, 430x932, and 844x390 viewports.
- Cosmetic items are validated as non-stat items; they do not change money, cargo, route access, or event outcomes.
- Consumable items decrement on use and clear their active effect after one resolution.
- `totalStarsEarned` stays unchanged after purchases, so badge milestones remain based on lifetime praise.
- The current price bands remain within the target: small decorations 3-5 stars, regular skins 6-8, premium skins 10-12, consumables 3-6.

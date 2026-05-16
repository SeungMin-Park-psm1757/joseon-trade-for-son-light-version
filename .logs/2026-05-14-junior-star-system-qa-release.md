# Junior Star System QA Release

Date: 2026-05-16

## 1. Full Flow QA

- New-game and existing-save paths remain covered by the smoke suite.
- Stars are earned from good sales and quiz/event rewards.
- The top-bar star chip opens the separate reward menu.
- Cosmetic items can be bought with stars and equipped from the treasure box.
- Consumables can be bought and used from their relevant contexts:
  - Market: half-price ticket, market recommendation ticket.
  - Map/route card: fast travel ticket.
  - Event/quiz: cargo protect charm, quiz retry ticket.
  - City/market: rumor ticket.
- Star balance decreases after purchases and consumable use.
- Lifetime stars remain intact for badges.
- Save/continue keeps owned items, equipped items, consumable counts, and active effects.

## 2. Star Economy Balance

- Coins remain the main trade currency for goods, carts, boats, and the 300-coin ending.
- Stars act as praise/reward currency for cosmetics and small convenience items.
- Star rewards are intentionally small:
  - Good sale: usually +1.
  - Quiz/event success: usually +1.
  - Special story reward: +1 or +2.
- The economy still requires buying, traveling, and selling to progress.

## 3. Item Price Review

- Small decoration: 4-5 stars.
- Regular skins/tools: 6-8 stars.
- Premium skins/decorations: 10-12 stars.
- Consumables: 3-6 stars.
- Half-price ticket stays at 6 stars because it is the strongest convenience item.
- No price changes were required in this QA pass.

## 4. Save Migration QA

- Legacy `stars` saves migrate into `starBalance` and `totalStarsEarned`.
- Purchases reduce only `starBalance`.
- Badge checks use `totalStarsEarned`, so spending stars does not break 5/10-star badge progress.
- `activeEffects` receives safe defaults for older saves.

## 5. Mobile QA

- Automated Playwright viewports:
  - 390x844
  - 412x915
  - 430x932
  - 844x390
- Star shop, treasure box, item art, and consumable buttons remained readable in the tested mobile widths.
- Existing screenshot sets:
  - `.logs/2026-05-14-junior-star-shop-ui/`
  - `.logs/2026-05-14-junior-star-item-art/`
  - `.logs/2026-05-14-junior-star-consumables/`

## 6. Test Result

- `cd junior-game && npm run build`: pass
- `cd junior-game && npm run test -- --reporter=line`: pass, 212/212

## 7. GitHub Pages

- Commit: `26035c8` (`feat(junior): add star shop cosmetics and consumables`).
- Push: success to `origin/main`.
- Pages app verification: pass. The published app loaded, the star chip opened the star shop, star-item asset references were present in the deployed JavaScript, and console/page errors were 0 in the 390x844 browser check.

## 8. Remaining Limits

- The star shop is intentionally simple. If children ask for clearer item categories, add one-line category headers instead of more tabs.
- Half-price ticket may need a later cost increase if real playtests show early coin gain is too fast.
- Fast travel shortens the route presentation but does not skip route rules; this is deliberate for save stability.

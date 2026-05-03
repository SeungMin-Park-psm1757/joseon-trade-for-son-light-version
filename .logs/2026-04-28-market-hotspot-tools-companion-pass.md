# 2026-04-28 Market Hotspot Tools Companion Pass

## 1. Change Summary

- Reworked the market stall into an aligned shelf so buyable goods are easier to scan and touch.
- Added selling guidance that shows average purchase price, current sale price, and the best nearby sell destination.
- Repositioned regional port hotspots so market, tavern, office, shipyard, route board, and fishing spots sit in more plausible scene areas without overlap.
- Split personal equipment from ships/carts by adding trade tools, fishing gear, navigation gear, guard gear, and language prep.
- Added the first companion/fleet-name system with starter family helpers and recruitable companions.

## 2. Data Added

- `starter/public/data/tools.json`
- `starter/public/data/companions.json`
- `data/tools.json`
- `data/companions.json`

The new data is loaded through `DATA_FILES`, validated by `npm run validate:data`, and mirrored to the root `data/` folder.

## 3. Market UI

- Market goods now use a fixed shelf grid instead of loose scatter positions for the current buy screen.
- Recommended buy goods are sorted earlier.
- The trade popover now shows:
  - current price
  - owned quantity
  - average purchase price
  - expected profit/loss if sold here
  - best nearby sell destination when one is available
- Selling recommendations show `purchase -> sale` price flow so players can understand why a route is profitable.

## 4. Port Hotspots

Shared regional hotspot layouts were adjusted:

- Market: upper-left / lower town area.
- Tavern: near the market.
- Office: hill / pavilion side.
- Shipyard: lower waterfront side.
- Route board: upper-right / road or sea-facing side.
- Fishing: lower water side when available.

This keeps the same region-level mapping approach, but the coordinates are now closer to the scene art.

## 5. Pixel Map And Polygon Cleanup

- Replaced the route-map image with a generated pixel-art Korea-region map.
- Reduced SVG/polygon feel by using blocky pixel terrain colors, crisp image rendering, and less rounded map styling.
- Existing port nodes and route data remain data-driven.

## 6. NPC Cutouts

Generated alpha cutout copies of NPC portraits under:

- `starter/public/assets/npc/cutout/`

Facility and ship-caller scenes now use the cutout paths and CSS removes the old framed portrait background feel.

## 7. Tutorial And Quest UI

- The tutorial coach now presents itself as a time-travel fairy guiding Jeongwoo.
- Quest display is trimmed to roughly three cards: active incomplete quests first, then recent completed quests.

## 8. Equipment, Companions, And Fleet Name

- Vehicle growth remains for ships/carts.
- Personal equipment is separated into tools with stat bonuses.
- Companions have role, stats, language tags, recruitment cost, and short support lines.
- Family helpers are present from the start.
- Fleet name can be edited and is saved in localStorage.

## 9. Verification

Original workspace:

- `npm run validate:data` passed.
- `npm run audit:consistency` passed.

Temp copy verification path:

- `C:\Users\QuIC\AppData\Local\Temp\joseon-trade-ui-crew-pass`

Temp copy commands:

- `npm install` passed.
- `npm run validate:data` passed.
- `npm run audit:consistency` passed.
- `npm run build` passed.
- `npm run test:smoke` passed.
- `npm run test:visual` passed.

The temp copy was used because the Google Drive workspace can still produce Windows/npm binary path issues.

## 10. Browser Screenshots

Saved in:

- `.logs/mobile-landscape-ui-companion-pass/01-port-hotspots.png`
- `.logs/mobile-landscape-ui-companion-pass/02-market-buy-price-sell-place.png`
- `.logs/mobile-landscape-ui-companion-pass/03-pixel-map.png`
- `.logs/mobile-landscape-ui-companion-pass/04-three-quests.png`
- `.logs/mobile-landscape-ui-companion-pass/05-tools-companions-fleet.png`

## 11. Remaining Limits

- NPC cutout background removal is deterministic and lightweight; a future pass can generate cleaner transparent character art.
- Hotspots are still region-level shared layouts, not fully per-port authored coordinates.
- Companion effects are implemented as simple stat bonuses; event-specific companion dialog and deeper role checks are future work.
- Tools are separated from vehicles, but tool effects are intentionally modest in this pass.

## 12. Next Recommended Work

1. Add per-port hotspot overrides for Busanpo, Daegu, Jeonju, Mokpo, Jeju, and Tsushima.
2. Give companions route/event/facility reaction lines and show their portraits in a compact crew deck.
3. Add equipment effects to event-choice outcomes while keeping combat simple.

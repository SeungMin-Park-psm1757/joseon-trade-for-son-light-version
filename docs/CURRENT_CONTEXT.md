# Current Context Compact

Last updated: 2026-04-28

## Project

`팔도상단: 조선의 바람` is a Vite + React + TypeScript mobile landscape web game. It is a pixel-art Joseon trade RPG with localStorage saves and JSON data under `starter/public/data/`.

## Current Direction

The game is no longer a vertical text app. The target UX is a landscape mobile web game at:

- 844×390
- 932×430

Portrait may show a rotate notice.

The core loop is:

port scene → facility/NPC → market item click → buy/sell → map route → travel animation/event → sell/deliver → earn money → equipment/growth goal.

## Implemented Systems

- Structured trading, travel, fishing, quest progress, and ledger state.
- Objective resolver for buy/sell/visit/deliver/equipment/event/fishing/permit goals.
- Tutorial and early quest completion through real gameplay actions.
- Landscape port hub with hotspots.
- Region backgrounds and generated pixel assets.
- Goods icons for all goods plus fallback.
- Market stall UI with item click popover and repeated one-item buy/sell.
- Route recommendation and selected route preview.
- Korean map-style node/route travel screen with ship/cart movement.
- Ship berth rule via `shipPortId`: land travel does not damage or move the ship.
- Ship call service through port worker/NPC.
- Web Audio API BGM/SFX with saved settings.
- Result scene cards and result chip icons.
- 18-port `port_flavors.json` for port-specific NPC lines, goods, market slots, and stall coordinates.
- Long growth map through handcart, fishing, fishing boat, South Sea, Jeju, permit, and Tsushima.
- Equipment purchase and ship-call notice modals.
- Three local save slots. Slot 1 keeps the original save key.
- Cargo/ledger collection summary for visited ports, traded goods, and seen NPC categories.
- Seasonal monthly news art.
- Visual smoke script and GitHub Actions-style CI workflow.

## Source Of Truth

- Runtime data: `starter/public/data/*.json`
- Mirror data: `data/*.json`
- App source: `starter/src/`
- Tests: `starter/tests/`
- Logs/screenshots: `.logs/`

When data changes, sync `starter/public/data/*.json` to `data/*.json` unless intentionally changing the source-of-truth rule.

## Known Environment Issue

The Google Drive path can break `node_modules/.bin` execution for `tsc` on Windows. If `npm run build` fails in the original folder with a malformed `node_modules/.bin` path, verify in a temp copy:

1. Copy repository excluding `node_modules`, `dist`, `.git`.
2. Run `npm install`.
3. Run the verification commands there.

## Current Verification Commands

From `starter/`:

```bash
npm run validate:data
npm run audit:consistency
npm run build
npm run test:smoke
npm run test:visual
```

`test:visual` creates screenshots and fails on horizontal scroll in key landscape screens.

## Latest Screenshots

`.logs/mobile-landscape-full-polish-pass/`

- `port.png`
- `market.png`
- `map.png`
- `quests.png`
- `vehicles.png`
- `cargo.png`
- `market-932.png`

## Important Constraints

- Do not add China/Japan mainland expansion yet.
- Do not add server login or server saves.
- Do not switch to Phaser/Pixi yet.
- Keep localStorage save compatibility.
- Keep market economy monthly and data-driven.
- Favor small game-feel improvements over broad rewrites.

## 2026-04-28 Market, Hotspot, Tool, Companion Pass

- Market goods are now aligned on a shelf grid for easier touch selection.
- Trade popovers show average purchase price, current sell result, and best nearby sell destination.
- Regional hotspot layouts were corrected so market/tavern/office/shipyard/route/fishing spots sit in more plausible scene positions.
- Quest view is trimmed to roughly three visible quests.
- The tutorial coach is a time-travel fairy guiding Jeongwoo.
- Ships and carts stay in vehicle growth; personal equipment now uses separate tool data.
- New tools data covers sword/guard, fishing, navigation, trade, and language-prep equipment.
- New companions data covers Naraon, Jo Yeonseo, Lee Sihyung, Kim Sora, Lee Doyun, Park Siwoo, Park Seyeon, Dad, and Mom.
- Game state now stores `tools`, `companions`, and `fleetName` with localStorage migration defaults.
- The route map image was replaced with a generated pixel-art Korea-region map.
## 2026-04-29 Current Milestone Context

Milestone 8 added a Daikoukai-inspired but Joseon-specific progression layer:

- 3 fame axes: merchant credit, exploration fame, guard fame
- first-visit discovery cards for all 18 ports/cities
- per-port trust raised through visits, sales, discoveries, and quests
- monthly trend goods, official demand goods, and risk tags in news/market/recommendations
- equipment screen route unlock hints
- regional long-term `팔도상단 장부 조각`
- asset manifest plus discovery/seal placeholder icons

The core loop remains unchanged: port scene -> market/facility -> buy -> map travel -> event/result -> sell/delivery -> ledger/quest/equipment growth. Keep the existing localStorage key and data IDs stable.

## 2026-04-29 Scene-First UI Pass 1

The latest UI pass only targeted port main, map/travel, and market.

- Port main has stronger scene-first composition with hero CTAs and hotspot facilities.
- Map/travel uses an inline Korea overview SVG layer with Jeju/Tsushima/sea labels and keeps node/route/travel animation logic intact.
- Market uses a port-scene stall shelf and large trade overlay instead of a table/card-list first read.
- Quest, equipment, and ledger screens were intentionally left for the next UI pass except for shared style side effects.

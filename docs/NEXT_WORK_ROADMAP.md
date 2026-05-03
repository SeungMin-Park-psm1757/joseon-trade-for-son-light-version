# Next Work Roadmap

Last updated: 2026-04-28

This roadmap is the working queue after the current landscape, pixel-art, trade-loop MVP passes. It keeps the project moving toward a picture-first mobile game without reopening large systems too early.

## After 2026-04-28 Market/Hotspot/Tool/Companion Pass

The current pass added aligned market shelves, purchase-price sell guidance, a pixel route map, personal tools, companions, family helpers, and fleet naming. The next useful work should now focus on depth and polish rather than new large systems.

1. Per-port hotspot overrides for the main anchor ports: Busanpo, Daegu, Jeonju, Mokpo, Jeju, and Tsushima.
2. Companion reactions in facilities, events, and route prep, using the existing companion stats and language tags.
3. Tool effects in event choices, such as guard gear helping danger outcomes and survey tools helping route risk previews.
4. Cleaner transparent NPC/family/companion art, replacing the current lightweight cutout derivatives.
5. Visual regression baselines once the port/market layouts settle.

## Priority 1: Port Personality Completion

- Give every port stronger local identity through `port_flavors.json`.
- Add port-specific hotspot coordinates when a shared region layout feels wrong.
- Differentiate market stall arrangement, NPC lines, local rumors, and recommended goods by port.
- Start with Busanpo, Daegu, Jeonju, Mokpo, Jeju, and Tsushima as quality anchors.

## Priority 2: Market UI Simplification

- Make the stall feel like touching goods, not reading a list.
- Keep item click -> popover -> repeated buy/sell clicks as the main flow.
- Strengthen floating feedback such as `+면포`, `-25냥`, `+31냥`.
- Rebalance item icon size, hit targets, and badge placement for 844x390.

## Priority 3: Long Growth Journey

- Extend the first-30-minute path into a visible long journey:
  handcart -> fishing -> fishing boat -> Mokpo/Yeosu -> Jeju preparation -> Jeju arrival.
- Add the Tsushima branch:
  waegwan permit -> foreign trade preparation -> first Tsushima trade.
- When equipment is purchased, highlight newly practical routes.

## Priority 4: Event Presentation

- Replace remaining text-heavy event chips with pixel-icon result chips.
- Give major event types a distinct scene image or compact illustrated panel:
  bandits, pirates, storm, mudflat, inspection, fair wind, emergency repair.
- Add 2-3 picture-first event choices later, without introducing a complex combat system.
- Keep land events tied to carts and sea events tied to ships.

## Priority 5: Vehicle Growth Moments

- Add short celebration scenes for handcart, fishing boat, and coastal trader purchases.
- Show before/after capacity, speed, durability, and newly recommended routes.
- Keep purchase logic simple; make the reward moment clearer.

## Priority 6: Ship Call Service Polish

- Strengthen the boatman/NPC scene.
- Show the story clearly: ship is berthed at another port -> pay boatman -> days pass -> ship arrives.
- On inland routes, point the player to the nearest useful port instead of implying ships can be carried.
- Make the ship berth marker more visible on the map.

## Priority 7: Audio Pass 2

- Separate port, market, map, and event moods more clearly.
- Improve buy, sell, depart, arrive, quest-complete, repair, and danger SFX.
- Move sound settings into a tiny icon-first settings popover.
- Keep Web Audio procedural generation unless licensed assets are deliberately added.

## Priority 8: Collection And Discovery

- Add picture-first collections:
  visited ports, traded goods, met NPC categories, event types survived.
- Reward discovery with small icons, stamps, or framed entries.
- Avoid turning this into a heavy achievement system yet.

## Priority 9: Monthly Season Feel

- Add small seasonal art to monthly news.
- Reflect spring markets, summer storms, autumn harvest, and winter freezing in rumors and market emphasis.
- Make price changes visible through small visual cues, not long explanations.

## Priority 10: Family Save Safety

- Improve save slot metadata: current port, money, month, last played time.
- Keep the new-game confirmation modal.
- Add a clearer continue screen so a child does not accidentally overwrite progress.

## Priority 11: Visual Regression Tests

- Keep the current screenshot smoke path.
- Add baseline comparison when the UI stabilizes enough to avoid noisy diffs.
- Cover port, market, map, quests, cargo, equipment, event modal, and portrait rotate notice.

## Priority 12: Balance Pass

- Recheck the first 10-30 minute profit curve.
- Review good price, weight, demand, and route risk values.
- Tune equipment prices so the next goal feels reachable but not instant.
- Keep recommendations from collapsing into a single best route.

## Current Engineering Follow-Up

- Keep `starter/public/data/*.json` and root `data/*.json` synchronized.
- Run `npm run validate:data`, `npm run audit:consistency`, `npm run build`, `npm run test:smoke`, and `npm run test:visual` before reporting completion.
- If the Google Drive path breaks npm binaries, verify in a temp copy and record the path in the work log.

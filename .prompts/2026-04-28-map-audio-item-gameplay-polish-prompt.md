# Map, Audio, Item, Gameplay Polish Prompt

You are the principal engineer + pixel art game UX designer + browser game playtester + lightweight audio integrator for the mobile landscape web game `팔도상단: 조선의 바람`.

The user wants a longer, careful polish pass after the MP3 audio integration.

## Goals

1. Audio asset cleanup
   - Rename the generated MP3 runtime files to clear, reviewable names.
   - Keep names stable and web-safe.
   - Reduce file sizes enough for web loading without obvious quality loss.
   - Prefer bitrate/sample-rate decisions based on BGM/SFX use.
   - Update all audio mappings.
   - Record mapping and compression results.

2. Pixel-art Korea map replacement
   - Replace the current abstract/polygon-feeling map with a clearer pixel-art full Korea map.
   - Show major cities in modern Korean names such as 서울, 인천, 강릉, 대구, 부산, 전주, 목포, 여수, 제주.
   - Keep game data IDs and Joseon names intact; map display labels can be modern.
   - Position nodes close to real relative locations.
   - Keep route logic unchanged unless a tiny display helper is needed.

3. Ship/cart/item image fitting
   - Prevent ship/cart/item art from being cropped in cards, modals, market, equipment, map, and route preview.
   - Use `object-fit: contain`, stable aspect ratios, and max dimensions.
   - Avoid layout shift and horizontal overflow at 844x390 and 932x430.

4. Item and character stats
   - Confirm personal tools are actually implemented and affect play.
   - If effects are too shallow, wire them into existing systems conservatively:
     - navigation affects effective route days or route risk preview
     - trade affects market profit/sell hint or buy/sell feedback
     - fishing affects fishing yield
     - guard affects dangerous event handling or displayed safety
     - language affects future foreign trade readiness display
   - Confirm companions/family helpers have stats and apply to fleet.
   - Do not add server save or large combat systems.

5. Uncharted Waters gap review
   - Compare the current loop with classic trade-RPG expectations:
     - route discovery
     - ship/cart growth
     - personal gear
     - crew/companions
     - rumors/information
     - port identity
     - risk/event choices
     - map readability
   - Add small, scoped improvements only if they fit current architecture.
   - Write a concise follow-up roadmap for bigger features.

## Constraints

- Keep localStorage save compatibility.
- Keep JSON IDs stable.
- Do not add China/Japan mainland.
- Do not add server login/save.
- Do not switch to Phaser/Pixi.
- Do not introduce large copyrighted or unclear external assets.
- If using user-provided generated audio, record it as user-provided generated asset.

## Verification

Run:

- `npm run validate:data`
- `npm run audit:consistency`
- `npm run build`
- `npm run test:smoke`
- `npm run test:visual`

If the Google Drive path breaks npm binaries, verify in a temp copy and record it.

Browser/visual checks:

- 844x390 port, market, map, vehicles.
- 932x430 map and audio controls.
- audio debug confirms file-backed BGM/SFX.
- no horizontal scroll.
- ships/carts/items are not cropped.

## Deliverables

- Updated source and assets.
- Updated docs/checklists/logs.
- A work log under `.logs/`.
- Final report with tests, asset mapping, remaining limits, and next work.

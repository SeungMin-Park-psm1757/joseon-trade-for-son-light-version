# Pixel Asset Plan

## External Free Asset Sources Checked

- Kenney assets: official packs commonly provide CC0 licensing. Good candidate for generic UI frames and icons, but not imported yet because the current Joseon-specific look needs tighter art direction.
- OpenGameArt: useful for CC0/CC-BY pixel packs, but each pack requires individual license verification before inclusion.
- itch.io free assets: useful discovery source, but license terms vary per creator and must be checked pack-by-pack.

## Assets Created This Pass

Built-in image generation was used to create a project-bound pixel art direction sheet:

- `starter/public/assets/generated/pixel-art-direction-sheet.png`

Derived workspace crops:

- `starter/public/assets/generated/protagonist-face.png`
- `starter/public/assets/generated/pixel-harbor-bg.png`
- `starter/public/assets/generated/ship-tier-1.png`
- `starter/public/assets/generated/ship-tier-2.png`
- `starter/public/assets/generated/ship-tier-3.png`
- `starter/public/assets/generated/ship-tier-4.png`
- `starter/public/assets/generated/cart-tier-1.png`
- `starter/public/assets/generated/cart-tier-2.png`
- `starter/public/assets/generated/cart-tier-3.png`
- `starter/public/assets/generated/cart-tier-4.png`

## Prompt Used

Use case: stylized-concept
Asset type: pixel art game asset direction sheet for a mobile Joseon trade RPG
Primary request: create a compact pixel-art style reference sheet for the game "Paldo Merchant: Wind of Joseon" showing one young merchant protagonist face portrait, one small sailboat silhouette progression, one handcart progression, and a Joseon harbor background tile. No text, no logos, no watermark.
Style/medium: crisp 16-bit pixel art, Korean Joseon period inspiration, charming for a child, warm but adventurous.
Composition/framing: asset sheet layout on a simple neutral background, separated tiles with generous padding.
Color palette: warm parchment, teal sea, pine green hills, muted red roofs, golden highlights.
Constraints: no readable text, no modern objects, no copyrighted game references, no 3D render, no photorealism, no watermark.

## Next Asset Targets

- Optional mountain-pass event background.
- Higher-detail second pass for goods icons that are currently deterministic pixel placeholders.
- Additional emotional variants for NPC portraits.

## 2026-04-27 Landscape Visual Pass Assets

Built-in image generation was used for two project-bound source sheets:

- `starter/public/assets/generated/region-scene-sheet.png`
- `starter/public/assets/generated/npc-portrait-sheet.png`

Derived regional scene crops:

- `starter/public/assets/scenes/south-port.png`
- `starter/public/assets/scenes/west-mudflat.png`
- `starter/public/assets/scenes/inland-city.png`
- `starter/public/assets/scenes/east-port.png`
- `starter/public/assets/scenes/jeju.png`
- `starter/public/assets/scenes/tsushima.png`

Derived NPC portrait crops:

- `starter/public/assets/npc/market-merchant.png`
- `starter/public/assets/npc/office-clerk.png`
- `starter/public/assets/npc/tavern-keeper.png`
- `starter/public/assets/npc/shipwright.png`
- `starter/public/assets/npc/rival-merchant.png`
- `starter/public/assets/npc/fallback-npc.png`

Deterministic transparent pixel icons were generated for all 28 goods plus `fallback-good.png` in `starter/public/assets/goods/`. The mapping is stored with each good as `iconAsset`.

### 2026-04-28 Core Good Icon Pass

The early-game goods below were redrawn in-place as 64×64 transparent PNGs with stronger silhouettes and contrast. No external assets were imported.

- `cotton_cloth.png`
- `salt.png`
- `dried_fish.png`
- `rice.png`
- `barley.png`
- `beans.png`
- `fresh_fish.png`
- `seaweed.png`
- `lumber.png`
- `paper.png`
- `ginseng.png`
- `horse.png`

### 2026-04-28 Map and Hub Pixel Cleanup

Deterministic pixel-style PNG assets were added to replace polygon/vector-looking placeholders in key play surfaces. No external assets were imported.

- `starter/public/assets/maps/korea-route-map.png`
- `starter/public/assets/hub-market.png`
- `starter/public/assets/hub-office.png`
- `starter/public/assets/hub-tavern.png`
- `starter/public/assets/hub-shipyard.png`
- `starter/public/assets/hub-map.png`

The map background is a stylized Korea-region game map rather than GIS-accurate cartography. Port nodes still use data-driven coordinates from `ports.json`.

### 2026-04-28 Diegetic UI Audio Pass

No external audio assets were imported. BGM and SFX are generated procedurally with the Web Audio API in `starter/src/audio.ts`.

- Harbor/market BGM: short low-volume melodic loop.
- Map/travel BGM: slightly faster loop.
- SFX: click, buy, sell, reward, depart, arrive, danger, quest complete, ship call, repair.

Because no third-party audio files are bundled, there is no additional asset license to record for this pass.

### Prompts Used

Regional scene sheet:

```text
Use case: stylized-concept
Asset type: pixel art game asset sheet for a landscape mobile Joseon trade RPG
Primary request: Create a clean 3 by 2 tile sheet of six wide pixel-art regional scene backgrounds: south sea Joseon harbor, west coast mudflat harbor, inland Joseon city market road, east sea rocky harbor, Jeju island harbor with volcanic stone walls, and Tsushima island foreign trading dock. No text, no logos, no watermark.
Style/medium: crisp 16-bit pixel art, original art, warm adventurous Korean Joseon period atmosphere, child-friendly but game-ready.
Composition/framing: six equal landscape rectangles with clear thin neutral gutters, each tile is a wide hero background suitable for 16:9 or 2:1 UI cropping. Keep horizon readable, no characters in foreground blocking UI.
Color palette: varied but cohesive; teal seas, warm earth roads, green hills, soft sky, muted red roofs, volcanic dark stone only for Jeju.
Constraints: no readable text, no modern objects, no copyrighted game references, no 3D render, no photorealism, no watermark.
```

NPC portrait sheet:

```text
Use case: stylized-concept
Asset type: pixel art NPC portrait sheet for a landscape mobile Joseon trade RPG
Primary request: Create a clean 3 by 2 tile sheet of six half-body NPC portraits: market merchant, office clerk, tavern keeper, shipwright, rival merchant, and generic fallback townsfolk. No text, no logos, no watermark.
Style/medium: crisp 16-bit pixel art, original Joseon-period inspired clothing, friendly child-readable silhouettes, game UI portrait quality.
Composition/framing: six equal square-ish portrait tiles with clear thin neutral gutters, each character centered, waist-up, transparent-looking plain warm parchment backdrop inside each tile, generous padding.
Color palette: varied clothing colors, warm earth tones, teal/green accent, readable face expressions.
Constraints: no readable text, no modern objects, no copyrighted game references, no 3D render, no photorealism, no watermark.
```

## 2026-04-28 Result Icon PNGs

이번 패스에서 외부 에셋 없이 PowerShell/System.Drawing으로 작은 픽셀풍 PNG를 생성했다.

위치: `starter/public/assets/result-icons/`

- `money.png`
- `ship.png`
- `cart.png`
- `cargo.png`
- `crew.png`
- `repair.png`
- `time.png`
- `safe.png`
- `plain.png`

라이선스: 프로젝트 내부 절차 생성물. 외부 출처 없음.

## 2026-04-28 Map And NPC Cutout Cleanup

No external assets were imported in this pass.

Generated/updated assets:

- `starter/public/assets/maps/korea-route-map.png`
- `starter/public/assets/npc/cutout/market-merchant.png`
- `starter/public/assets/npc/cutout/office-clerk.png`
- `starter/public/assets/npc/cutout/tavern-keeper.png`
- `starter/public/assets/npc/cutout/shipwright.png`
- `starter/public/assets/npc/cutout/rival-merchant.png`
- `starter/public/assets/npc/cutout/fallback-npc.png`

The map is a deterministic pixel-art style replacement for the earlier polygon-feeling foreground. NPC cutouts are lightweight alpha-masked derivatives of already bundled project portraits; a later art pass can replace them with cleaner hand-authored transparent sprites.

## 2026-04-28 Audio Recheck

No external music or SFX assets were imported.

The current BGM and SFX are generated procedurally in `starter/src/audio.ts` through the Web Audio API. This avoids license uncertainty while still adding:

- calm port loop
- brighter market loop
- travel/map loop
- door/bell cue for market entry
- page cue for ledger/map style views
- buy/sell/reward/travel/danger/repair/fishing/ship-call cues

If recorded music is added later, only use public-domain or clearly licensed files and record source, license, author, and URL in `asset_plan/LICENSE_CHECKLIST.md`.

## 2026-04-28 User Generated MP3 Audio

The user generated 21 MP3 files from the project-specific prompts and placed them in `bgm/`. They were copied into `starter/public/assets/audio/` with stable file names.

Stable files:

- `01_common_joseon_loop.mp3`
- `02_harbor_bgm.mp3`
- `03_market_bgm.mp3`
- `04_map_travel_bgm.mp3`
- `05_sea_departure_bgm.mp3`
- `06_danger_event_bgm.mp3`
- `07_quest_complete_jingle.mp3`
- `08_shop_door_bell.mp3`
- `09_buy_item.mp3`
- `10_sell_item.mp3`
- `11_money_reward.mp3`
- `12_page_turn.mp3`
- `13_ship_departure.mp3`
- `14_arrival.mp3`
- `15_cart_departure.mp3`
- `16_danger_alert.mp3`
- `17_bandit_event.mp3`
- `18_pirate_event.mp3`
- `19_repair.mp3`
- `20_fishing.mp3`
- `21_companion_join.mp3`

License/source note: user-provided generated assets for this project. No third-party download URL was used by Codex in this pass.

## 2026-04-28 MP3 Rename And Compression Pass

No external music or SFX assets were imported. The user-generated MP3 files were renamed for review and recompressed for web runtime use.

Runtime folder: `starter/public/assets/audio/`

Manifest: `asset_plan/AUDIO_ASSET_MANIFEST.md`

Important changes:

- BGM filenames now describe their scene and mood, such as `bgm-port-jade-harbor.mp3`, `bgm-market-valley-day.mp3`, and `bgm-map-road-to-sea.mp3`.
- SFX filenames now describe their trigger, such as `sfx-shop-door-bell.mp3`, `sfx-buy-market-crossing.mp3`, and `sfx-ship-departure.mp3`.
- BGM files were recompressed to about 460-500 KB each.
- SFX files were trimmed to short cues and are about 9-29 KB each.
- The original user-generated files in `bgm/` were not modified.

## 2026-04-28 Korea Pixel Map And Ability Pass

Generated/updated assets:

- `starter/public/assets/maps/korea-route-map.png`

The route map background was replaced with a raster pixel-art Korea overview. Map labels now use modern Korean city names on the map layer, for example `서울`, `부산`, `대구`, `제주`, while port data IDs and historical port names remain unchanged for the game data.

Gameplay-facing stat effects were tightened:

- `navigation` reduces route days.
- `trade` gives a small buy discount and sell bonus.
- `fishing` improves fishing results.
- `guard` lowers displayed route risk and event chance.
- `japanese` and `chinese` remain visible preparation stats for later foreign trade routes.
## 2026-04-29 Milestone 8 Asset Manifest

`starter/public/data/asset_manifest.json` now tracks project asset usage across goods, scenes, NPCs, companions, vehicles, event/result icons, discovery cards, ledger seals, and maps.

New lightweight placeholder SVG sets:

- `starter/public/assets/discoveries/`: first-visit discovery card icons
- `starter/public/assets/seals/`: regional ledger seal icons

These are internal placeholder assets with `source: placeholder` in the manifest. They are intentionally small and project-bound. Later art passes should replace the discovery and seal placeholders with stronger hand-authored pixel art while preserving the file paths or updating the manifest and data references together.

Rendering rule remains: pixel art should use `image-rendering: pixelated`, stable dimensions, and fallback images where possible. No unverified third-party asset was added in this milestone.

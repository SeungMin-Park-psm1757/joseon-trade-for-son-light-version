# 2026-04-28 Audio, Map, Item Polish Pass

## 1. 변경 요약

- User-generated MP3 files were renamed to descriptive runtime names and recompressed for web delivery.
- The route map background was replaced with a raster pixel-art Korea overview.
- Map node labels now use modern Korean city names while preserving existing port IDs and game data names.
- Market trade popover now shows buy price, sell price, average purchase price, and sale destination guidance.
- Personal equipment and companion stats now affect navigation, trade, fishing, and route risk.

## 2. Audio Rename And Compression

Runtime audio path: `starter/public/assets/audio/`

- BGM files were recompressed to 64 kbps mono at 32 kHz.
- SFX files were trimmed to short cues and recompressed to 80 kbps mono at 32 kHz.
- Runtime folder total is about 3.0 MB.
- Most BGM files are about 460-500 KB.
- SFX files are about 9-29 KB.

Manifest: `asset_plan/AUDIO_ASSET_MANIFEST.md`

The original files in `bgm/` were not modified.

## 3. Korea Pixel Map

Updated asset:

- `starter/public/assets/maps/korea-route-map.png`

The map is generated as a small raster pixel-art style overview of Korea with Jeju and Tsushima. Port coordinates were adjusted in:

- `starter/public/data/ports.json`
- `data/ports.json`

Map labels shown in the map UI:

- 서울, 강화, 충주, 전주, 군산, 목포, 흑산도, 여수, 통영, 진해, 부산, 대마도, 울산, 포항, 강릉, 대구, 안동, 제주

## 4. Market And Sales Guidance

- Market goods remain sorted by recommendation, local specialty, price status, and sale opportunity.
- The trade popover now shows:
  - buy price
  - sell price
  - owned count
  - average purchase price when owned
  - current sell profit
  - nearest recommended sale destination
- Repeated buy/sell click flow was preserved.

## 5. Item And Companion Effects

Existing tools and companions are now more mechanically connected:

- `navigation`: lowers effective route days.
- `trade`: small buy discount and sell bonus.
- `fishing`: already contributes to fishing yield.
- `guard`: lowers displayed route risk and slightly lowers event chance.
- `japanese` and `chinese`: kept as visible future trade preparation stats.

## 6. Image Fit

- Ship/cart/equipment thumbnails now use `object-fit: contain`.
- Visual audit confirmed `img.pixel-vehicle` elements render with `object-fit: contain`.

## 7. Tests

Original Google Drive path:

- `npm run validate:data`: success
- `npm run audit:consistency`: success
- `npm run build`: failed because `node_modules/.bin` resolves through a Google Drive path with spaces/Korean characters.

Temp copy path:

- `npm run validate:data`: success
- `npm run audit:consistency`: success
- `npm run build`: success
- `npm run test:smoke`: success, 4 passed
- `npm run test:visual`: success

## 8. Browser Verification

Viewport:

- 844x390

Screenshots:

- `.logs/audio-map-item-pass/01-port.png`
- `.logs/audio-map-item-pass/02-korea-map.png`
- `.logs/audio-map-item-pass/03-market-sorted-popover.png`
- `.logs/audio-map-item-pass/04-equipment-fit-items-companions.png`

Audit results:

- Horizontal scroll: 0
- Map labels use modern Korean city names.
- Market order starts with recommended/local goods: 건어물, 면포, 쌀, 한지...
- Trade popover stayed inside viewport after compacting.
- Vehicle images use contain-fit.

## 9. 남은 한계

- The Korea map is a generated raster placeholder, not a hand-painted final illustration.
- Map labels are modern names only on the visual map layer; deeper game copy still uses historical port names.
- Trade and guard stat effects are intentionally small for balance.
- Japanese/Chinese language stats are visible but not yet tied to foreign-trade objective gates.

## 10. 다음 추천 작업

1. Hand-paint or image-generate a higher-quality pixel-art Korea map using the current coordinates as a layout guide.
2. Add a “sale guide” overlay that highlights best destination directly on the map when an owned good is selected.
3. Add personal equipment upgrade tiers and companion-specific event choices without introducing complex combat.

# 16-bit 4096-color 2D Rebuild

Date: 2026-04-30

## Goal

Rebuild all active pictures and icons around a single 16-bit Joseon fantasy 2D direction.

## Program Structure

- Added `starter/src/artDirection.ts` as the central art asset resolver.
- Added `starter/src/bit16-art.css` as the final loaded 16-bit rendering layer.
- Repointed runtime data and root data mirrors to `/assets/16bit/...`.
- Reworked `GoodIcon` to render actual 16-bit SVG icon assets instead of mixed inline placeholder shapes.

## Assets

- Added 103 SVG assets under `starter/public/assets/16bit/`.
- Covered scenes, title art, protagonist, NPCs, ships, carts, hub buttons, result icons, goods, companions, discoveries, and seals.
- Moved the guide spirit from inline SVG into 3 mood assets: default, happy, warning.
- SVGs use crisp rendering and 12-bit friendly `#RGB` palette values to fit the 4096-color target.

## Verification

- `npm run validate:data`: pass
- `npm run audit:consistency`: pass with existing non-git warning
- `npm run build`: pass
- `npm run test:smoke`: pass, 6/6
- `npm run test:visual`: pass
- Final browser screenshot checks at 844x390, 1365x768, 1920x1080: no broken images, no horizontal page overflow.

## Screenshots

- `.logs/bit16-4096-final/844x390-port.png`
- `.logs/bit16-4096-final/844x390-market.png`
- `.logs/bit16-4096-final/844x390-map.png`
- `.logs/bit16-4096-final/1365x768-port.png`
- `.logs/bit16-4096-final/1365x768-market.png`
- `.logs/bit16-4096-final/1365x768-map.png`
- `.logs/bit16-4096-final/1920x1080-port.png`
- `.logs/bit16-4096-final/1920x1080-market.png`
- `.logs/bit16-4096-final/1920x1080-map.png`

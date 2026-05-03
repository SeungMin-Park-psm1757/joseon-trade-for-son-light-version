# Painted 2D RPG Art Rebuild

Date: 2026-04-30

## Goal

Replace the unsatisfactory code-SVG/pixel-block look with a commercial casual 2D Joseon fantasy RPG art direction using generated raster assets.

## Asset Pipeline

- Used the built-in image generation tool.
- Preserved source generations under `starter/public/assets/painted2d/source/`.
- Cropped and cleaned atlas outputs into transparent PNG sprites/icons.
- Exported scene backgrounds as 1920x1080 WebP files.
- Repointed runtime data and art resolvers to `/assets/painted2d/...`.

## Rebuilt Asset Groups

- Scene backgrounds: south port, market street, inland city, east port, west mudflat, Jeju, Tsushima.
- World map background: full Korean peninsula painted map.
- Trade goods: 28 goods plus fallback icon.
- Characters/NPCs: merchant, guide spirit, office clerk, tavern keeper, shipwright, protagonist, fallback.
- UI icons: hub buttons, result icons, vehicles, discovery icons, ledger seals.

## Layout Fixes

- Replaced the previous hard 16-bit CSS layer with `painted2d-art.css`.
- Removed the old `/assets/16bit` folder from active assets.
- Reserved vertical room for the fixed top tabs so they no longer cover content.
- Reduced and repositioned tutorial coach so it does not cover market action buttons.
- Repositioned port hub hotspots so they are not hidden behind the scene description panel.
- Adjusted small landscape market popover so buy/sell buttons remain visible.

## Verification

- `npm run validate:data`: pass
- `npm run audit:consistency`: pass with existing non-git warning
- `npm run build`: pass
- `npm run test:smoke`: pass, 6/6
- `npm run test:visual`: pass
- Screenshot audit at 844x390, 1365x768, 1920x1080 across port, market, map, vehicles: no broken images, no horizontal scroll.

## Screenshots

- `.logs/painted2d-rpg-final4/844x390-port.png`
- `.logs/painted2d-rpg-final4/844x390-market.png`
- `.logs/painted2d-rpg-final4/844x390-map.png`
- `.logs/painted2d-rpg-final4/1365x768-port.png`
- `.logs/painted2d-rpg-final4/1365x768-market.png`
- `.logs/painted2d-rpg-final4/1365x768-map.png`
- `.logs/painted2d-rpg-final4/1920x1080-port.png`
- `.logs/painted2d-rpg-final4/1920x1080-market.png`
- `.logs/painted2d-rpg-final4/1920x1080-map.png`

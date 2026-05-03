# Casual 2D Joseon Fantasy RPG Art Rework

Date: 2026-04-30

## Goal

Move remaining photos, generated-looking pictures, and crude pixel placeholders toward a unified casual 2D Joseon fantasy RPG style.

## Changes

- Replaced start screen generated PNG references with SVG RPG harbor and protagonist art.
- Rebuilt active region scene SVGs for saturated 2D RPG backgrounds.
- Rebuilt active NPC cutouts as SD-like 2D Joseon characters.
- Rebuilt hub icons and result icons as rounded, outlined RPG UI assets.
- Rebuilt discovery, seal, and companion SVGs that still had crisp placeholder art or `??` text.
- Removed legacy PNG references from `ports.json`, `asset_manifest.json`, and remaining CSS URL references.
- Synced root data mirrors for `ports.json` and `asset_manifest.json`.
- Changed SVG rendering away from forced pixel/crisp rendering to geometric precision.
- Added a final CSS art-direction layer for brighter colors, gold/blue RPG framing, rounded icon cards, and compact guide speech bubble placement.
- Reduced the guide/tutorial panel footprint so it no longer covers the primary port CTAs.
- Kept the tutorial path visible as a compact icon strip after smoke tests caught that hiding it broke the guided route flow.

## Verification

- `npm run validate:data`: pass
- `npm run audit:consistency`: pass with existing non-git warning
- `npm run build`: pass
- `npm run test:smoke`: pass
- `npm run test:visual`: pass
- Playwright screenshot check at 844x390, 1365x768, 1920x1080: no broken images, no page overflow.

## Screenshots

- `.logs/casual-2d-rpg-rework/844x390-port-final.png`
- `.logs/casual-2d-rpg-rework/844x390-market-final.png`
- `.logs/casual-2d-rpg-rework/844x390-port-final2.png`
- `.logs/casual-2d-rpg-rework/844x390-market-final2.png`
- `.logs/casual-2d-rpg-rework/1365x768-map-final.png`
- `.logs/casual-2d-rpg-rework/1365x768-vehicles-final.png`
- `.logs/casual-2d-rpg-rework/1920x1080-market-final.png`

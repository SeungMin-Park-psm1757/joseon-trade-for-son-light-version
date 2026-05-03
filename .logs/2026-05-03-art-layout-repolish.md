# 2026-05-03 Art Layout Repolish

## Findings

- Tutorial story modal was still using the low-detail guide spirit SVG, which made the fairy look like a simple polygon face in small captures.
- Cargo slot headers used an inline SVG vehicle token, so the ship looked like a compressed drawing instead of matching the painted 2D asset set.
- Month news used CSS-only blocks for season art, leaving the panel feeling like placeholder UI.

## Changes

- Switched guide spirit rendering to the existing painted PNG assets.
- Replaced route/cargo tokens with the current ship/cart painted assets.
- Added four small season SVG scene assets for market news cards.
- Adjusted tutorial modal portrait sizing, route token sizing, ship berth mini-map sizing, and season art sizing for 844x390 and 932x430 landscape.

## Verification

- `npm run validate:data` passed.
- `npm run audit:consistency` passed.
- Clean temp copy: `npm run build` passed.
- Clean temp copy: `npm run test:smoke` passed, 6/6.
- Clean temp copy: `npm run test:visual` passed.
- Captured focused screenshots in `.logs/red-team-qa-2026-05-03/art-layout-repolish-2/`.

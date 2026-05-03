# Korea Top-Down Manchuria Map Pass

## Goal

Rebuild the map background as a cleaner top-down relief map that includes southern Manchuria, removes confusing sea decorations, and keeps Jeju, Ulleungdo, and Tsushima closer to plausible relative scale.

## Changes

- Replaced the active map background with a top-down painted relief map.
- Preserved the source image at `starter/public/assets/painted2d/source/korea-relief-map-topdown-manchuria.png`.
- Removed the extra mountain-label SVG overlay so terrain is communicated by the map itself instead of duplicate labels.
- Kept existing route data, port data, and clickable marker coordinates unchanged.

## Verification

- `npm run validate:data`: passed.
- `npm run audit:consistency`: passed with the existing non-git workspace warning.
- `npm run build`: passed.
- `npm run test:smoke`: 6 passed.
- `npm run test:visual`: passed.

## Browser Screenshots

- `.logs/korea-topdown-manchuria-map/844x390-map.png`
- `.logs/korea-topdown-manchuria-map/1365x768-map.png`
- `.logs/korea-topdown-manchuria-map/1920x1080-map.png`

## Visual Audit

- Broken images: none.
- Horizontal scroll: none.
- Port markers visible: 25.
- Port markers outside map board: none.
- Mountain overlay removed: yes.
- Ulsan click selection and route preview: working.

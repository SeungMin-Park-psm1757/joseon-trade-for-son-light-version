# Scene-first UI Pass 1 Review Addendum

## Self Review

- Initial reviewed score: 78/100.
- Reason: the first result still had too much app chrome in the main flow, the map silhouette still had a polygon-island impression, and the tutorial strip covered too much of the scene.
- Final reviewed score after the additional polish pass: 86/100.

## Additional Fixes

- Reworked the landscape chrome so tabs, tutorial guide, and toast behave as floating overlays instead of consuming the scene layout.
- Kept the tutorial path visible as a compact icon path so smoke tests and the first-trade guided flow still work.
- Changed the Korea map mainland from a straight polygon outline to a curved peninsula silhouette and adjusted coast pixel marks.
- Preserved the route/node logic while making the map read more clearly as a Korea overview.
- Prevented locked tutorial steps from intercepting clicks on the active tutorial step.

## Before / After Captures

- Before: `.logs/scene-first-ui-pass-1/`
- After: `.logs/scene-first-ui-pass-1-after/`

Key after screenshots:

- `port-main-844x390.png`
- `map-844x390.png`
- `market-844x390.png`
- `market-trade-popover-844x390.png`
- `route-preview-844x390.png`
- `travel-result-844x390.png`

## Verification

- `npm run validate:data`: success.
- `npm run audit:consistency`: success with the expected temp-copy Git checkout warning.
- `npm run build`: success.
- `npm run test:smoke`: success, 5 passed.
- `npm run test:visual`: success.

## Remaining Limits

- The map is now a clearer Korea-based SVG game map, but a dedicated pixel-art map bitmap would still look richer.
- The port scene is scene-first, but the right-side brief panel can be made more diegetic in a later pass.
- The tutorial overlay is compact enough to keep the first-trade flow, but a later pass should convert it into a smaller fairy speech bubble.

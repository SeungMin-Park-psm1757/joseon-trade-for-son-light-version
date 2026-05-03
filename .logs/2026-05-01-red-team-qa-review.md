# 2026-05-01 Red-Team QA Review

## Verdict

Final status: pass after corrective polish.

The review found two layout/visual regressions severe enough to fail the requested standard. Both were fixed and rechecked with fresh screenshots. Remaining issues are minor polish items, not blockers.

## Fail Items Fixed

1. Port hotspot placement
   - Problem: on the port scene, facility hotspots could feel cramped near the lower-left scene plaque or each other, especially around the market/tavern/office cluster.
   - Fix: adjusted `HOTSPOT_LAYOUTS` in `starter/src/App.tsx` so market, tavern, and office form a clearer top scene row across all visual port types, while shipyard/fishing/map remain spatially separated.
   - Recheck: `port-1366x768-final3.png`.

2. Painted 2D CSS override conflict
   - Problem: late-loading painted art CSS overrode some scene-first UI rules. The quest current-goal card became light-background/white-text, and map layer rules needed to be locked to the normalized coordinate policy.
   - Fix: added final QA lock styles in `starter/src/painted2d-art.css` for map layers, route strokes, port labels, quest current-goal readability, quest step chips, and equipment card text contrast.
   - Recheck: `quests-1366x768-final2.png`, `map-1366x768-final2.png`, `vehicles-1366x768-final2.png`.

## Pass / Minor Matrix

### Layout

- Pass: no remaining hard overlap, clipping, or horizontal-scroll failure in the checked core views.
- Pass: right-side panel hierarchy is usable and reads as scene support instead of a pure dashboard.
- Minor: the fairy guide can visually occupy lower-left secondary content on dense 1366px layouts, but it does not block primary CTA flow.

### Graphics

- Pass: port scenes, map, panels, and icon treatment now read as one painted/pixel-inspired game direction.
- Minor: a few older generated/NPC/tool assets still vary in polish level and should be replaced in a later art pass.
- Minor: the market shelf remains somewhat top-heavy at 1366px, though it is functional and not a layout blocker.

### Map

- Pass: map uses the Korean peninsula art layer instead of the earlier abstract/polygon island feel.
- Pass: city/port markers are driven by normalized coordinates and share the same route-layer coordinate system.
- Pass: 제주, 대마도, 동해/남해/서해 route relationships are visually understandable.
- Minor: the southeast cluster remains inherently dense, but labels and nodes did not collide in the checked screenshots.

### Responsive

- Pass: 1920x1080 checked.
- Pass: 1600x900 checked.
- Pass: 1366x768 checked.
- Pass: smoke test includes a horizontal-scroll assertion.

## Modified Files

- `starter/src/App.tsx`
- `starter/src/styles.css`
- `starter/src/painted2d-art.css`

Related map/data-system files from the preceding coordinate pass remain part of the current build:

- `starter/src/types.ts`
- `starter/public/data/ports.json`
- `data/ports.json`
- `starter/public/data/map_layers.json`
- `data/map_layers.json`
- `starter/scripts/validate-data.mjs`

## Screenshots

Folder: `.logs/red-team-qa-audit/`

Key final captures:

- `port-1366x768-final3.png`
- `map-1366x768-final2.png`
- `quests-1366x768-final2.png`
- `vehicles-1366x768-final2.png`
- `red-team-layout-report-final.json`

## Verification

- `npm run validate:data`: passed
- `npm run audit:consistency`: passed, with a non-blocking warning that the local workspace is not a Git checkout
- `npm run build`: passed
- `npm run test:smoke`: passed, 6/6
- `npm run test:visual`: passed

## Remaining Risks

1. Some old/generated assets still differ in finish from the strongest scene backgrounds.
2. The fairy guide should eventually become dock-aware, so it can avoid covering dense lower-left content on smaller desktop widths.
3. The market can still be improved with better shelf distribution and touch-target grouping, but it no longer fails the layout/scene-first standard.

## Final QA Decision

No remaining Fail items. The build is acceptable for this red-team QA pass.

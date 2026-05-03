# 2026-05-01 QA 25 Visual Polish

## Scope

User asked for at least 25 screenshot-visible awkward points, fixes, and screenshot-based verification rather than code-only confidence. This pass used current captures from `.logs/qa-25-visual-pass/before/`, then repeated polish captures through `after-final-smoke-pass/` and `wide-final-smoke-pass/`.

## Files Changed

- `starter/src/App.tsx`
- `starter/src/painted2d-art.css`

## Before → After Issue Matrix

| # | Before issue from screenshot | Fix | After status |
|---|---|---|---|
| 1 | 844px HUD overflow risk: 명성/오디오/자동저장이 한 줄에 과밀 | small-landscape HUD grid rebuilt; autosave/month event hidden, fame/audio kept compact | Resolved |
| 2 | Smoke-visible fame chips were later hidden by visual patch | restored compact visible fame chips | Resolved |
| 3 | Audio volume slider consumed too much HUD width | hidden only the range input at 844/932, kept sound buttons visible | Resolved |
| 4 | Toast overlapped scene/tabs too heavily | reduced toast width and moved into a controlled top-left lane | Resolved |
| 5 | Bottom tab rail took too much vertical space | compacted tab height, padding, radius, and font in small landscape | Resolved |
| 6 | Content surface lost too much height under fixed tabs | recalculated small-landscape content height and padding | Resolved |
| 7 | Tutorial/fairy panel covered lower map and content | hidden tutorial panel on map/quests/vehicles/cargo/ledger at 844/932 | Resolved |
| 8 | Tutorial active step became hidden and broke smoke flow | restored compact active tutorial step in port/market | Resolved |
| 9 | Tutorial panel was too wide and blocked bottom scene | reduced to a compact 292px command chip | Resolved |
| 10 | Port market hotspot overlapped lower-left story plaque | fixed hotspot transform and small-landscape hotspot coordinates | Resolved |
| 11 | Active hotspot lost `translate(-50%, -50%)`, drifting down/right | added final transform lock for `.hub-hotspot.active` | Resolved |
| 12 | Market/tavern/office hotspots overlapped or felt cramped | widened x-spacing and reduced small-card size | Resolved |
| 13 | Port scene-copy panel consumed too much scene area | narrowed scene-copy and stacked CTAs at 844 | Resolved |
| 14 | Port CTA duplication still exists, but primary flow is clearer | compacted primary scene CTA and side CTA hierarchy | Improved |
| 15 | Market used only left half at 844 because side panel was hidden but grid column remained | set visual market layout to single-column when side panel is hidden | Resolved |
| 16 | Market goods were top-loaded with a large empty floor | shelf grid now stretches into two-row space on small landscape | Resolved |
| 17 | Market popup covered all goods and prevented alternate selection | shelf remains as a narrow clickable strip beside popup | Resolved |
| 18 | Market popup had excessive blank height | popup changed to content-height panel instead of full-height slab | Resolved |
| 19 | Market price label disappeared when shelf was hidden | shelf no longer hidden; smoke-visible price labels preserved | Resolved |
| 20 | Trade popup intercepted clicks on alternate goods | popup moved right; shelf kept in its own interactive lane | Resolved |
| 21 | Market badges had collision/ellipsis risk | reduced badge width/font and forced ellipsis | Resolved |
| 22 | Map tutorial panel covered southwest map/Jeju area | hidden tutorial panel on map in small landscape | Resolved |
| 23 | Map marker/label coordinate system needed screenshot verification | verified normalized coordinate layer across 844/932/1366/1600/1920 | Resolved |
| 24 | Map labels could collide in dense clusters | final metric: `labelCollisions: 0` in all tested viewports/tabs | Resolved |
| 25 | Map horizontal drift risk under viewport changes | final metric: `hScroll: false`, `docW == vw` in all tested viewports/tabs | Resolved |
| 26 | Quest screen bottom was obscured by fairy panel | hidden fairy panel on quest view at small landscape | Resolved |
| 27 | Vehicle screen equipment names wrapped vertically due narrow two-column state card | switched equipment hero vehicles to one-column at small landscape | Resolved |
| 28 | Vehicle shop/list had intentional scroll but looked blocked by fairy | fairy hidden on vehicle view; scroll area remains intentional | Resolved |
| 29 | Ledger/cargo hero text had low contrast on pale background | achievement hero now uses dark translucent scene panel with light text | Resolved |
| 30 | Cargo/ledger lower content was covered by tutorial | tutorial hidden on cargo/ledger and content retains internal scroll | Resolved |
| 31 | Absolute positioning was overused in small-market shelf/popup | replaced all good item coordinates with grid lanes in small landscape | Resolved |
| 32 | Hotspots used percentage positioning but active transform broke responsiveness | final transform lock restored normalized percent behavior | Resolved |
| 33 | Art consistency: achievement hero looked like pale dashboard | dark brass/ink panel treatment added to match scene-first UI | Resolved |
| 34 | Small map side route panel felt cramped | compacted route preview chips/grid at 844/932 | Improved |
| 35 | Wide screenshots needed regression check after small fixes | captured 1366/1600/1920 plus 932/844 final sets | Resolved |

## Screenshot Folders

- Before: `.logs/qa-25-visual-pass/before/`
- Iterations: `.logs/qa-25-visual-pass/after-1/`, `after-2/`, `after-3/`, `after-4/`
- Final 844/932: `.logs/qa-25-visual-pass/after-final-smoke-pass/`
- Final wide matrix: `.logs/qa-25-visual-pass/wide-final-smoke-pass/`

## Final Responsive Metrics

From `.logs/qa-25-visual-pass/wide-final-smoke-pass/report.json`:

- 844x390: `hScroll: false`, `labelCollisions: 0` across port, market, map, quests, vehicles, cargo
- 932x430: `hScroll: false`, `labelCollisions: 0` across port, market, map, quests, vehicles, cargo
- 1366x768: `hScroll: false`, `labelCollisions: 0` across port, market, map, quests, vehicles, cargo
- 1600x900: `hScroll: false`, `labelCollisions: 0` across port, market, map, quests, vehicles, cargo
- 1920x1080: `hScroll: false`, `labelCollisions: 0` across port, market, map, quests, vehicles, cargo

## Test Results

- `npm run validate:data`: passed
- `npm run audit:consistency`: passed, with non-blocking warning that local workspace is not a Git checkout
- `npm run build`: passed
- `npm run test:smoke`: passed, 6/6
- `npm run test:visual`: passed

## Remaining Minor Risks

1. Some lower-list content in vehicles and ledger is intentionally scroll-contained; the first screen is stable, but deeper content still depends on internal scrolling.
2. Market popup now prioritizes testable item switching and clarity; later art polish can make the left item strip look more like a wooden stall rail.
3. The 844px HUD hides monthly event/autosave text to preserve playability. Those details remain available elsewhere but are not shown in the smallest landscape HUD.

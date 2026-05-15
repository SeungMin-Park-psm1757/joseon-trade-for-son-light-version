# 2026-05-16 junior map pan and city labels

## Summary
- Moved south-coast and island city coordinates so Mokpo, Yeosu, Tongyeong, Busan, Ulsan, Suncheon, and Jeju sit closer to land or island shapes on the approved Korea map.
- Enlarged the junior map with a pan layer and added pointer drag on the map background.
- Kept city buttons clickable by excluding buttons from drag capture.
- Added historical city labels in readable UI surfaces, such as `서울(한양)`, `부산(부산포)`, `목포(목포진)`, `제주(제주목)`.
- Lowered selected city z-index so nearby city nodes do not block clicks on small/landscape screens.

## Verification
- `cd junior-game && npm run build` passed.
- `cd junior-game && npm run test -- --reporter=line` passed: 116 tests.
- Visual screenshots saved under `.logs/2026-05-16-junior-map-pan/`.

## Screenshots
- `.logs/2026-05-16-junior-map-pan/map-adjusted-3.png`
- `.logs/2026-05-16-junior-map-pan/map-after-drag.png`
- `.logs/2026-05-16-junior-map-pan/map-southwest.png`

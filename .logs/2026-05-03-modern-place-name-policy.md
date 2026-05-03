# 2026-05-03 Modern Place Name Policy

## Change

- Added tutorial explanation that Jeongwoo sees modern place names first because he is a modern child, while the Joseon-era names are shown in parentheses.
- Updated visible place names to the `modern name (Joseon-era name)` pattern where the two differ.
- Kept all data IDs unchanged.

## Examples

- `서울(한양)`
- `부산(부산포)`
- `군산(군산포)`
- `진해(제포)`
- `쓰시마(대마도)`
- `포항(영일만)`
- `신의주(의주)`
- `청진(경흥)`
- `단둥 방면(책문 장시)`
- `두만강 북방(북방장)`

## Verification

- `npm run validate:data` passed.
- `npm run audit:consistency` passed with the known non-git workspace warning.
- Clean temp copy: `npm run build` passed.
- Clean temp copy: `npm run test:smoke` passed, 6/6.
- Clean temp copy: `npm run test:visual` passed.
- Captured 844x390 tutorial/dialog screenshots and confirmed the longer explanation does not overflow or create horizontal scroll.

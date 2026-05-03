# 2026-04-27 Port Hub Route Tutorial Pass

## Implemented

- Added a visual port hub on the map screen with four picture buttons: market, office, tavern, shipyard.
- Split route advice into:
  - current cargo sale advice (`지금 팔 곳`)
  - next purchase advice (`다음에 살 것`)
- Added tavern rumor panel that summarizes the best current sale and buy rumor.
- Added first 10 minute tutorial coach card with visual cue and direct navigation button.
- Added four hub SVG assets with no external license dependency.

## Verification

- `npm run validate:data`: pass
- Temp copy `npm install`: pass
- Temp copy `npm run build`: pass
- Temp copy `npm run test:smoke`: pass
- 390x844 browser screenshots: `.logs/mobile-hub/`
- 430x932 browser screenshot: `.logs/mobile-hub/hub-430.png`
- Horizontal scroll checks: false on 390 and 430.

## Dev Server

- Running verified build copy at `http://127.0.0.1:5184`.

# 2026-04-27 Market Pixel Systems Pass

## Implemented

- Reworked market listing size by port tier:
  - S: 8 goods
  - A: 6 goods
  - B: 5 goods
  - C: 3 goods
- Market selection now prioritizes port specialties, then demand goods, then shipyard/support staples.
- Converted market cards to compact horizontal controls with icon-first buy/sell buttons.
- Reduced market text density and preserved key test IDs.
- Added image-generated pixel art direction sheet and project crops for:
  - protagonist portrait
  - harbor backdrop
  - 4 ship tiers
  - 4 cart tiers
- Vehicle shop now displays different pixel art by ship/cart progression level.

## Verification

- `npm run validate:data`: pass
- Temp copy `npm install`: pass
- Temp copy `npm run build`: pass
- Temp copy `npm run test:smoke`: pass
- 390x844 screenshots: `.logs/mobile-market-pixel/`
- 430x932 market screenshot: `.logs/mobile-market-pixel/market-430.png`
- Horizontal scroll checks: false on 390 and 430.
- 부산포 S-tier market shows 8 cards.

## Dev Server

- Running verified temp build at `http://127.0.0.1:5186`.

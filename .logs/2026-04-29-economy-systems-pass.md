# 2026-04-29 Economy Systems Pass

## Goal

Fix the economy trust break where buying and immediately selling in the same port could create profit, then make prices and route recommendations explainable from the same calculation path.

## Changed

- Rebuilt the price model around fair market price, buy quote, sell quote, spread, tax, trade bonus, and guaranteed same-port loss.
- Added good metadata for volatility, supply level, demand level, origin ports, tax rate, tier, and rarity.
- Made production ports cheaper and demand/non-production ports more expensive through supply/demand, market bias, seasonal, monthly event, risk, and port trait modifiers.
- Added risk premium from monthly risk tags such as bandits, storm, rough sea, and pirates.
- Rewired buy/sell actions, recommendation cards, route profit hints, cargo sale hints, and trade popovers to use the same quote math.
- Expanded market shelves to include carried goods and sell-hint goods, so a demanded cargo can be sold after arrival even if it is not a local staple listing.
- Clarified top fame HUD labels as merchant/exploration/guard with tooltips.
- Added economyVersion to saves so old monthly price tables are regenerated under the new model.

## Sample Quotes

Month 3, starting trade bonus 3.5%.

| Good | Origin buy/sell | Demand sell | Route profit | Same-port result |
| --- | ---: | ---: | ---: | ---: |
| 면포 부산포 -> 대구 | 25/19냥 | 45냥 | +20냥 | -6냥 |
| 소금 목포 -> 대구 | 9/7냥 | 22냥 | +13냥 | -2냥 |
| 건어물 목포 -> 한양 | 10/8냥 | 24냥 | +14냥 | -2냥 |
| 쌀 전주 -> 제주 | 9/7냥 | 21냥 | +12냥 | -2냥 |
| 한지 전주 -> 부산포 | 27/21냥 | 42냥 | +15냥 | -6냥 |
| 말 제주 -> 한양 | 120/88냥 | 209냥 | +89냥 | -32냥 |
| 은 대마도 -> 부산포 | 137/90냥 | 206냥 | +69냥 | -47냥 |

Event checks:

- Month 3 spring market raises paper: 부산포 한지 sell 42냥 vs month 4 sell 34냥.
- Month 8 pirate/rough-sea pressure raises island salt demand: 제주 소금 sell 28냥 vs month 9 sell 24냥.

## Verification

- `npm run validate:data`: passed in source repo.
- `npm run audit:consistency`: passed in source repo, with expected warning that local workspace is not a Git checkout.
- `npm run build`: passed in source repo after replacing the corrupted dependency install with a clean copy.
- `npm run test:smoke`: passed in source repo, 5/5 tests.
- `npm run test:visual`: passed in source repo.
- Additional Playwright screenshots and flow check saved under `.logs/economy-systems-pass/`.
  - `market-economy-1365x768.png`
  - `market-economy-1920x1080.png`
  - `trade-flow-daegu-market-1365x768.png`
- Manual-flow automation confirmed: new game -> 부산포 market -> buy 면포 -> travel -> 대구 market -> sell -> quest reward -> reload -> continue.

## Notes

- The source repo's first `starter/node_modules` install was corrupted by the synced drive path: TypeScript, Vite, and React type files were restored as 0-byte files. I rebuilt dependencies in a clean temp copy, copied that install back into `starter/node_modules`, removed the broken backup, and then reran the verification commands in the source repo.

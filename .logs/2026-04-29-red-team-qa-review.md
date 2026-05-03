# 2026-04-29 Red-team QA review

## Findings
- Economy audit passed: same-port buy/sell spread is always negative, origin prices are materially lower, and high-tier goods create larger absolute route deltas.
- Browser QA found one concrete UI wording failure in the market detail popover: it used "살 때/팔 때" and "평균 대비" instead of the required "매수가/매도가" and "평균가 대비".
- Map QA passed route selection stability and north-city presence checks; one defensive typo fix changed the modern name key from `sinuju` to `sinuiju`.

## Fixes
- Updated market detail labels to match the economy information design terms.
- Corrected the Sinuiju map name lookup key.

## Verification
- `npm run validate:data`: passed.
- `npm run audit:consistency`: passed with the existing non-git workspace warning only.
- `npm run build`: passed.
- `npm run test:smoke`: passed after updating the smoke expectation to the corrected market terms.
- `npm run test:visual`: passed.
- Red-team browser audit: passed, Fail 0 / Minor 0, screenshots written under `output/playwright/red-team-qa/`.
- Numeric economy audit artifact written to `output/playwright/red-team-qa/economy-audit.json`.

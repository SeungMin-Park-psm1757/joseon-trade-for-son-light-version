# Junior Star Consumables Implementation

Date: 2026-05-16

## 1. Implemented Consumables

- 신속 이동권: route card can start a fast trip, and the travel scene uses a shorter fast-travel rhythm.
- 물건 1개 반값권: a market good can be marked for one discounted purchase, then the ticket is consumed.
- 짐 보호 부적: the next cargo-loss penalty is blocked once.
- 퀴즈 다시풀기권: a wrong quiz answer can be retried once without applying the wrong-answer penalty.
- 장터 추천권: highlights a useful good in the current market.
- 소문 듣기권: opens an available local regional event or merchant rumor.

## 2. Use Conditions

- Fast travel is available from the map before departure.
- Half-price use starts from a market good card and applies to the next purchase of that chosen good.
- Cargo protect and quiz retry appear on event/quiz screens when the player owns the matching item.
- Market recommendation appears in the market.
- Rumor ticket appears from city and market contexts.

## 3. Balance Rules

- Consumables do not replace coins, carts, boats, badges, or city stamps.
- Each effect is one-use and clears after it resolves.
- Half-price tickets affect only one purchase.
- Cargo protection blocks only one cargo loss.
- Quiz retry keeps the child in the quiz once, but does not add an extra reward.
- Recommendation and rumor tickets provide information and regional learning, not direct money.

## 4. State Storage

- Added `activeEffects` to junior saves:
  - `fastTravelNextRoute`
  - `halfPriceNextGoodId`
  - `cargoProtectNextEvent`
  - `quizRetryAvailable`
  - `marketRecommendCityId`
- Older saves migrate with safe defaults.
- Consumable counts remain in `consumableItems`.
- Spending consumables does not reduce `totalStarsEarned`.

## 5. Test Result

- `npm run build`: pass
- Targeted consumable tests: pass, 36/36
- Full test suite: pass, 212/212

## 6. Screenshot Path

`.logs/2026-05-14-junior-star-consumables/`

Captured files:

- `consumable-inventory.png`
- `half-price-ticket-use.png`
- `fast-travel-ticket-use.png`
- `cargo-protect-trigger.png`
- `quiz-retry-use.png`
- `rumor-ticket-event.png`

## 7. Remaining Limits

- Half-price ticket is intentionally simple and good-based rather than city-based. If child playtests show confusion, add a one-line confirmation modal before applying it.
- Market recommendation currently highlights one useful item; it does not explain a full route plan.
- Fast travel shortens presentation only. It does not bypass route rules, which keeps save state stable.

# Junior Balance Notes

Last QA pass: 2026-05-14

## Target Pace

| Goal | Expected play | Target time | QA result |
| --- | --- | --- | --- |
| First trade success | Buy in Busan, travel to Daegu, solve one easy event, sell | 3-5 min | Pass |
| 100 coins | 3-5 small trades with one good-sale route | 8-12 min | Pass |
| Handcart | Near or after 100 coins | Around 10 min | Pass |
| First boat | Several trades after handcart | 15-20 min | Pass |
| 300 coin ending | 9-12 focused trades, fewer with upgrades | 20-30 min | Pass |

## Current Economy

- Start coins: 30.
- Start cargo limit: 2.
- Ending goal: 300 coins.
- Same-city resale does not create profit.
- Local goods are easy to buy; popular destination sales give a clearer profit and often a star.
- Repeated buying in the same city nudges buy prices up.
- Repeated selling of the same good in the same city nudges sell prices down.

## Star Economy

- Stars are not a replacement for coins.
- `starBalance` is the spendable star count shown in the top bar.
- `totalStarsEarned` is the lifetime count used for badge milestones.
- Existing saves with only `stars` migrate into both fields, so children keep their old stars.
- Cosmetic star items cost 4-12 stars and do not change cargo, price, route, or combat strength.
- Consumable star items cost 3-6 stars and are limited to convenience effects.
- Badge thresholds use lifetime stars: 5 stars for `착한 일 배지`, 10 stars for `퀴즈 달인`.
- Real playtest watchpoint: if children spend all stars and feel punished, add clearer "모은 별 총 N개" copy to the star shop goal line.
- The top-bar star chip is the reward-system entry point. This avoids adding another bottom tab.
- The star shop is separated from the cart/boat screen so children do not confuse stars with core trade upgrades.
- Owned non-consumable cosmetics cannot be bought twice. They move to the treasure box for equipping/removing.
- Consumable counts are visible in the treasure box; their detailed effects remain intentionally convenience-only.

## 2026-05-16 Consumable Balance

- 신속 이동권 is a pacing helper. It shortens the next trip presentation but still uses the normal travel/arrival flow, so it does not unlock routes or skip story state.
- 물건 1개 반값권 applies to one selected market good only. It consumes the ticket on purchase and then clears the pending effect, preventing repeated discounts.
- 짐 보호 부적 is defensive only. It prevents one cargo-loss penalty from a risky event or wrong quiz result, then disappears.
- 퀴즈 다시풀기권 lowers frustration for younger children by keeping them on the same quiz once after a wrong answer. It does not grant extra coins or stars by itself.
- 장터 추천권 highlights a useful good in the current city. It is information help, not a price bonus.
- 소문 듣기권 opens a local regional story when one is available. It supports learning and does not grant direct trade power.
- The current costs, 3-6 stars, feel safe because children must still earn coins through buying, moving, and selling.
- Watchpoint: if half-price tickets make early coin growth too fast in real play, restrict them to non-tutorial sessions or raise the cost from 6 to 7 stars.

## 2026-05-16 Star System QA

- Star earning remains small and readable: good sale +1, quiz/event success usually +1, special story rewards at +1 to +2 only.
- Cosmetic prices are balanced for desire without replacing trade goals: starter decoration 4-5 stars, regular clothes/tools 6-8, premium items 10-12.
- Consumables are priced below premium skins but high enough to avoid spam: recommendation/rumor 3, quiz retry 4, fast travel/protection 5, half-price 6.
- Half-price ticket is the strongest convenience item, so it applies once to one selected good and consumes on purchase.
- Fast travel keeps the route result intact and only shortens the presentation, preserving the map/travel rhythm.
- Cargo protection and quiz retry reduce frustration but do not generate direct profit.
- Automated QA confirms `starBalance` drops on purchase, `totalStarsEarned` does not, and legacy `stars` saves migrate.

## Upgrade Costs

| Upgrade | Cost | Effect | QA judgment |
| --- | ---: | --- | --- |
| Handcart | 100 | Cargo limit 3 | Good first milestone |
| Big cart | 190 | Cargo limit 4 | Good mid milestone |
| Merchant cart | 300 | Cargo limit 5 | Optional late goal |
| Small ferry | 200 | Sea cargo limit 2, unlocks easier sea routes | Good 15-20 min goal |
| Sailboat | 360 | Sea cargo limit 3 | Later replay goal |
| Sturdy sailboat | 520 | Sea cargo limit 4 | Long sea-route goal |
| Merchant ship | 720 | Sea cargo limit 5 | Optional late goal |

## 2026-05-14 Vehicle And Regional Event Balance

- Cart cargo and boat cargo are now shown separately. The market still uses the current general cargo display, while the map route card explains whether the selected trip uses cart cargo or boat cargo.
- Cart costs stayed at 0/100/190/300 so the handcart remains reachable around the first 10 minutes.
- Boat costs stayed at 0/200/360/520/720. The first boat is still a mid-game goal, but the UI now explains why it matters before the child can buy it.
- Merchant rumor and regional learning events use a 30% city/market entry chance after tutorial completion.
- First-visit landmark learning is prioritized after tutorial completion and avoids repeating the same event back-to-back.
- Dialect events are one-time per city and include a fairy explanation to avoid confusing or mocking regional speech.

## Event Penalties

- Tutorial wrong answer: -1 coin only.
- Most wrong answers: -5 coins.
- Some bandit/pirate misses can lose one cargo, but there is no game over.
- Result copy should reassure the child that play can continue.

## QA Notes

- The first trade loop raised the save from 30 coins to 44 coins and 2 stars in automated play.
- Route event frequency feels acceptable because the tutorial guarantees one event and later events are low-chance.
- The strongest child-facing motivators are visible money feedback, city stamps, and the handcart goal.
- No balance change was required in this QA pass.

## Watch Next

- If real child playtests show the boat feels far away, lower `small_ferry` from 200 to 180.
- If children rush to 300 coins too quickly, reduce popular-city sale bonuses by 1-2 coins.
- If quiz misses feel punishing, remove `loseCargo` from the first bandit/pirate events.

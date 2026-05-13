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

## Upgrade Costs

| Upgrade | Cost | Effect | QA judgment |
| --- | ---: | --- | --- |
| Handcart | 100 | Cargo limit 3 | Good first milestone |
| Big cart | 190 | Cargo limit 4 | Good mid milestone |
| Merchant cart | 300 | Cargo limit 5 | Optional late goal |
| Small ferry | 200 | Unlocks easier sea routes | Good 15-20 min goal |
| Sailboat+ | 360+ | Longer sea route comfort | Later replay goal |

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

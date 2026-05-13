# Junior SWF Implementation Review

Date: 2026-05-14

## Release Gate Summary

Junior mode now carries the useful SWF-inspired rhythm from full mode without inheriting full-mode complexity. The implemented loop is:

`today goal -> market buy -> route card -> travel -> event/result -> sale -> upgrade goal -> stamps/badges -> ending hint`.

No SWF assets, code, sounds, UI text, or extracted files were used.

## Implementation Review

| Full-mode / SWF-inspired idea | Junior result | QA status | Notes |
| --- | --- | --- | --- |
| Current goal and next recommendation | "오늘 할 일" card | Pass | One sentence and one CTA. |
| Rich market price info | Child-safe "산 값", "파는 돈", "여기서 사기 좋아" | Pass | No average price, margin, demand/supply terms. |
| Destination choice with risk preview | "길 카드" | Pass | Uses route type and fairy hint, no risk number. |
| Travel tension | Short travel scene plus possible event | Pass | Tutorial guarantees one simple event. |
| Event resolution feedback | Result chips for coins/stars/cargo | Pass | Clear and short. |
| Upgrade excitement | Equipment goal plus purchase celebration | Pass | Handcart and boat goals are visible. |
| Long-term progress | City stamps, badges, 300 coin ending hint | Pass | Progress is visible without ledger complexity. |
| Fast button response | Immediate card/animation feedback | Pass | Buy/sell feedback appears without leaving market. |
| Repeatable trade loop | Market stays open after buy/sell | Pass | Lets the child keep acting. |
| PWA continuity | LocalStorage save and continue | Pass | Existing save key preserved. |

## Child UX Review

- Start action is visible within 10 seconds.
- Main buttons meet the 56px target.
- The market gives visual choice through good cards.
- The map allows city selection and shows a route card before departure.
- Wrong answers do not game-over the child.
- Money change is visible immediately.
- Handcart/boat goals are visible enough to motivate repeat trading.
- Ending goal appears clearly at 300 coins.

## Balance Review

- First trade success target: 3-5 minutes in real child pacing.
- Automated QA first loop: 30 coins -> 44 coins, 2 stars.
- Handcart at 100 coins remains a good early milestone.
- Small ferry at 200 coins remains a good second milestone.
- 300 coin ending remains appropriate for 20-30 minutes.
- No numeric balance changes were required in this QA pass.

## Mobile And PWA Review

Validated viewports:

- 360x800
- 390x844
- 412x915
- 430x932
- 844x390

Results:

- App shell visible.
- Primary start button is not hidden by browser UI.
- Manifest file loads.
- Service worker file loads.
- Offline fallback file loads.
- Console/page/asset errors: 0 in local QA.
- GitHub Pages loads with status 200 before push.

## Remaining Limits

- This is an automated and developer-led QA pass, not a real child playtest.
- Some existing text/assets were already in the junior branch before this QA pass.
- True timing targets still need observation with a child and adult.

# Jeongwoo's Little Merchant Adventure

Junior mode is a small Joseon trade RPG for grade 1-2 children. It is a separate light-mode app and does not include full-mode/starter code.

## Run Locally

```bash
npm install
npm run dev
```

Default local URL:

```text
http://127.0.0.1:4390/
```

## Core Loop

1. See today's goal.
2. Buy a good at the market.
3. Load it into cargo.
4. Pick a city on the map.
5. Check the route card.
6. Travel.
7. Solve a small event or quiz.
8. Sell the good.
9. Earn coins/stars.
10. Buy a cart or boat.
11. Check separate land cargo and sea cargo.
12. Hear short regional stories and market rumors.
13. Collect city stamps and badges.
14. Reach 300 coins and choose the ending.

## Child-Friendly Language Rules

Use:

- 산 값
- 파는 돈
- 여기서 사기 좋아
- 다른 도시에서 인기 많아
- 대구 장터에서 잘 팔려
- 목포에서 찾는 사람이 많아
- 짐에 실렸어
- 돈이 늘었어
- 조금 더 모으면 손수레야

Avoid:

- 매수가
- 매도가
- 마진
- 수익률
- 수요/공급
- 명성
- 선박 상세 수치
- full-mode ledger terms

## Screens

- Start / continue
- City
- Market
- Map
- Travel
- Event / quiz
- Event result
- Vehicle shop
- Ending choice
- Ending

## Data And Save

Save storage:

```text
joseon_trade_junior_save_v1
```

The save migration keeps older saves playable and fills defaults for newer fields such as result chips.
It also fills regional event defaults so older saves can keep going without losing progress.

## Test

```bash
npm run build
npm run test
```

Validated flows:

- tutorial flow
- market buy/sell feedback
- route card before travel
- event result card
- upgrade celebration
- vehicle current status, cart/boat prices, land/sea cargo
- regional merchant rumor, dialect, landmark, and repeat prevention
- city stamps and badges
- ending hint
- save/continue
- PWA manifest/service worker/offline files

## GitHub Pages

Current Pages URL:

```text
https://seungmin-park-psm1757.github.io/joseon-trade-for-son-light-version/
```

Local release check:

```bash
npm run build
npx vite preview --host 127.0.0.1 --port 4390
```

Release checks:

- app loads on mobile viewport
- manifest loads
- service worker loads
- offline fallback loads
- continue works after reload
- console errors are 0

## Asset Policy

Do not include SWF original files, extracted SWF images, extracted SWF sounds, or decompiled SWF code. Junior mode may reuse only the gameplay structure translated into child-friendly Joseon trade mechanics.

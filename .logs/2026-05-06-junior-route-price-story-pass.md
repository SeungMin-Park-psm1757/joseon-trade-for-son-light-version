# Junior Route, Price, Story Pass

Date: 2026-05-06

## 1. 변경 요약

- 이동 이벤트 확률을 총합 3%가 아니라 종류별 1~3% 버킷으로 분리했다.
- 설화형 서브스토리 이벤트를 추가했다.
- 판매 카드에 최초 구매 값을 표시했다.
- 같은 도시에서 산 물건은 그 도시에서 산 값보다 비싸게 팔리지 않도록 조정했다.
- 도시 이동 화면을 약 4.8초로 늘리고 지형별 2D 이동 레이어를 추가했다.
- 21개 도시 화면에 도시별 고유 SVG 모티프 오버레이를 더했다.

## 2. 이벤트 확률 구조

- 나쁜 사건: 3%
- 좋은 사건: 2%
- 길 위 대화: 2%
- 이야기 단서: 1%

각 이벤트 데이터는 `mood`와 `chancePercent`를 가진다. 한 이동에 최대 1개만 고른다.

## 3. 설화 이벤트 판단

- `떡 하나 주면 안 잡아먹지`는 무서운 호랑이 표현 대신 `떡을 나누면 고개 길이 환해지는 이야기`로 바꿨다.
- `선녀와 나무꾼`은 납치/숨김 요소를 쓰지 않고 `선녀의 잃어버린 옷감을 찾아주는 이야기`로 바꿨다.
- 둘 다 맞춤법 퀴즈와 이야기 단서 보상으로 연결했다.

## 4. 저장과 이어하기

- 저장 키는 `joseon_trade_junior_save_v1`을 유지한다.
- `buyPrice`가 없는 기존 짐 데이터는 normalize 단계에서 현재 구매가로 보정한다.
- 새로고침 후 현재 단계, 도시, 짐, 가격 변화가 유지되는 smoke test를 통과했다.

## 5. 가격 로직

- 구매 시 cargo item에 `buyPrice`를 저장한다.
- 판매 화면에 `산 값 n냥`을 표시한다.
- 같은 도시 되팔이는 `Math.min(현재 판매값, 산 값)`을 사용한다.
- 같은 도시 즉시 되팔이로 이익이 나지 않는 테스트를 추가했다.

## 6. 이동 씬

- 이동 시간: 2.65초에서 4.85초로 증가.
- 산길, 강길, 바닷가, 바닷길, 장터길 지형 클래스를 노선 데이터에 연결했다.
- 산길에는 둥근 산 능선, 강길에는 강/다리, 바닷길에는 물결을 보여준다.

## 7. 테스트 결과

```text
cd junior-game
npm run build
npm run test

build: passed
test: 44 passed
```

## 8. 스크린샷 경로

- `.logs/screenshots/junior-route-price-story-2026-05-06/map-390.png`
- `.logs/screenshots/junior-route-price-story-2026-05-06/city-jeju-390.png`
- `.logs/screenshots/junior-route-price-story-2026-05-06/market-same-city-price-390.png`
- `.logs/screenshots/junior-route-price-story-2026-05-06/travel-mountain-mid-390.png`
- `.logs/screenshots/junior-route-price-story-2026-05-06/event-folktale-390.png`

## 9. 남은 한계

- 21개 도시별 완전 신규 비트맵 배경을 모두 생성한 것은 아니며, 기존 junior 전용 배경 위에 도시별 고유 2D 모티프를 얹는 방식이다.
- 향후에는 도시별 고유 2D 배경 PNG를 아트 패스로 일괄 제작하면 더 좋다.

## 10. 다음 추천 작업

- 바닷길 이동 스크린샷도 별도 QA로 추가한다.
- 도시별 배경을 실제 21종 독립 일러스트로 확장한다.
- 이벤트 서브스토리를 2~3단계 연속 퀘스트처럼 더 자연스럽게 묶는다.

# 2026-05-14 Junior Vehicle And Regional Events

## 1. 탈것 UI 수정 요약

- `junior-game`만 수정했다. `starter/` full mode 코드는 건드리지 않았다.
- 탈것 화면을 현재 보유 상태, 다음 목표, 수레 장만, 배 장만 순서로 다시 정리했다.
- 현재 수레/현재 배를 별도 행으로 표시하고, 각 카드에 상태 뱃지를 추가했다.
- 카드 상태는 `쓰는 중`, `보유 중`, `살 수 있어`, `돈이 부족해`로 구분한다.

## 2. 수레/배 짐칸 표시 방식

- 수레에는 땅길 짐칸, 배에는 바닷길 짐칸을 표시한다.
- 하단 상태 영역에는 `땅길 N칸 · 바닷길 N칸` 요약을 항상 보여준다.
- 지도 길 카드에서 육로는 수레 짐칸, 해로는 배 짐칸을 사용한다고 설명한다.
- 배가 없는데 해로를 고르면 출발 버튼은 막고 작은 나룻배 목표를 안내한다.

## 3. 가격 표시 수정

- 보따리/손수레/큰 수레/장사 수레 모든 카드에 `가격 N냥`을 표시한다.
- 배 없음/작은 나룻배/작은 돛배/튼튼한 돛배/장사배 모든 카드에 `가격 N냥`과 바닷길 짐칸을 표시한다.
- 가격 밸런스는 기존 QA 기준을 유지했다: 손수레 100, 큰 수레 190, 장사 수레 300, 작은 나룻배 200.

## 4. 지역 이벤트 추가 목록

- 부산: 건어물 상인 소문, `어서 오이소` 사투리, 큰 항구 이야기
- 대구: 약초 상인 소문, 내륙 장터 이야기
- 전주: 한지 상인 소문, 여유로운 장터 말맛
- 목포: 소금 상인 소문, 서해 갯벌 이야기
- 제주: 귤 상인 소문, `혼저 옵서예` 사투리, 한라산 이야기
- 서울/강릉/안동/광주/통영/평양: 명소와 지역 특징 이야기
- 계절 후보: 봄 꽃길, 가을 단풍길

## 5. 사투리/명소/특산품 이벤트 처리 방식

- 지역 이벤트 저장 필드 `seenRegionalEventIds`, `lastRegionalEventCityId`, `lastRegionalEventId`를 추가했다.
- 튜토리얼 중에는 지역 이벤트가 나오지 않게 막았다.
- 장터 진입 시 30% 확률로 상인 소문/지역 이벤트를 연다.
- 첫 방문 이후에는 명소 이벤트를 우선할 수 있고, 같은 이벤트가 바로 반복되지 않게 했다.
- 사투리 문구는 짧게 두고 바람이가 표준어 설명을 붙인다.

## 6. 문구 교체 목록

- `서울에 팔아봐`류 문구 대신 `서울에서 인기 많아`, `대구 장터에서 잘 팔려`, `목포에서 찾는 사람이 많아`를 사용한다.
- 오늘 목표는 `팔아보자`보다 `여기서 잘 팔려`, `가져가면 좋아` 쪽으로 바꿨다.
- 장비 화면은 `구매`보다 `장만하기`, `지금 수레`, `지금 배`, `현재 탈것`을 중심으로 쓴다.

## 7. 테스트 결과

- `cd junior-game && npm run build`: 통과
- `cd junior-game && npm run test -- --reporter=line`: 108 passed
- 추가/보강한 검수:
  - vehicle-current-status-visible
  - cart-prices-visible
  - boat-prices-visible
  - land-vs-sea-cargo-visible
  - regional-merchant-rumor
  - regional-dialect-event
  - regional-landmark-event
  - no-repeated-regional-event
  - natural-market-hint-copy

## 8. 스크린샷 경로

- `.logs/2026-05-14-junior-vehicle-region-events/vehicle-current-status.png`
- `.logs/2026-05-14-junior-vehicle-region-events/vehicle-cart-prices.png`
- `.logs/2026-05-14-junior-vehicle-region-events/vehicle-boat-prices.png`
- `.logs/2026-05-14-junior-vehicle-region-events/route-land-cargo.png`
- `.logs/2026-05-14-junior-vehicle-region-events/route-sea-cargo.png`
- `.logs/2026-05-14-junior-vehicle-region-events/regional-merchant-rumor.png`
- `.logs/2026-05-14-junior-vehicle-region-events/regional-dialect.png`
- `.logs/2026-05-14-junior-vehicle-region-events/regional-landmark.png`
- `.logs/2026-05-14-junior-vehicle-region-events/market-natural-hint-copy.png`

## 9. 남은 한계

- 지역 이벤트는 데이터 기반으로 시작했지만, 모든 도시가 같은 깊이의 이야기 묶음을 가진 것은 아니다.
- 장터의 전체 짐칸은 아직 단일 보유 짐 기준이다. 지도/출발 카드에서 육로/해로 차이를 설명하는 방식으로 단순화했다.
- 해로 잠김 도시는 선택해서 설명을 볼 수 있지만, 출발은 배 구매 전까지 막힌다.

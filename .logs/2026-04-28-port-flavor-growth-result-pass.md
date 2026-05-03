# 2026-04-28 Port Flavor Growth Result Pass

## 1. 변경 요약

- 항구 생활감 데이터를 `port_flavors.json`으로 분리했다.
- 시장 진열 순서와 상품별 장터 좌표를 데이터 기반으로 연결했다.
- 의뢰 탭 상단에 첫 30분 성장길 그림 지도 패널을 추가했다.
- 사건 결과 칩에 돈/수레/배/화물/정박 안전 아이콘 언어를 붙였다.
- 데이터 검증, 빌드, 스모크 테스트와 가로 화면 스크린샷을 다시 확인했다.

## 2. 항구 개성 데이터화

`starter/public/data/port_flavors.json`을 추가했다.

- `id`: `ports.json` 항구 ID
- `goods`: 항구 간판 대표 상품
- `marketSlots`: 시장 진열 우선순위
- `stallPositions`: 상품별 진열 좌표

검증 스크립트는 항구 ID와 상품 ID 참조 오류를 잡는다.

## 3. 장터 좌표 배치

시장 화면은 기존 `marketGoodsForPort` 결과를 유지하되, `marketSlots`가 있으면 표시 순서만 조정한다.
`stallPositions`가 있는 항구는 `.free-stall-shelf`로 전환해 상품 아이콘을 배경 위 좌표에 배치한다.

## 4. 성장 지도

기존 첫 30분 튜토리얼 단계를 `growthPathSteps`로 공유하고, 의뢰 탭에 `GrowthJourneyMap`을 추가했다.
완료/다음/잠금 상태를 그림 노드로 보여주며, 가능한 노드는 기존 탭 이동 동작으로 이어진다.

## 5. 사건 결과 칩

`resultLineKind`가 결과 문구를 간단히 분류한다.

- 돈/냥: 돈 칩
- 수레/바퀴: 수레 칩
- 선박/배: 배 칩
- 화물/짐/손실: 화물 칩
- 정박 문구: 안전 칩

## 6. 테스트 결과

- `npm run validate:data`: 성공
- `npm run build`: 원본 Google Drive 경로의 `node_modules` 실행 파일 문제로 실패, temp copy에서 성공
- `npm run test:smoke`: temp copy에서 성공, 3 passed

## 7. 가로화면 UI 확인

스크린샷: `.logs/mobile-landscape-port-flavor-growth-result-pass/`

- `market-position-busan.png`
- `market-position-daegu.png`
- `quest-growth-map.png`
- `quest-growth-map-932.png`
- `event-result-icons.png`
- `portrait-rotate-notice.png`
- `verification.json`

`verification.json` 기준 844×390, 932×430 모두 가로 스크롤 없음.

## 8. 남은 한계

- 항구별 장터 좌표는 핵심 항구 6곳 위주다.
- 사건 결과 아이콘은 CSS 텍스트 칩 기반이며, 별도 픽셀 이미지 에셋은 아직 없다.
- 성장 지도는 첫 30분 목표를 보여주지만, 장기 챕터 전체 지도는 아니다.

## 9. 다음 추천 작업

1. 나머지 항구의 `port_flavors.json` 개성과 시장 좌표를 보강한다.
2. 사건 결과 칩을 작은 픽셀 아이콘 PNG로 교체한다.
3. 첫 30분 이후 제주/대마도까지 이어지는 장기 성장 지도 2장을 추가한다.

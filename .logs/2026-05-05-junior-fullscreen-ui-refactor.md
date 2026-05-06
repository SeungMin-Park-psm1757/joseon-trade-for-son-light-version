# Junior Fullscreen UI Refactor

Date: 2026-05-05

## 1. 변경 요약

- `junior-game`을 full mode와 분리된 독립 게임으로 유지했다.
- 기존 작은 지도/패널 중심 화면을 전면 선택형 화면 구조로 바꿨다.
- 도시, 지도, 장터, 이벤트, 가게 화면이 각각 한 행동을 대표하도록 재구성했다.

## 2. 화면 구조

- 도시/항구 메인: 큰 배경 일러스트, 상단 상태바, 4개 행동 버튼.
- 지도: 대한민국 전도 느낌의 전면 보드게임판, 도시 선택 후 하단 출발판.
- 장터: 3~4개 큰 상품 카드, 사기/팔기 중심.
- 이벤트: 큰 장면, 정우/요정, 숫자퀴즈 또는 선택지.
- 가게: 수레와 배 성장 카드.

## 3. 게임 흐름

- 튜토리얼 뒤 자유 플레이는 `city` 허브 화면으로 돌아온다.
- 이동 후 이벤트가 없으면 도시 화면으로 도착한다.
- 이벤트 결과 확인 후에도 도시 화면으로 돌아온다.
- 판매 후 엔딩 조건이 아니면 도시 화면으로 돌아온다.

## 4. 그래픽 정리

- CSS 도형 수레를 제거하고 `result-cart.png`를 사용했다.
- 가게 수레/배 카드를 `result-cart.png`, `result-ship.png` 기반으로 바꿨다.
- 이벤트 화면은 텍스트 아이콘 대신 장면 이미지, 정우, 요정, 심볼을 조합했다.
- 도시 화면은 도시/항구 배경 일러스트가 화면 대부분을 차지하게 했다.

## 5. 저장 분리

- junior 저장 키는 계속 `joseon_trade_junior_save_v1`이다.
- full mode 저장 키나 `starter/src` 파일은 건드리지 않았다.

## 6. 테스트 결과

- `cd junior-game && npm run build`: 통과.
- `cd junior-game && npm run test`: 28 passed.
- `cd starter && npm run build`: 통과.
- junior 코드에서 `starter/src`, full save key import 검색: 결과 없음.

## 7. 스크린샷

경로: `.logs/screenshots/junior-fullscreen-ui-2026-05-05/`

- `01-city-main.png`
- `02-map-fullscreen.png`
- `03-market-cards.png`
- `04-event-fullscreen.png`
- `05-shop-growth.png`
- `06-ending-choice.png`

390x844 계측 결과 모든 스크린샷이 viewport 안에 들어왔다.

## 8. 남은 아트 한계

- 지도는 CSS/SVG 기반의 보드게임판이다. 완전한 커스텀 비트맵 전도는 아직 아니다.
- 이벤트 50건마다 고유 일러스트가 있는 것은 아니며, 현재는 공통 장면 이미지를 조합한다.
- 도적/해적 전용 캐릭터 일러스트는 아직 없다. 무섭지 않은 심볼로 처리했다.

## 9. 다음 추천 작업

- junior 전용 대한민국 전도 비트맵 제작.
- 도적, 해적, 날씨, 친절 이벤트별 고유 컷인 일러스트 추가.
- 수레/배 성장 단계별 전용 아트 세트 제작.

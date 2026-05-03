# 2026-04-29 Sale Guide Companion Equipment Pass

## 1. 변경 요약

- 지도 화면에 현재 화물 기준 최고 판매처 오버레이와 강조 루트를 추가했다.
- 화물/장부 화면에서 보유 물건별 "어디서 팔지" 버튼을 먼저 보여주고, 누르면 지도 루트로 연결되게 했다.
- 이벤트 선택지에 동료/개인 장비가 더한 호위, 기술 판정, 필요 물품/허가장 보조 문구를 표시했다.
- 개인 장비를 1단계/2단계 성장선으로 나누고, 장비 탭 첫 화면을 개인 장비 중심으로 재배치했다.
- smoke test가 판매 추천, 화물 판매 힌트, 개인 장비 성장선까지 확인하도록 보강했다.

## 2. 구현 방식

- `cargoSaleHintsForCurrentPort` 결과를 지도, 화물/장부, 시장 팝업에서 공유한다.
- `WorldMapBoard`는 최고 판매처를 `saleGuide`로 받아 목적지 노드와 루트를 강조하고, 상품 아이콘 말풍선을 띄운다.
- `CargoLedger`는 보유 화물 버튼을 먼저 보여준다. 버튼을 누르면 기존 `openSellHint` 흐름으로 지도 탭과 루트 선택이 이어진다.
- 이벤트 선택지는 `effectiveSkillValue`로 기본 능력치, 동료, 개인 장비 보너스를 합산해 표시와 판정에 사용한다.
- `tools.json`에는 tier, requiresTool, hint를 최소 추가했다. 기존 basic tools는 tier 1, 새 advanced tools는 tier 2다.

## 3. 테스트 결과

- 원본 경로:
  - `npm run validate:data` 성공
  - `npm run audit:consistency` 성공. 단, 로컬 폴더가 Git checkout이 아니라는 기존 경고가 있다.
  - `npm run build` 실패. Google Drive/한글 경로의 `node_modules/.bin` 실행 문제로 기존과 같은 환경 이슈다.
- 임시 영문 경로 `C:\Users\QuIC\AppData\Local\Temp\joseon-trade-sale-guide-pass\starter`:
  - `npm run validate:data` 성공
  - `npm run audit:consistency` 성공
  - `npm run build` 성공
  - `npm run test:smoke` 성공, 4 passed
  - `npm run test:visual` 성공

## 4. 가로화면 확인

- 844x390: 지도 판매 오버레이, 화물 판매 힌트, 개인 장비 성장선, 이벤트 선택지 보조 문구 확인.
- 932x430: 지도 판매 오버레이와 가로 스크롤 없음 확인.
- 저장 스크린샷:
  - `.logs/sale-guide-companion-equipment-pass/sale-guide-map-844x390.png`
  - `.logs/sale-guide-companion-equipment-pass/sale-guide-map-932x430.png`
  - `.logs/sale-guide-companion-equipment-pass/cargo-sale-hints-844x390.png`
  - `.logs/sale-guide-companion-equipment-pass/personal-kit-path-844x390.png`
  - `.logs/sale-guide-companion-equipment-pass/event-choice-support-844x390.png`

## 5. 남은 한계

- 판매 추천은 아직 인접 루트 중심이다. 장거리 최적화나 자동 경유 탐색은 넣지 않았다.
- 이벤트별 동료 고유 대사는 아직 없다. 지금은 능력치 보조 문구와 판정 반영 중심이다.
- 개인 장비는 CSS 픽셀 아이콘이다. PNG 아이템 아이콘 세트는 후속 보강 대상이다.
- 장비 구매 축하 연출은 아직 배/수레와 개인 장비 모두 부족하다.

## 6. 다음 추천 작업

1. 항구별 고유 NPC 반응과 동료별 시설 대사: 부산포, 대구, 목포, 제주, 대마도부터 차별화한다.
2. 장비 구매 축하와 새 루트 안내: 손수레, 어선, 연안상선, 개인 장비 2단계 구매 시 짧은 장면을 띄운다.
3. 이벤트 선택지 2차: 동료가 있는 경우 선택지 결과 문구와 성공 확률 힌트를 더 그림 중심으로 보여준다.

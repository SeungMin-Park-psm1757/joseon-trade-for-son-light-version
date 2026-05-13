# 2026-05-09 Full Mode SWF-Inspired Implementation

## 1. 구현 요약

- Full mode `starter/`에 SWF 분석에서 얻은 빠른 선택, 이동 긴장감, 짧은 결과, 다음 목표 안내 리듬을 반영했다.
- Junior Light Mode는 수정하지 않았다.
- 항구, 시장, 지도, 화물/장부, 의뢰, 장비 화면에 현재 목표와 다음 추천 행동을 보여주는 full mode 목표 스트립을 추가했다.
- 시장은 산 값, 파는 값, 평균가, 가격 이유, 추천 판매처, 즉시 되팔기 손익, 상품 사용 노트를 보여준다.
- 지도는 위험 프로필, 준비물, 추천 상품, 보상 힌트, 계절 위험을 표시한다.
- 이동 사건은 루트 사건 덱을 우선하고 첫 이동에 길 위 사건을 체감하게 했다.
- 장비 화면은 부족 금액과 새로 유리해지는 길을 표시한다.

## 2. SWF 분석에서 반영한 요소

- 버튼 클릭 즉시 구매/판매/이동/선택 피드백.
- 이동 중 사건 카드와 짧은 결과 카드.
- 보상 획득 시 `+냥`, 명성, 다음 목표 안내.
- 첫 장사 뒤 손수레와 새 항로 목표를 바로 보여주는 반복 루프.
- 장비 구매를 다음 지역/위험 대응과 연결하는 성취감.

## 3. 조선식 변환 방식

- 해적 추격은 남해 해적, 왜구성 위험, 수군 호위 명성으로 변환했다.
- 항해 중 랜덤 사건은 도적, 해적, 태풍, 갯벌, 암초, 검문, 길손 상인, 표류선 구조로 변환했다.
- 선박 업그레이드는 나룻배, 어선, 연안 상선, 무장 상선, 조운선형 상선 성장선으로 변환했다.
- 전투 보상은 돈과 화물 중심이 아니라 상인 신용, 호위 명성, 항구 신뢰, 장부 진행으로 연결했다.
- 대외 교역은 본토 확장이 아니라 왜관/대마도, 책문 장시, 두만강 북방장 허가 목표로 제한했다.

## 4. 수정 파일 목록

- `starter/src/App.tsx`
- `starter/src/types.ts`
- `starter/src/styles.css`
- `starter/public/data/routes.json`
- `starter/public/data/events.json`
- `starter/public/data/goods.json`
- `starter/public/data/ships.json`
- `starter/public/data/carts.json`
- `starter/public/data/tools.json`
- `data/routes.json`
- `data/events.json`
- `data/goods.json`
- `data/ships.json`
- `data/carts.json`
- `data/tools.json`
- `docs/GAME_OVERVIEW_CURRENT.md`
- `docs/SYSTEM_SPEC.md`
- `docs/UI_SPEC.md`
- `docs/FULL_MODE_SWF_REDESIGN.md`
- `docs/FULL_MODE_IMPLEMENTATION_PLAN_FROM_SWF.md`
- `tests/ACCEPTANCE_CHECKLIST.md`

## 5. 테스트 결과

- `npm run validate:data`: 통과. 17 data files, ports 27, goods 28, routes 34.
- `npm run audit:consistency`: 통과. 19 data files, quests 14, tools 10, companions 9.
- `npm run build`: 통과. Vite production build 완료.
- `npm run test:smoke`: 통과. 7 passed.
- `npm run test:visual`: 통과. visual snapshots 생성.
- 확인용 dev server: `http://127.0.0.1:5176`

## 6. 스크린샷 경로

- `.logs/2026-05-09-full-mode-swf-inspired-implementation/full-port.png`
- `.logs/2026-05-09-full-mode-swf-inspired-implementation/full-market.png`
- `.logs/2026-05-09-full-mode-swf-inspired-implementation/full-map-route.png`
- `.logs/2026-05-09-full-mode-swf-inspired-implementation/full-travel-event.png`
- `.logs/2026-05-09-full-mode-swf-inspired-implementation/full-sale-result.png`
- `.logs/2026-05-09-full-mode-swf-inspired-implementation/full-equipment-goal.png`
- `.logs/2026-05-09-full-mode-swf-inspired-implementation/full-ledger-goal.png`
- 자동 visual 결과: `.logs/2026-05-09-full-mode-swf-inspired-implementation/visual-final/`

## 7. 남은 한계

- 장기 목표 UI는 노출 중심이며, 거상 엔딩과 후반 장부 완성 연출은 아직 깊게 구현하지 않았다.
- 전투는 여전히 간단 선택/자동 판정 중심이다. 전용 전투 화면과 턴제 행동 UI는 후속이다.
- 항구별 시장 정체성은 일부 상품/루트 중심으로 강화했지만, 모든 항구의 개별 NPC 대사와 진열 차이는 추가 패스가 필요하다.
- 밸런스는 smoke 기준으로 확인했으며, 손수레→어선→연안 상선까지의 평균 거래 횟수는 별도 플레이테스트가 필요하다.

## 8. 다음 작업

- 첫 2시간 수익 곡선과 위험 기대 손실 계산.
- 장비별 실제 위험 감소 체감 강화.
- 남해/제주/대마도/북방 장부 조각 조건별 전용 보상 연출.
- 도적/해적/태풍/검문 전용 장면 이미지 품질 보강.
- `Port.marketIdentity`, `Quest.phase`, `Companion.eventAdviceTags`, `LedgerSeal.nextHint` 후보 필드의 후속 데이터화.

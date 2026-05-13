# Junior SWF Implementation Plan

Last updated: 2026-05-14

목적: `docs/JUNIOR_SWF_REDESIGN_SPEC.md`를 실제 구현 가능한 milestone으로 나눈다. 이 문서는 계획 문서이며, 아직 구현을 시작하지 않는다.

## 1. 구현 원칙

| 원칙 | 내용 |
|---|---|
| Junior만 수정 | 구현 단계에서는 `junior-game/`만 대상으로 한다. |
| Full mode와 분리 | `starter/`와 full mode 데이터는 건드리지 않는다. |
| 저장 호환 | `joseon_trade_junior_save_v1`을 유지하고 기존 저장을 깨지 않는다. |
| 파생 UI 우선 | 새 필드보다 기존 `tutorialStage`, `cargo`, `visitedCityIds`, `coins`에서 목표를 파생한다. |
| 낮은 문해 부담 | 한 화면 1-2문장, 한 문장 25자 내외를 지킨다. |
| 테스트 우선 | 주요 카드에는 안정적인 `data-testid`를 붙인다. |
| 자산 금지 | SWF 원본/추출 이미지, 사운드, 코드, 문구는 사용하지 않는다. |

## Milestone 1. 목표 카드/오늘 할 일

| 항목 | 내용 |
|---|---|
| 목표 | 첫 10초 안에 아이가 다음 행동을 알게 한다. |
| 수정 파일 | `junior-game/src/JuniorApp.tsx`, `junior-game/src/juniorFlow.ts` 후보, `junior-game/src/juniorStyles.css` |
| 데이터 수정 | 없음 우선. 필요 시 목표 파생용 helper만 추가 |
| 테스트 | `npm run build`, `npm run test`, 시작/도시/장터/지도 smoke 확인 |
| 완료 기준 | 도시, 장터, 지도, 상점 화면에 한 문장 `오늘 할 일` 또는 다음 목표가 보이고 핵심 버튼이 하나 강조된다. |

구현 메모:

| 작업 | 설명 |
|---|---|
| `getJuniorTodayGoal(save)` 후보 | 현재 상태에서 목표 문구, 강조 버튼, testid를 파생한다. |
| 도시 화면 카드 | 기존 `junior-progress-card`를 목표 카드로 정리한다. |
| 튜토리얼 강조 | `tutorialStage`에 따라 장터, 면포, 대구, 팔기, 탈것을 순서대로 강조한다. |
| 저장 변경 최소화 | `todayGoalId`는 저장하지 않고 계산한다. |

## Milestone 2. 장터 정보 구조

| 항목 | 내용 |
|---|---|
| 목표 | 시장 정보를 junior 언어로 정리해 사고파는 이유가 보이게 한다. |
| 수정 파일 | `junior-game/src/JuniorApp.tsx`, `junior-game/src/juniorStyles.css`, 필요 시 `junior-game/src/juniorFlow.ts` |
| 데이터 수정 | 없음 우선. 후속 후보: `JuniorGood.childHint` |
| 테스트 | market-flow smoke, 같은 도시 되팔기 smoke, 390px 수동 확인 |
| 완료 기준 | 상품 카드가 `산 값`, `파는 돈`, `여기서 사기 좋아`, `이 도시에서 인기` 중심으로 보이고, 구매/판매 뒤 돈 변화가 즉시 보인다. |

구현 메모:

| 작업 | 설명 |
|---|---|
| 상품 카드 정리 | `baseBuyCoins`가 아니라 계산된 `getBuyPrice`를 `산 값`으로 표시한다. |
| 판매 카드 정리 | `getSellPriceForCargo`를 `파는 돈`으로 표시한다. |
| 자연어 힌트 | `getBestSellCityForGood` 결과를 "대구에서 인기 많아"로 표시한다. |
| 구매 후 창 유지 | 기존 동작 유지. 대신 다음 목표 카드가 지도 이동을 알려준다. |
| 피드백 | 구매 `-냥`, 판매 `+냥` 짧은 칩 또는 메시지 강화. |

## Milestone 3. 길 카드/이동 전 확인

| 항목 | 내용 |
|---|---|
| 목표 | 지도에서 도시를 고른 뒤 이동의 성격과 기대감을 읽게 한다. |
| 수정 파일 | `junior-game/src/JuniorApp.tsx`, `junior-game/src/juniorStyles.css` |
| 데이터 수정 | 기존 `JUNIOR_ROUTES`의 `terrain`, `fairyText`, `arrivalHint`, `routeType` 사용 |
| 테스트 | 지도 smoke, 해로 needsBoat smoke, 390x844/844x390 수동 확인 |
| 완료 기준 | 선택 도시 카드 안에 `길 카드`가 보이고, 육로/해로와 못 가는 이유가 짧게 표시된다. |

구현 메모:

| 작업 | 설명 |
|---|---|
| 길 이름 파생 | `scenery`와 `kind`에서 산길/바닷길/장터길/강가 길/북방길 파생. |
| 요정 힌트 | route의 `fairyText`를 길 카드 문구로 사용. |
| 출발 버튼 | 선택 카드의 가장 큰 CTA로 유지. |
| 배 필요 | "작은 배가 있으면 갈 수 있어."처럼 표시. |

## Milestone 4. 사건 결과 카드

| 항목 | 내용 |
|---|---|
| 목표 | 사건/퀴즈 뒤 성공과 손실이 짧고 선명하게 보이게 한다. |
| 수정 파일 | `junior-game/src/JuniorApp.tsx`, `junior-game/src/juniorStyles.css`, 필요 시 `junior-game/src/juniorFlow.ts` |
| 데이터 수정 | 없음 우선. 후속 후보: `JuniorReward`에서 result chip 파생 helper |
| 테스트 | event-quiz-flow smoke, pirate/land quiz smoke, 오답 수동 확인 |
| 완료 기준 | 결과 화면에 `돈 +`, `별 +1`, `짐 하나 잃음`, `괜찮아` 중 해당 칩이 표시되고 계속하기 버튼이 명확하다. |

구현 메모:

| 작업 | 설명 |
|---|---|
| 결과 칩 파생 | 선택 전 save와 결과 save의 차이를 비교하거나 reward에서 파생. |
| 오답 완충 | `quizWrongStreak`가 높으면 힌트 문구를 더 짧고 친절하게 보이게 한다. |
| 무서운 표현 완화 | 도적/해적은 겁주는 그림보다 길 위 문제로 표현. |
| 계속 버튼 | 결과 카드의 유일한 주요 버튼. |

## Milestone 5. 탈것 장만 보상

| 항목 | 내용 |
|---|---|
| 목표 | 손수레와 배가 돈 모으기의 강한 목표가 되게 한다. |
| 수정 파일 | `junior-game/src/JuniorApp.tsx`, `junior-game/src/juniorStyles.css`, `junior-game/src/juniorFlow.ts` |
| 데이터 수정 | 기존 `JUNIOR_VEHICLES`, `JUNIOR_BOATS` 유지. 후속 후보: `unlockHint` |
| 테스트 | 상점 구매 smoke, 저장/이어하기, cargoLimit 변화 확인 |
| 완료 기준 | 현재 탈것, 다음 탈것, 부족한 돈, `짐칸 +1`, 새 길 힌트, 구매 축하가 보인다. |

구현 메모:

| 작업 | 설명 |
|---|---|
| 다음 장비 계산 | 현재 `vehicleId`, `boatId`, `coins` 기준 다음 목표를 파생한다. |
| 부족 돈 표시 | "손수레까지 40냥 남았어." |
| 효과 문구 | 기존 `text`를 유지하되 `짐칸 +1` 같은 숫자 하나만 보조로 표시. |
| 구매 축하 | `message`와 결과 스타일을 사용해 짧은 축하 표시. |

## Milestone 6. 엔딩 힌트

| 항목 | 내용 |
|---|---|
| 목표 | 300냥 목표와 도시 도장/배지를 반복 동기로 만든다. |
| 수정 파일 | `junior-game/src/JuniorApp.tsx`, `junior-game/src/juniorStyles.css`, 필요 시 tests |
| 데이터 수정 | 없음 우선. `visitedCityIds`, `badges`, `ENDING_COINS` 사용 |
| 테스트 | endingChoice smoke, completedEnding 저장, 도장/배지 표시 수동 확인 |
| 완료 기준 | `300냥까지 n냥`, 도시 도장 수, 최근 배지, 집으로 가기/계속 장사 선택이 명확하다. |

구현 메모:

| 작업 | 설명 |
|---|---|
| 도시 도장 표시 | `visitedCityIds.length`를 목표 카드로 표시. |
| 아직 못 간 곳 | 지도에서 잠긴 느낌보다 "아직 못 가본 도시"로 표시. |
| 엔딩 전 힌트 | 250냥 이상부터 집으로 돌아갈 목표를 예고. |
| 엔딩 후 | `꼬마 거상 정우` 배지와 계속 장사 버튼 유지. |

## Milestone 7. 테스트/밸런스

| 항목 | 내용 |
|---|---|
| 목표 | 첫 5-7분 튜토리얼과 20-30분 엔딩 목표가 실제로 맞는지 검수한다. |
| 수정 파일 | `junior-game/tests/junior-smoke.spec.ts`, 필요 시 `junior-game/src/*` 밸런스 조정 |
| 데이터 수정 | 가격/보상/퀴즈 난이도만 최소 조정 |
| 테스트 | `npm run build`, `npm run test`, viewport 수동 확인 |
| 완료 기준 | 첫 성공 3-5분, 손수레 10분 내외, 작은 배 15-20분, 300냥 20-30분 흐름이 유지된다. |

검수 시나리오:

| 시나리오 | 확인 |
|---|---|
| 튜토리얼 | 새 게임 -> 부산 장터 -> 면포 구매 -> 대구 이동 -> 퀴즈 -> 판매 |
| 장터 | 구매 후 창 유지, 짐칸 변화, 돈 변화 |
| 지도 | 현재 위치, 갈 수 있는 도시, 길 카드, 배 필요 표시 |
| 사건 | 정답/오답 결과, 작은 손실, 힌트 |
| 성장 | 손수레 구매, cargoLimit 증가, 작은 배 목표 |
| 엔딩 | 300냥 도달, 집으로/계속 장사, 저장 유지 |

## 2. 권장 구현 순서

1. Milestone 1과 2를 먼저 묶어 첫 5분 루프를 선명하게 만든다.
2. Milestone 3으로 지도 이동 전 기대감을 강화한다.
3. Milestone 4로 이동 중 사건의 결과 리듬을 정리한다.
4. Milestone 5와 6으로 반복 목표를 강화한다.
5. Milestone 7에서 실제 playtest 기준으로 문구와 가격을 줄인다.

## 3. 예상 수정 파일 총괄

| 영역 | 파일 |
|---|---|
| 화면/컴포넌트 | `junior-game/src/JuniorApp.tsx` |
| 흐름/helper | `junior-game/src/juniorFlow.ts` |
| 타입 | `junior-game/src/juniorTypes.ts` |
| 데이터 | `junior-game/src/juniorData.ts` |
| 스타일 | `junior-game/src/juniorStyles.css` |
| 테스트 | `junior-game/tests/junior-smoke.spec.ts` |

## 4. 데이터 변경 정책

| 정책 | 내용 |
|---|---|
| 첫 구현은 optional 또는 파생 | 저장 스키마를 바로 늘리지 않는다. |
| 기존 ID 유지 | 도시, 상품, 이벤트, 장비 ID를 바꾸지 않는다. |
| 새 필드는 후속 | `stampLabel`, `childHint`, `unlockHint`, `once`는 필요가 확인되면 추가한다. |
| 가격 조정은 작게 | 엔딩 시간이 깨질 때만 1-2냥 단위로 조정한다. |
| SWF 자료 제외 | reference SWF 원본/추출 파일은 junior 번들에 포함하지 않는다. |

## 5. 테스트 명령

```bash
cd junior-game
npm run build
npm run test
```

권장 수동 viewport:

```text
390x844
412x915
430x932
844x390
```

## 6. 다음 구현 프롬프트 초안

```text
너는 junior-game의 principal React/TypeScript implementer다.

목표:
docs/JUNIOR_SWF_REDESIGN_SPEC.md와 docs/JUNIOR_SWF_IMPLEMENTATION_PLAN.md의 Milestone 1-2만 구현하라.

범위:
- junior-game/만 수정한다.
- starter/와 full mode는 건드리지 않는다.
- SWF 자산, 코드, 사운드, 문구는 사용하지 않는다.
- 기존 저장키 joseon_trade_junior_save_v1 호환을 유지한다.

필수 구현:
1. 오늘 할 일 카드와 목표 파생 helper
2. 도시/장터/지도/상점의 다음 행동 안내
3. 장터 카드 문구를 산 값/파는 돈/여기서 사기 좋아/이 도시에서 인기 중심으로 정리
4. 구매/판매 후 +냥/-냥 피드백
5. 주요 신규 UI에 data-testid 추가

검증:
cd junior-game
npm run build
npm run test

수동 확인:
새 게임 -> 부산 장터 -> 면포 구매 -> 지도 -> 대구 선택 -> 이동 -> 퀴즈 -> 대구 도착 -> 면포 판매 -> 손수레 목표 확인
```


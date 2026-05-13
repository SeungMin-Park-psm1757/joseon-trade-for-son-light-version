# Junior SWF Translation Table

Last updated: 2026-05-14

목적: full mode에 반영된 SWF-inspired 구조를 `junior-game/`에 맞는 초등 저학년용 작은 무역 RPG 문법으로 번역한다. 이 문서는 구현 지시가 아니라 구현 전 변환 설계다. SWF의 이미지, 사운드, 코드, 문구, 캐릭터, UI 그래픽은 사용하지 않는다.

## 1. 읽은 자료

| 구분 | 확인한 자료 |
|---|---|
| Full mode 분석 | `reference-swf/analysis/full-mode/swf-comparison-table.md`, `full-mode-gameplay-extraction.md`, `full-mode-adaptation-priority.md` |
| Full mode 설계/검수 | `docs/FULL_MODE_SWF_REDESIGN.md`, `docs/FULL_MODE_IMPLEMENTATION_PLAN_FROM_SWF.md`, `docs/FULL_MODE_SWF_IMPLEMENTATION_REVIEW.md`, `docs/FULL_MODE_BALANCE_NOTES.md` |
| Junior 기준 | `docs/JUNIOR_MODE_DESIGN.md`, `docs/JUNIOR_PLAYTEST_CHECKLIST.md`, `docs/JUNIOR_BALANCE_NOTES.md`, `docs/JUNIOR_SWF_GATE_REPORT.md` |
| Junior 코드 | `junior-game/src/JuniorApp.tsx`, `juniorData.ts`, `juniorFlow.ts`, `juniorTypes.ts`, `juniorStyles.css`, `junior-game/tests/` |

## 2. 번역 원칙

Junior mode는 full mode의 축소판이 아니다. 같은 재미 구조를 어린이가 읽을 수 있는 말, 한 번에 누를 수 있는 버튼, 작은 손실과 즉시 회복되는 보상으로 다시 만든 별도 게임이다.

| 원칙 | Junior 적용 |
|---|---|
| 글 줄이기 | 한 카드 한 문장, 요정 말은 18자 안팎을 우선한다. |
| 수치 숨기기 | 위험도, 평균가, 수익률, 평판 수치, 내구도는 화면에 드러내지 않는다. |
| 선택 줄이기 | 초반에는 버튼 1개, 선택지 2개, 상품 2-3개가 적정하다. |
| 실패 낮추기 | 오답이나 위험 사건은 작은 돈/별/짐 손실로 끝내고 게임오버를 만들지 않는다. |
| 보상 크게 | `+냥`, `별 +1`, `도장`, `짐칸 +1`처럼 아이가 즉시 알아보는 보상을 쓴다. |
| 목표 짧게 | "대구에서 면포를 팔아보자."처럼 오늘 할 일을 하나만 보인다. |
| 정체성 유지 | 조선 장터, 도시 도장, 수레와 작은 배 중심으로 유지한다. |

## 3. Full Mode 요소별 Junior 변환표

| full mode 요소 | full mode에서의 역할 | junior에 가져올지 여부 | junior 변환 방식 | 초1 난이도 조정 | 필요한 UI | 필요한 데이터 | 구현 우선순위 |
|---|---|---|---|---|---|---|---|
| 첫 30분 루프 강화 | 부산포 구매, 대구 이동, 사건, 판매, 의뢰, 손수레 목표를 끊기지 않게 만든다. | 단순화해서 가져옴 | `첫 장사 한 판`: 부산 장터에서 면포 사기 -> 대구 가기 -> 쉬운 사건 -> 팔기 -> 별/돈 받기 -> 손수레 보기 | 목표 시간은 30분이 아니라 첫 성공 3-5분, 엔딩 20-30분으로 축소 | 시작 코치, 오늘 할 일 카드, 첫 판매 보상 카드 | 기존 `tutorialStage`, `message`, `visitedCityIds`, `badges` 활용 | 높음 |
| 현재 목표/다음 추천 스트립 | 모든 화면에서 다음 행동을 잃지 않게 한다. | 가져옴 | 화면 하단 또는 상단의 `오늘 할 일` 카드로 변환 | 한 문장과 버튼 하나만 표시. 예: "대구에서 면포를 팔아보자." | `오늘 할 일` 카드, 큰 CTA 버튼 | `todayGoalId` 후보 또는 기존 `message`/`tutorialStage`에서 파생 | 높음 |
| 시장 가격 정보 강화 | 산 값, 파는 값, 평균가, 가격 이유, 추천 판매처로 교역 판단을 만든다. | 일부만 가져옴 | `산 값`, `파는 돈`, `여기서 사기 좋아`, `여기서 값이 좋아`, 자연어 힌트만 사용 | 평균가, 수익률, 마진, 시세차익 금지 | 큰 상품 카드, 가격 말풍선, `서울에서 인기 많아` 힌트 | 기존 `buyGoodIds`, `sellGoodIds`, `getBuyPrice`, `getSellPriceForCargo` | 높음 |
| 지역 특산품/수요품/월별 유행품 표시 | 항구별 장터 차이와 월별 판단을 드러낸다. | 단순화해서 가져옴 | `이 도시 물건`, `여기서 인기`, `오늘의 추천` 아이콘 칩 | 월별 경제 설명은 숨기고 추천만 말한다. 예: "오늘은 소금이 잘 팔려." | 아이콘 칩 1-3개, 상품 카드 리본 | 기존 도시 `buyGoodIds`/`sellGoodIds`; 후속 `dailyTipGoodId` 후보 | 높음 |
| 지도 이동 전 위험 카드 | 출발 전 위험, 소요일, 준비물, 보상 힌트를 보여준다. | 크게 단순화해서 가져옴 | `길 카드`: 산길/바닷길/장터길/북방길, 큰 그림, 위험 아이콘 1개, 요정 한마디, 출발 버튼 | 위험 숫자, 성공률, 준비물 목록 금지. "조심조심 가자." 정도 | 지도 선택 카드, 길 타입 배지, 출발 버튼 | 기존 `route.kind`, `scenery`, `terrain`, `fairyText`, `distance` | 높음 |
| 이동 중 사건 리듬 | 이동이 빈 클릭이 아니라 긴장과 선택을 가진 장면이 된다. | 가져옴 | 작은 사건 카드와 맞춤법/숫자/선택 퀴즈로 변환 | 정답이면 통과, 오답이면 작은 손실. 첫 5회는 쉬운 문제 우선 | 전면 사건 카드, 2지선다 버튼, 요정 힌트 | 기존 `JUNIOR_EVENTS`, `chancePercent`, `quizWrongStreak`, `seenEventIds` | 높음 |
| 위험 이벤트 결과 칩 | 돈, 평판, 화물, 내구 변화가 짧게 보인다. | 단순화해서 가져옴 | `돈 +숫자`, `별 +1`, `짐 하나 잃음`, `괜찮아, 계속 갈 수 있어.` | 내구/평판/신뢰 금지. 부정 결과도 부드러운 문장으로 마감 | 결과 도장 카드, 보상 칩 1-3개, 계속하기 버튼 | 기존 `JuniorReward`, `eventResultText`, `badges` | 높음 |
| 장비 성장 목표 | 손수레, 배, 장비가 다음 수익과 항로 목표가 된다. | 가져옴 | 손수레, 큰 수레, 작은 나룻배, 작은 돛배만 전면 목표로 사용 | 장비 수치는 `짐칸 +1`, `바닷길 좋아`로 번역 | 탈것 목표 카드, 부족한 돈 문장, 구매 축하 카드 | 기존 `JUNIOR_VEHICLES`, `JUNIOR_BOATS`, `cargoLimit`, `boatId` | 높음 |
| 장비 가격 밸런스 | 첫 장사 후 바로 끝나지 않고 3-5회 거래 목표를 만든다. | 가져옴 | 첫 성공 후 "손수레까지 40냥 남았어"처럼 작은 목표 표시 | 가격은 100/190/300/200/360냥 곡선을 유지하되 부족 금액만 보인다 | 목표 진행 막대 또는 동전 줄, 상점 카드 | 기존 `cost`, `coins`, `ENDING_COINS` | 중간 |
| 장기 목표 노출 | 장부, 허가, 권역 목표가 돈 모으기 이후를 만든다. | 다른 형태로 가져옴 | 장부 조각 대신 도시 도장, 별, 꼬마 거상 배지, 300냥 집으로 돌아가기 | 허가/북방/대마도/장부 조각은 숨김. 도장 수와 엔딩만 보임 | 도장판, 배지 줄, 엔딩 목표 카드 | 기존 `visitedCityIds`, `badges`, `completedEnding`, `ENDING_COINS` | 높음 |
| QA용 안정 식별자 | 자동 테스트가 핵심 루프를 안정적으로 확인한다. | 그대로 유지 | 어린이 UI에는 보이지 않는 `data-testid`를 계속 사용 | 난이도 영향 없음 | 없음. 내부 QA 속성만 유지 | 기존 smoke test 식별자; 신규 카드 추가 시 `today-goal`, `route-card` 등 후보 | 높음 |

## 4. Junior에 넣을 것

| 넣을 구조 | 이유 |
|---|---|
| 오늘 할 일 카드 | 아이가 첫 10초 안에 할 일을 알아야 한다. |
| 시장의 자연어 가격 힌트 | 교역 판단은 살리되 경제 용어를 숨길 수 있다. |
| 길 카드 | 지도 이동 전의 기대감과 긴장감을 만든다. |
| 작은 사건/퀴즈 | SWF식 이동 중 변화는 살리면서 학습형 안전 장치가 된다. |
| 보상 카드 | 성공 리듬을 빠르게 만들고 반복 동기를 준다. |
| 수레/배 목표 | 첫 10-20분의 장기 목표가 된다. |
| 도시 도장/배지 | full mode 장부 목표를 아이가 이해할 수 있는 수집 목표로 바꾼다. |
| 안정 테스트 ID | junior 작업이 잦아져도 smoke test를 지킬 수 있다. |

## 5. Junior에 넣지 않을 것

| 제외할 구조 | 이유 |
|---|---|
| 평균가, 수익률, 마진, 스프레드 | 초1-초2에게 경제표처럼 보인다. |
| 위험도 숫자와 성공률 | 사건을 재미보다 계산으로 느끼게 한다. |
| 상세 평판, 항구 신뢰, 호위 명성 | 보상 체계가 분산된다. |
| 장부 조각, 허가장, 북방/대외 교역 허가 | full mode 목표이며 junior 첫 루프를 흐린다. |
| 복잡한 전투와 해전 | 오답/위험의 실패감이 커지고 UI가 무거워진다. |
| 내구도, 수리비, 보급품 | 장비 목표를 어렵게 만든다. |
| SWF 자산, 코드, 사운드, 문구 | 저작권상 금지이며 조선 junior 정체성과도 맞지 않는다. |

## 6. 구현 전 데이터 판단

현재 `junior-game`은 이미 `JuniorSave`, `JUNIOR_CITIES`, `JUNIOR_ROUTES`, `JUNIOR_EVENTS`, `JUNIOR_VEHICLES`, `JUNIOR_BOATS` 구조를 갖고 있다. 따라서 첫 구현은 대규모 데이터 재설계보다 기존 필드에서 파생 가능한 UI를 먼저 붙이는 것이 좋다.

| 후보 | 우선 방식 |
|---|---|
| 오늘 할 일 | 새 필드보다 `tutorialStage`, `cargo`, `currentCityId`, `coins`, `vehicleId`, `boatId`에서 파생 |
| 길 카드 | 기존 `route.kind`, `scenery`, `terrain`, `fairyText`, `arrivalHint` 사용 |
| 시장 칩 | 기존 `buyGoodIds`, `sellGoodIds` 사용 |
| 결과 칩 | 기존 `JuniorReward`에서 파생. 필요하면 후속으로 `resultChips` 추가 |
| 도장판 | 기존 `visitedCityIds`와 `badges` 사용 |


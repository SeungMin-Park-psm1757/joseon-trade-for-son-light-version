# 2026-05-01 정우-바람이 튜토리얼 스토리 패스

## 1. 변경 요약

- 정우가 낡은 장부로 조선 부산포에 오게 된 도입 대화를 게임 안에 추가했다.
- 요정 `바람이` 대사를 `tutorial_dialogues.json`으로 분리했다.
- `GameState`에 튜토리얼 단계, 완료 목록, 활성 대화, 일시정지, 건너뛰기 상태를 추가했다.
- 대화 중 시장 거래, 이동, 장비 구매, 어업, 납품, 사건 선택 등 주요 액션을 막았다.
- 시장/면포/지도/대구/판매/손수레 흐름을 강조 target과 단계 trigger로 연결했다.

## 2. 정우 도입 스토리 구현 방식

새 게임 시작 후 부산포 발견 카드가 닫히면 바람이가 정우에게 말을 건다.

- “정우야, 눈을 떠봐! 여긴 조선의 부산포야.”
- “낡은 장부가 너를 데려왔어.”
- “팔도의 장사길을 열면 집으로 갈 단서를 찾을 수 있어.”

긴 소설형 도입은 피하고, 두 장면 안에 상황과 첫 목표를 설명하도록 압축했다.

## 3. 요정 대화 시스템 구현 방식

- 데이터: `starter/public/data/tutorial_dialogues.json`
- 타입: `TutorialDialogue`, `TutorialRequiredAction`, `TutorialStage`
- 화면: 기존 `TutorialStoryModal`을 데이터 기반 요정 대화창으로 확장
- 초상: 기존 `GuideSpirit` SVG를 사용하고 감정 상태를 `default/happy/warning/surprised`로 매핑

대화는 `nextId`가 있으면 다음 대화로 이어지고, `requiredAction`이 있으면 대화창을 닫은 뒤 해당 행동을 강조한다.

## 4. 게임 일시정지 로직

`tutorialIsPaused(data, state)`가 참이면 주요 입력을 막는다.

막은 함수:

- `navigate`
- `buyGood`
- `sellGood`
- `travel`
- `resolveEvent`
- `goFishing`
- `buyShip`
- `buyCart`
- `buyTool`
- `repairShip`
- `callShipToPort`
- `recruitCompanion`
- `renameFleet`
- `deliverQuestGoods`

발견/사건/보상 등 다른 모달이 떠 있을 때는 해당 모달 조작을 우선한다.

## 5. 튜토리얼 단계표

| 단계 | 트리거 | 다음 대화 |
| --- | --- | --- |
| `intro` | 새 게임 | `intro_001`, `intro_002` |
| `go_market` | 시장 탭 클릭 | `market_first_001` |
| `inspect_good` | 면포 카드 클릭 | `buy_first_001` |
| `buy_first_good` | 면포 구매 | `bought_first_001` |
| `open_map` | 지도 탭 클릭 | `map_first_001` |
| `choose_first_destination` | 대구 도착 | `arrived_first_001` |
| `sell_first_good` | 대구 시장 입장 | `sell_first_001` |
| `sell_first_good` | 대구에서 면포 판매 | `profit_first_001` |
| `first_profit` | 다음 버튼 | `cart_goal_001` |

## 6. 어린이용 문구/용어 변경 내용

- 튜토리얼 대사는 “정우야”로 시작하는 짧은 문장 중심으로 작성했다.
- 시장 안내는 “상품 그림”, “사는 값”, “파는 값”, “짐칸”, “벌 수 있어”처럼 쉬운 말로 정리했다.
- `docs/STORY_AND_TUTORIAL.md`에 용어 교체 기준을 표로 기록했다.

## 7. 수정 파일 목록

- `starter/src/types.ts`
- `starter/src/App.tsx`
- `starter/src/painted2d-art.css`
- `starter/public/data/tutorial_dialogues.json`
- `data/tutorial_dialogues.json`
- `starter/tests/smoke.spec.ts`
- `starter/scripts/visual-check.mjs`
- `docs/STORY_AND_TUTORIAL.md`
- `.logs/2026-05-01-jeongwoo-fairy-tutorial-story-pass.md`

## 8. 테스트 결과

- `npm run validate:data`: 성공
- `npm run audit:consistency`: 성공
  - 경고: 현재 workspace가 Git checkout이 아니라는 기존 환경 경고
- `npm run build`: 성공
- `npm run test:smoke`: 성공, 6 passed
- `npm run test:visual`: 성공

## 9. 스크린샷 경로

저장 위치:

- `.logs/jeongwoo-fairy-tutorial-pass/`

캡처:

- `tutorial-dialog-1366x768.png`
- `tutorial-dialog-1920x1080.png`
- `tutorial-dialog-844x390.png`
- `tutorial-dialog-932x430.png`
- `market-entry-1366x768.png`
- `market-entry-1920x1080.png`
- `market-entry-844x390.png`
- `market-entry-932x430.png`

검증 결과:

- 1366x768, 1920x1080, 844x390, 932x430 모두 대화창 표시 확인
- 위 viewport 모두 가로 스크롤 없음

## 10. 남은 한계

- 어업/부탁/장비 첫 안내 데이터는 준비했지만 자동 노출은 초반 smoke 흐름을 과도하게 막지 않도록 제한했다.
- 요정 표정은 기존 SVG 변형을 사용하므로 고품질 전용 컷신 에셋은 아직 아니다.
- 튜토리얼 “다시 보기”는 저장 상태와 건너뛰기 구조만 준비했고 별도 설정 버튼은 후속 작업이다.

## 11. 다음 추천 작업

1. 요정 다시 보기/도움말 버튼을 장부 또는 설정 팝업에 추가한다.
2. 첫 장사 완료 후 바람이 축하 컷신과 손수레 목표 연출을 더 강하게 만든다.
3. 어업/부탁/장비 첫 안내는 플레이 동선을 방해하지 않는 작은 말풍선형으로 분리한다.

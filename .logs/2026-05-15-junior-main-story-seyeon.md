# Junior Main Story: Seyeon

Date: 2026-05-15

## 1. 메인 스토리 구조

- 정우는 현실 세계의 아이이며 현실 동생 세연이가 있다.
- 낡은 장부를 만진 뒤 조선 시대로 이동한다.
- 부산 장터에서 현실 동생과 닮은 조선의 세연이를 만난다.
- 세연이는 글, 산수, 지도, 날씨, 장사를 배우고 싶어 한다.
- 세연이의 마음이 장부와 바람이를 깨웠고, 정우는 세연이의 꿈을 돕기 위해 장사를 시작한다.
- M01-M12 메인 스토리 이벤트를 `JUNIOR_MAIN_STORY_EVENTS`에 추가했다.

## 2. 세연이 노트 구조

`seyeonNotebook` topics:

- writing
- math
- map
- weather
- trade

각 topic 상태는 `locked`, `started`, `completed` 중 하나이다.
이번 구현에서는 메인 스토리 보상으로 `started`를 연다.

## 3. 장부 단서 구조

- `ledgerClues`는 junior save에 저장된다.
- 기존 `storyClues` 보상은 `ledgerClues`로도 반영된다.
- M10은 장부 단서 첫 반짝임을 보여 준다.
- 엔딩 조건은 장부 단서 3개를 요구한다.

## 4. UI 추가 내용

- 메인 스토리 대화 오버레이 추가.
- 화자 이름, 아이콘, 짧은 문장, 다음 버튼을 사용한다.
- 중요한 대화 중에는 다른 조작을 막는다.
- 도시 화면 보조 버튼 추가:
  - 세연이 노트
  - 이야기 수첩
  - 소문 지도
- 하단 탭은 늘리지 않았다.

## 5. 테스트 결과

실행 위치: `junior-game`

- `npm run build`: pass
- `npm run test`: pass, 236 passed

추가 테스트:

- `main-story-starts`
- `seyeon-notebook-unlocks`
- `ledger-clue-progress`
- `study-room-progress`
- `ending-condition-requires-story`
- `legacy-save-migration-story-fields`

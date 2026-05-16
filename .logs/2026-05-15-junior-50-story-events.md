# junior-game 50개 한국 이야기 서브스토리 추가 로그

## 1. 메인 구조

- `junior-game`에 `JuniorStoryEvent` 데이터 타입을 추가했다.
- 50개 이벤트는 먼저 이야기 원형을 정하고, 그 뒤에 소문, 본 이벤트, 해결 방식, 보상으로 나누어 데이터화했다.
- 1차 이벤트는 모두 한국 전래동화, 설화, 역사 인물, 지역 학습 이야기 기반이다.
- `full mode`와 `starter/` 구조는 수정하지 않았다.

## 2. 이벤트 데이터

- `JUNIOR_STORY_EVENTS`에 E01-E50을 추가했다.
- 각 이벤트는 다음 필드를 가진다.
  - `id`, `title`, `storySource`, `category`
  - `regionId`, `mountainId`, `routeId`
  - `triggerType`, `prerequisiteEventIds`
  - `rumorCityIds`, `mapMarker`
  - `dialogueCuts`, `choices`, `quiz`, `requiredGoodId`
  - `reward`, `childSafetyNotes`, `once`, `chainId`, `chainStep`
- 모든 이벤트에는 소문 대사, 본 이벤트 대사, 해결 대사, 선택지, 보상, 아이 안전 각색 메모가 있다.

## 3. 산 위치 구조

- `JUNIOR_MOUNTAINS`를 추가했다.
- 추가 산 ID:
  - `baekdu`, `taebaek`, `songni`, `gyeryong`, `deogyu`
  - `naejang`, `mudeung`, `gaya`, `chiak`, `wolchul`
  - `gwanak`, `guwol`, `jiri`, `geumgang`, `halla`
- 각 산에는 `name`, `nearbyCityIds`, `routeType`, `shortDescription`, `storyEventIds`를 연결했다.
- 산 이벤트는 이벤트 데이터의 `mountainId`와 산 데이터의 `storyEventIds`가 서로 맞도록 구성했다.

## 4. 보상 구조

- 보상은 한 이벤트당 핵심 1-2개만 사용했다.
- 사용 보상:
  - `stars`
  - `coins`
  - `ledgerClue`
  - `seyeonNotebookProgress`
  - `storyFragment`
  - `rumorUnlock`
- 장부 단서는 중요한 이야기 흐름에만 배치했다.
  - E25 구월산 임꺽정 3
  - E35 심청전 4 마음이 닿은 편지
  - E42 충무공의 바람 2

## 5. 아이 안전 각색

- 호랑이는 위협 대상이 아니라 떡을 찾는 배고픈 길동무로 바꾸었다.
- 선녀와 나무꾼은 잃어버린 옷감을 돌려주는 이야기로 바꾸었다.
- 심청전은 희생과 죽음 없이 연꽃 편지와 마음 전달 이야기로 바꾸었다.
- 별주부전은 몸의 일부를 요구하는 요소를 빼고 지혜와 사과 편지 이야기로 바꾸었다.
- 홍길동과 임꺽정은 폭력 없이 정직함, 계산, 공정한 장부를 돕는 인물로 바꾸었다.
- 콩쥐팥쥐, 우렁각시, 흥부전은 벌, 괴롭힘, 결혼 요소를 줄이고 도움, 기록, 나눔 중심으로 바꾸었다.

## 6. 테스트 결과

- 추가 테스트:
  - `story-events-count-50`
  - `story-events-have-dialogue`
  - `story-events-have-child-safety-notes`
  - `mountain-events-have-location`
  - `chained-events-require-prerequisite`
  - `rumor-unlocks-map-marker`
  - `reward-types-valid`
- 실행 결과:
  - `cd junior-game && npm run build`: 통과
  - `cd junior-game && npm run test`: 264 passed


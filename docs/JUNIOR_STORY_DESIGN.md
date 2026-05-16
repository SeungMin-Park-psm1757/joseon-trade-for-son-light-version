# Junior Main Story Design

Last updated: 2026-05-16

## Core Story

정우는 현실 세계의 아이이고, 현실에는 동생 세연이가 있다.
정우는 낡은 장부를 만진 뒤 조선 시대로 온다.
부산 장터에서 현실 동생과 닮은 조선의 세연이를 만난다.

조선의 세연이는 가난한 상인 집안의 아이이다.
세연이는 글, 산수, 지도, 날씨, 장사를 배우고 싶어 한다.
세연이의 간절한 마음이 장부와 바람이를 깨웠고, 정우는 세연이의 꿈을 돕기 위해 장사를 시작한다.

## Main Goals

- 돈 300냥 모으기
- 세연이 배움 노트 5개 열기
- 장부 단서 3개 모으기
- 세연이 공부방 완성하기
- 현대로 돌아가는 문 열기

## Story Events

`JUNIOR_MAIN_STORY_EVENTS` contains M01-M12.
Each event has a title, short summary, dialogue sequence, and optional reward.

- M01 장부의 빛
- M02 조선의 세연이
- M03 배우고 싶은 아이
- M04 첫 장사
- M05 첫 공부 선물
- M06 산수 장부
- M07 팔도 지도
- M08 비와 별
- M09 장사 배우기
- M10 장부 단서 첫 반짝임
- M11 세연이의 공부방
- M12 돌아가는 문

## Save Fields

Story state is stored in the junior save only.
Full mode save data is not touched.

- `mainStoryStage`
- `seyeonNotebook`
- `ledgerClues`
- `storyFragments`
- `completedStoryEventIds`
- `activeStoryEventId`
- `rumorMarkers`
- `studyRoomLevel`

Legacy saves are normalized with default story fields.
Existing coins, stars, cargo, cities, events, and market state are preserved.

## UI

Story dialogue appears as a blocking sequence with speaker name, icon, short text, and a next button.
City screen auxiliary buttons open:

- 세연이 노트
- 이야기 수첩
- 소문 지도

The bottom navigation is unchanged.

## Ending Rule

Money alone does not open the ending.
The return door opens only after the story requirements are complete:

- 300 coins
- 5 notebook topics unlocked
- 3 ledger clues
- study room level 3
- M12 completed

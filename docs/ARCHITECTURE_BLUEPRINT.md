# 구현 아키텍처 청사진

## 1. 권장 폴더 구조

```text
starter/src/
├─ App.tsx
├─ main.tsx
├─ styles.css
├─ types.ts
├─ data/
│  ├─ loadGameData.ts
│  └─ index.ts
├─ game/
│  ├─ constants.ts
│  ├─ createInitialState.ts
│  ├─ reducer.ts
│  ├─ storage.ts
│  ├─ economy.ts
│  ├─ travel.ts
│  ├─ events.ts
│  ├─ combat.ts
│  ├─ fishing.ts
│  └─ quests.ts
├─ components/
│  ├─ StatusBar.tsx
│  ├─ BottomTabs.tsx
│  ├─ StartScreen.tsx
│  ├─ MapView.tsx
│  ├─ PortPanel.tsx
│  ├─ MarketView.tsx
│  ├─ CargoLedger.tsx
│  ├─ VehicleView.tsx
│  ├─ QuestView.tsx
│  └─ EventModal.tsx
└─ utils/
   ├─ format.ts
   └─ random.ts
```

## 2. 상태 관리

React `useReducer`를 권장합니다. 외부 상태관리 라이브러리는 MVP에서 필요하지 않습니다.

핵심 action 예시:

```ts
type GameAction =
  | { type: 'START_NEW_GAME' }
  | { type: 'LOAD_GAME'; payload: GameState }
  | { type: 'BUY_GOOD'; goodId: string; amount: number }
  | { type: 'SELL_GOOD'; goodId: string; amount: number }
  | { type: 'TRAVEL'; routeId: string }
  | { type: 'RESOLVE_EVENT'; choiceIndex: number }
  | { type: 'GO_FISHING' }
  | { type: 'BUY_SHIP'; shipId: string }
  | { type: 'BUY_CART'; cartId: string }
  | { type: 'COMPLETE_QUEST'; questId: string };
```

## 3. 데이터 로딩

- 앱 시작 시 `Promise.all`로 JSON을 로드합니다.
- 로드 결과는 `GameData` 객체로 묶습니다.
- `id` 기준 Map을 만들어 계산 속도를 단순화합니다.
- 데이터 검증 실패 시 시작 화면에서 오류를 보여줍니다.

## 4. 경제 계산

`economy.ts`에 가격 계산을 모읍니다.

```text
basePrice
× port production/demand modifier
× port marketBias category modifier
× monthly event modifier
× good seasonal modifier
× deterministic random monthly variance
```

같은 월에는 같은 가격표가 유지되어야 합니다. 거래할 때마다 가격이 흔들리면 아이가 규칙을 이해하기 어렵습니다.

## 5. 이동 계산

`travel.ts`에 다음을 둡니다.

- 현재 위치의 연결 루트 찾기
- 해로/육로 조건 확인
- 허가장 조건 확인
- 날짜 증가
- 이벤트 발생 후보 선택

## 6. 이벤트/전투

`events.ts`는 이벤트 선택지 효과를 상태에 반영합니다. `combat.ts`는 해적/도적 이벤트의 간단 결과를 계산합니다.

전투는 1차 MVP에서 아래 중 하나로 구현합니다.

- 자동 결과: 전력 비교 + 난수
- 선택지형: 공격/회피/수리/도주 1~3턴

## 7. 테스트 셀렉터

Playwright 검증을 쉽게 하기 위해 핵심 요소에 `data-testid`를 붙입니다.

| 요소 | data-testid |
|---|---|
| 새 게임 버튼 | `new-game-button` |
| 이어하기 버튼 | `continue-button` |
| 현재 위치 | `status-current-port` |
| 보유금 | `status-money` |
| 시장 탭 | `tab-market` |
| 지도 탭 | `tab-map` |
| 이동 버튼 | `travel-button-{routeId}` |
| 구매 버튼 | `buy-button-{goodId}` |
| 판매 버튼 | `sell-button-{goodId}` |
| 이벤트 모달 | `event-modal` |
| 자동 저장 표시 | `autosave-indicator` |

# 시스템 명세서

## 1. 게임 상태 구조

권장 상태 구조는 다음과 같다.

```ts
interface GameState {
  currentPortId: string;
  money: number;
  date: { month: number; day: number; year: number };
  shipId: string;
  cartId: string;
  cargo: Record<string, number>;
  completedQuests: string[];
  activeQuestIds: string[];
  permits: string[];
  reputation: {
    merchant: number;
    official: number;
    naval: number;
    fisher: number;
    foreign: number;
  };
  skills: {
    trade: number;
    navigation: number;
    combat: number;
    fishing: number;
  };
  crew: {
    count: number;
    morale: number;
    fatigue: number;
  };
  monthlyPrices: Record<string, Record<string, number>>;
  travelLog: LogEntry[];
}
```

## 2. 날짜와 월 변경

- 하루 단위로 진행한다.
- 한 달은 30일로 단순화한다.
- 이동, 어업, 일부 이벤트가 날짜를 소모한다.
- 월이 바뀌면 가격표를 새로 생성한다.

```text
advanceDays(n):
  day += n
  while day > 30:
    day -= 30
    month += 1
    if month > 12: month = 1, year += 1
    generateMonthlyPrices()
```

## 3. 가격 계산

권장 공식:

```text
가격 = 기본가
     × 항구 시장 편향
     × 생산/수요 보정
     × 월별 이벤트 보정
     × 상품 계절 보정
     × 랜덤 월간 변동
```

### 생산/수요 보정

- 해당 항구가 생산하는 상품: `0.75 ~ 0.95`
- 해당 항구가 수요하는 상품: `1.15 ~ 1.55`
- 일반 상품: `0.95 ~ 1.10`

### 월별 변동

- 월이 바뀔 때 한 번만 계산한다.
- 같은 달 동안 가격표는 고정한다.
- 랜덤 변동은 `game_constants.json`의 `monthlyNoiseRange`를 따른다.

## 4. 화물칸 계산

```text
해로 이동 가능 화물칸 = 현재 배 cargo
육로 이동 가능 화물칸 = 현재 수레 cargo
항구 안 보관 = MVP에서는 보관 창고 제외 또는 단순 창고만 허용
```

상품별 `weight` 또는 `volume`을 반영한다. 첫 구현에서는 `weight`만 사용해도 된다.

```text
현재 화물 사용량 = sum(goods[goodId].weight × amount)
```

### 4.1 선박 정박지와 이동 수단별 적재 한계

선박은 플레이어가 항상 들고 다니는 장비가 아니라 마지막으로 이용한 항구에 정박한다.

- `shipPortId`: 현재 배가 정박한 항구 ID
- 해로 이동 완료 시 `shipPortId`는 도착 항구로 갱신된다.
- 육로 이동 시 `shipPortId`는 바뀌지 않는다.
- 선박이 현재 항구에 없으면 해로 이동, 선박 수리, 선박 기반 행동을 제한한다.
- 항구에서는 비용과 날짜를 지불해 다른 항구에 정박한 배를 현재 항구로 부르는 간단한 서비스를 제공한다.

현재 전체 보관 가능 화물칸은 `현재 위치에 있는 배 cargo + 수레 cargo`로 계산한다.
단, 이동할 때의 한계는 경로에 따라 다르다.

```text
육로 이동 한계 = 현재 수레 cargo
해로 이동 한계 = 현재 배 cargo + min(현재 수레 cargo, 현재 배 cargo × 0.5)
```

해로 이동 설명에는 “배에 실을 수 있는 수레 짐” 한계를 함께 표시한다.
수레가 선박에 완전히 무제한으로 실리는 것으로 보이지 않게 하기 위함이다.

## 5. 이동 시스템

현재 위치와 연결된 route만 보여준다.

```text
availableRoutes = routes.filter(r => r.from === currentPortId || r.to === currentPortId)
```

루트 선택 시:

1. 이동 수단 확인
2. 허가장 확인
3. 예상 소요 일수/위험 표시
4. 이동 실행
5. 날짜 경과
6. 위험 이벤트 판정
7. 도착 처리
8. 자동 저장

## 6. 이벤트 판정

권장 공식:

```text
이벤트 확률 = baseEventChancePerTravelDay × 이동일수 + riskLevelMultiplier × route.risk
```

월별 위험 보정이 있으면 해당 hazard의 확률을 곱한다.

이벤트는 다음 우선순위로 뽑는다.

1. route.hazards와 일치하는 이벤트
2. 현재 월과 일치하는 이벤트
3. 선박/수레 상태 조건 이벤트
4. 긍정 이벤트

### 6.1 2026-05-13 루트 사건 덱과 초반 리듬

Full mode 루트는 이제 선택 필드로 `riskProfile`, `recommendedPrep`, `routeRole`, `seasonalRiskNote`, `rewardHint`, `eventDeck`, `recommendedGoods`를 가질 수 있다. 이 필드는 저장 데이터 구조를 바꾸지 않고 지도 준비표, 위험 카드, 추천 상품, 사건 선택 우선순위에만 사용한다.

이벤트 선택 순서:

```text
1. 첫 이동이면 루트 성격에 맞는 낮은 손실 사건을 우선한다.
   - 육로: 길손 상인
   - 해로: 표류선 구조
2. route.eventDeck에 적힌 사건 중 route.hazards와 맞는 사건을 우선한다.
3. 기존 hazard 기반 사건 풀에서 뽑는다.
4. 해당 루트에 맞는 사건이 없으면 순풍 같은 긍정 사건으로 fallback한다.
```

이 설계는 SWF식 "길 위에서 반드시 일이 생긴다"는 재미를 가져오되, 첫 30분에 큰 손실이 반복되지 않도록 조선식 소문/구조/검문/도적 사건으로 완화한다.

`GameEvent`는 선택 필드로 `prepCounters`, `resultChips`, `eventRole`, `recoveryOption`, `combatProfile`을 가질 수 있다. 이벤트 UI는 이 값을 읽어 대응 준비물과 결과 요약, 다음 추천 행동을 짧게 표시한다.

## 7. 조수/갯벌

MVP 조수는 단순 순환이다.

```text
하루 4구간 가정:
0: middle
1: low
2: high
3: middle
```

간단 구현에서는 날짜 기반으로 처리한다.

```text
tideIndex = day % 4
```

- 갯벌 항구 또는 갯벌 루트에서 low tide일 때 대형선 위험 증가
- draft가 큰 배는 갯벌 좌초 이벤트 가능

## 8. 어업 시스템

어업 조건:

- 현재 항구에 `fish_market`이 있거나 `terrainTags`에 `fishing_ground`가 있다.
- 하루를 소모한다.
- 어업 결과는 스킬, 배의 fishingBonus, 월별 fishingBonus에 따라 결정한다.

권장 결과:

```text
기본 보상 = fresh_fish 1~3개
성공 보상 = dried_fish 또는 seaweed 추가
희귀 보상 = skate 1개
```

어업 수익 제한:

- 하루 소모
- 신선 생선 부패
- 교역 대비 낮은 기대수익

## 9. 전투 시스템

MVP는 수치 기반으로 충분하다.

### 자동 전투 공식 예시

```text
playerPower = ship.combat + skills.combat + crew.morale + optionalCannonBonus
enemyPower = enemy.attack + enemy.morale
```

결과:

- playerPower가 높으면 승리
- 비슷하면 피해를 입고 승리 또는 도주
- 낮으면 패배

육로 전투와 해로 전투는 피해 대상을 다르게 처리한다.

- 육로 도적/산적 사건: 수레 내구도, 돈, 사기, 화물에 피해를 준다. 선박은 정박지에 있으므로 손상되지 않는다.
- 해로 해적/암초/태풍 사건: 선박 내구도, 돈, 사기, 화물에 피해를 준다.
- 이벤트 결과 화면에는 피해 대상이 배인지 수레인지 명확히 표시한다.

### 선택형 전투 행동

| 행동 | 효과 |
|---|---|
| 공격 | 적 내구 감소, 반격 위험 |
| 회피 | 다음 피해 감소, 도주 확률 증가 |
| 수리 | 목재/돈 소모, 내구 회복 |
| 도주 | 항해술 판정, 실패 시 피해 |

## 10. 패배 처리

승민님 결정에 따라 하드 손실 가능성을 반영한다. 단, 아이용 회복 루트는 반드시 둔다.

패배 시 가능한 손실:

- 돈 일부 손실
- 화물 일부 손실
- 선박/수레 내구도 큰 손상
- 드물게 선박/수레 상실

회복 장치:

- 시작 항구 구조
- 나룻배 또는 지게 기본 제공
- 어업/소형 납품 의뢰로 재기 가능

## 11. 저장 시스템

저장 키는 `game_constants.json`의 값을 사용한다.

```ts
localStorage.setItem('joseon_trade_save_v1', JSON.stringify(gameState));
```

저장 시점:

- 새 게임 시작
- 구매/판매 후
- 이동 완료 후
- 이벤트 선택 후
- 월 변경 후
- 퀘스트 완료 후

사운드 설정은 게임 저장 키와 분리된 localStorage 키를 사용한다.

```ts
localStorage.setItem('joseon_trade_audio_v1', JSON.stringify(audioSettings));
```

사운드 설정에는 BGM on/off, SFX on/off, master volume이 들어간다. 브라우저 자동재생 정책 때문에 오디오 컨텍스트는 첫 사용자 입력 이후 활성화한다.

## 12. 의뢰 Objective Resolver

의뢰 목표 표시는 `ObjectiveStatus` 형태로 한 곳에서 계산한다.

- 완료 여부: 저장된 `questProgress`, 보유 장비, 허가장을 기준으로 판단한다.
- 진행량/목표량: 구매, 판매, 방문, 납품, 수리, 사건 해결, 전투 생존, 어업 횟수를 숫자로 제공한다.
- 표시 정보: 상품 아이콘, 장비 이미지, 다음 행동 탭, 목표 항구를 함께 제공한다.
- 완료 판정은 텍스트 로그 검색에 의존하지 않는다.

지원 목표 유형:

- `buy`
- `sell`
- `visit`
- `ownCart`
- `ownShip`
- `deliver`
- `repairShip`
- `resolveEvent`
- `surviveCombat`
- `fishingCount` / `fish`
- `permit` / `ownPermit`

추천 루트는 현재 항구의 인접 루트만 계산한다. 보유 화물 기준 “지금 팔 곳”은 지도 루트를 선택하고, 현재 항구 기준 “다음에 살 것”은 시장 상품 카드를 강조한다.
## 2026-04-28 Item And Companion Stat Effects

Personal equipment and companions are not only collection UI. Their stats now feed back into early gameplay in small, readable ways:

- `navigation`: reduces effective route days, capped to avoid breaking route pacing.
- `trade`: gives a small buy discount and sell bonus, shown in the market trade popover.
- `fishing`: improves fishing yield through the existing fishing bonus calculation.
- `guard`: lowers displayed route risk and slightly lowers event chance.
- `japanese` and `chinese`: visible preparation stats for future foreign trade objectives.

The game still avoids complex combat, investment, server save, and foreign mainland expansion in this pass.

## 2026-04-29 Sale Guide, Event Support, And Tool Tiers

- Cargo sale recommendations are calculated from owned cargo and adjacent routes. The best sale route is highlighted on the map and can be selected from map or cargo UI.
- The cargo/ledger screen exposes per-good sale hint buttons. Pressing a sale hint selects the matching map route without changing the economy rules.
- Event choices use effective skills: player base skill plus companion and personal equipment bonuses. Guard/combat support is shown directly on the event choice button.
- Personal tools now have tier metadata and optional prerequisite tools. Tier 2 tools are locked until the matching basic tool is owned.
- The equipment tab prioritizes personal equipment first, then vehicle/shipyard growth, so ships and carts remain transport rather than personal gear.

## 2026-04-29 Companion Reactions And Purchase Moments

- Joined companions now provide lightweight contextual advice in facilities and event choice scenes.
- Facility advice is derived from companion strengths: trade companions help in markets, navigation/guard companions help in shipyard and routes, language/trade companions help in offices.
- Event advice is derived from event type and skill checks. Combat events favor guard support; navigation checks favor route-reading companions.
- Ship, cart, tool, and companion purchases share the equipment notice modal with detail chips and a next-action button.
- Purchase moments remain client-only UI state. Game persistence still uses the existing localStorage game state and autosave flow.

## 2026-04-29 Companion Portraits And Event Results

- Companions now support optional `portraitAsset` fields. The current assets are lightweight pixel SVG portraits under `starter/public/assets/companions/`.
- Companion cards, family helper chips, fleet advice, and companion purchase notices render the portrait asset when present.
- Event result state can include `companionReaction`, which contains the helper name, portrait, and a short result line.
- Event result reactions are selected from joined companions and remain flavor text. They do not add hidden combat logic beyond existing stat effects.
## 2026-04-29 Milestone 8 State Additions

`GameState` now includes lightweight progression fields that are normalized on load so old localStorage saves continue to work:

- `fame`: `{ merchant, exploration, guard }`
- `portTrust`: per-port trust score, raised by discovery, profitable sales, deliveries, and selected safety actions
- `discoveredIds`: discovery card IDs already awarded
- `completedLedgerSeals`: long-term ledger seal IDs already rewarded
- `discoveryNotices` and `ledgerSealNotices`: short pending result cards

The old `reputation` object is preserved for compatibility. Reward helpers map existing merchant/official/naval/fisher/foreign effects into the new 3-fame UI without changing quest IDs or localStorage keys.

New data files:

- `discoveries.json`: one or more first-visit discovery cards tied to `portId`
- `ledger_seals.json`: long-term regional ledger goals using visit, sell, fish, tool, permit, and resolveEvent-style requirements
- `asset_manifest.json`: project asset inventory for goods, scenes, NPCs, companions, vehicles, discoveries, seals, maps, and result icons
- `dialogue_flavors.json`: seed structure for moving future facility/event flavor text out of App helpers

Monthly events now support `trendGoods`, `officialDemandGoods`, and `riskTags`. These fields are display and recommendation inputs only; the monthly price generation remains simple and monthly based.

## 2026-05-03 Late-Joseon Border Trade Rules

- The base era is late Joseon. China-facing trade uses Qing-era framing, not Ming.
- Existing save/data IDs `sinuiju` and `chongjin` remain stable, but their display/worldbuilding role is `의주` and `경흥`.
- Border trade does not add mainland China or Russia as explorable regions. It adds two near-border markets:
  - `qing_yalu_market`: 책문 장시, reached from `sinuiju` with `qing_border_pass`.
  - `tumen_north_market`: 두만강 북방장, reached from `chongjin` with `tumen_trade_pass`.
- Route `mode` remains `land | sea`. Border routes are identified by `terrain: ["border_trade"]` so existing movement, cargo, event, and save logic remains compatible.
- Border routes should be high-entry goals: permit required, higher risk, long northern approach, and goods that demand larger carts or safer escort preparation.

## 2026-05-04 Responsive Runtime And Asset Rules

- The full game now has a runtime viewport gate. If the current visual viewport is phone portrait (`width <= 760` and `height > width`), the app returns the portrait orientation gate instead of the start screen or gameplay tree.
- The gate is intentionally UI-only. Data loading and localStorage compatibility remain unchanged, but gameplay input, HUD, tab content, modal trees, and tutorial pauses are not rendered while the gate is active.
- The app writes `--vvw` and `--vvh` from `window.visualViewport` when available, with `window.innerWidth/innerHeight` as fallback. CSS uses those variables plus `env(safe-area-inset-*)` for landscape sizing.
- Visual QA now treats the painted2d raster/WebP set as the source of truth for primary game art. Code-level SVG placeholders can remain only as non-primary fallbacks; primary map, facility, vehicle, goods, NPC, guide, and result surfaces should use painted2d assets.
- `starter/scripts/visual-check.mjs` now verifies portrait gate leakage, desktop port/map screenshots, mobile landscape gameplay screenshots, and `BASE_URL`-driven dev-server ports.

## 2026-05-04 Standalone Junior Game State

- `정우의 첫 장사놀이` lives in `junior-game/` as a separate Vite app.
- Full mode keeps the existing `joseon_trade_save_v1` localStorage key and `GameState` schema.
- Junior game uses a separate localStorage key: `joseon_trade_junior_save_v1`.
- Junior save data is intentionally small: `currentStep`, `selectedGoodId`, `coins`, `completedRuns`, `badges`, and `hasSeenIntro`.
- Junior rendering does not import full mode HUD, tabs, market, map, event, quest, equipment, ledger, storage, or CSS modules.
- The junior flow is fixed to six steps: arrive, pick, buy, travel, sell, success. It does not expose fame, trust, ledger, quests, route risk, price comparison, equipment, repairs, tax, permits, or complex maps.

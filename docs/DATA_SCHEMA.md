# 데이터 스키마 설명

## 1. ports.json

항구와 내륙 도시 데이터.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| id | string | 고유 ID |
| name | string | 표시 이름 |
| kind | string | port, inland_city, island_port, border_city, foreign_border_market 등 |
| tier | string | S/A/B/C 규모 |
| region | string | 경기, 전라, 경상, 제주, 일본 등 |
| map | object | 추상 지도 좌표 x/y |
| visualType | string | 지역 배경 유형: south_port, west_mudflat, inland_city 등 |
| sceneAsset | string | 항구/시설 화면 배경 이미지 경로 |
| facilities | string[] | 시장, 조선소, 어시장 등 |
| shipyardLevel | number | 0~3 |
| cartYardLevel | number | 0~3 |
| tideSensitive | boolean | 조수 영향 여부 |
| hazards | string[] | 해당 지역 위험 태그 |
| produces | string[] | 생산 상품 |
| demands | string[] | 수요 상품 |
| marketBias | object | 카테고리별 가격 보정 |
| permitRequired | string | 입항/교역 허가장 |

참고: 조선 후기 북방 장시는 저장 호환성을 위해 기존 ID를 유지할 수 있다. 예를 들어 `sinuiju`는 화면에서 의주로, `chongjin`은 화면에서 경흥으로 표시된다.

## 2. goods.json

상품 데이터.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| id | string | 상품 ID |
| name | string | 표시 이름 |
| category | string | grain, seafood, luxury 등 |
| basePrice | number | 기본 가격 |
| weight | number | 화물칸 사용량 |
| perishableDays | number | 부패 일수, 0은 부패 없음 |
| legalRisk | number | 검문 위험도 |
| seasonal | object | 월별 가격 보정 |
| tags | string[] | core_trade, rare 등 |
| iconAsset | string | 상품 아이콘 이미지 경로, 없거나 실패하면 fallback 사용 |

## 3. ships.json

선박 데이터.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| id | string | 배 ID |
| name | string | 표시 이름 |
| price | number | 구매가 |
| cargo | number | 화물칸 |
| speed | number | 속도 |
| durability | number | 내구도 |
| draft | number | 흘수, 갯벌 위험에 사용 |
| cannonSlots | number | 화포 슬롯 |
| combat | number | 기본 전투력 |
| fishingBonus | number | 어업 보정 |
| monthlyUpkeep | number | 월 유지비 |
| allowedWaters | string[] | 운항 가능 해역 |

## 4. carts.json

육상 운송수단 데이터.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| id | string | 수단 ID |
| name | string | 표시 이름 |
| price | number | 구매가 |
| cargo | number | 화물칸 |
| speed | number | 속도 |
| durability | number | 내구도 |
| terrain | string[] | 이동 가능 지형 |
| monthlyUpkeep | number | 월 유지비 |

## 5. routes.json

거점 간 이동 경로.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| id | string | 루트 ID |
| from | string | 출발 거점 ID |
| to | string | 도착 거점 ID |
| mode | string | land 또는 sea |
| days | number | 소요 일수 |
| risk | number | 1~5 위험도 |
| hazards | string[] | 이벤트 태그 |
| permitRequired | string | 필요 허가장 |
| tideSensitive | boolean | 조수 영향 여부 |

국경 장시 루트는 `mode`를 새로 만들지 않고 `land`를 유지하며, `terrain`에 `border_trade` 태그를 넣어 UI에서 보라색 국경 장시길로 표시한다.

## 6. events.json

위험/전투/정보 이벤트.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| id | string | 이벤트 ID |
| name | string | 표시 이름 |
| type | string | hazard, combat, info 등 |
| trigger | object | 발생 조건 |
| severity | number | 위험도 |
| text | string | 설명문 |
| choices | array | 선택지 목록 |

선택지 필드는 다음 중 일부를 가질 수 있다.

- label
- effects
- requires
- skillCheck
- success
- failure
- random
- startCombat

## 7. quests.json

의뢰/튜토리얼 퀘스트.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| id | string | 퀘스트 ID |
| name | string | 표시 이름 |
| chapter | number | 진행 단계 |
| giver | string | 의뢰자 |
| description | string | 설명 |
| objectives | array | 목표 목록 |
| rewards | object | 보상 |
| requires | object | 시작 조건 |

## 8. monthly_events.json

월별 경제·위험 보정.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| month | number | 1~12 |
| name | string | 월간 사건 이름 |
| summary | string | 설명 |
| priceModifiers | object | 상품별 가격 보정 |
| hazardModifiers | object | 위험별 발생 보정 |
| fishingBonus | number | 어업 보정 |

## 9. game_constants.json

게임 기본 설정과 시작 상태.

주요 필드:

- title
- version
- startingState
- calendar
- tideCycle
- economy
- risk
- combat
- save

## 10. progression.json

신분/상단 성장 단계.

## 11. map_layers.json

추상 지도에서 위험 지형 권역을 설명한다. MVP에서는 시각화 또는 툴팁에 사용한다.

## 11. game_constants.json

게임 기본 설정과 시작 상태.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| title | string | 게임 제목 |
| version | string | 데이터/앱 버전 |
| save | object | LocalStorage 저장 키 등 |
| calendar | object | 월/일 단순화 규칙 |
| tideCycle | object | 조수 주기 |
| economy | object | 경제 계산 기본값 |
| risk | object | 이벤트 발생 기본값 |
| combat | object | 간단 전투 기본값 |
| startingState | object | 새 게임 시작 상태 |

`startingState`는 하위 호환을 위해 `portId`와 `currentPortId`를 모두 가질 수 있다. 구현에서는 `currentPortId ?? portId` 순서로 읽는다.

## 12. 저장 상태 추가 필드

기존 localStorage 키는 유지하되, 저장 상태에 다음 필드를 보정한다.

| 필드 | 타입 | 설명 |
|---|---|---|
| shipPortId | string | 현재 선박이 정박한 항구 ID. 없으면 `currentPortId` 또는 시작 항구로 마이그레이션한다. |

`shipPortId`는 육로 이동 중에는 변경되지 않고, 해로 이동 완료 또는 선박 구매/호출 서비스 사용 시 현재 항구로 갱신된다.

## 13. Event Effect Optional Fields

기존 `effects.durability`는 이동 수단에 따라 다르게 적용된다.

- 해로 이동/선박 행동: 선박 내구도 변화
- 육로 이동/도적 사건: 수레 내구도 변화

명시적으로 수레만 조정해야 할 때는 선택적으로 `effects.cartDurability`를 사용할 수 있다.

## Quest Objective Optional Fields

의뢰 목표는 기존 JSON 구조를 유지하되, objective resolver가 다음 선택 필드를 해석한다.

- `good`: 구매/판매 대상 상품 ID
- `amount`: 목표 수량
- `at`: 목표 항구 ID
- `atAny`: 판매 가능 항구 ID 목록
- `ports`: 방문 목표 항구 목록
- `cart`: 보유해야 할 수레 ID
- `ship`: 보유해야 할 배 ID
- `goods`: 납품 상품 수량 맵
- `count`: 수리/사건/전투/어업 목표 횟수
- `event`: 해결해야 할 사건 ID
- `enemyTag`: 생존해야 할 전투 태그
- `permit`: 보유해야 할 허가장 ID

저장 데이터는 `questProgress`를 기준으로 누적되며, 완료 판정은 로그 문자열에 의존하지 않는다.

## 15. port_flavors.json

항구별 생활감, 시설 NPC 대사, 대표 상품, 시장 진열 순서와 위치를 데이터로 관리한다.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| id | string | `ports.json`의 항구 ID |
| title | string | 오늘의 항구 간판 제목 |
| line | string | 항구 분위기 한 줄 설명 |
| market | string | 시장 NPC 대사 |
| office | string | 관청 NPC 대사 |
| tavern | string | 술집 NPC 대사 |
| yard | string | 조선소/수레방 NPC 대사 |
| rumor | string | 지역 소문 |
| goods | string[] | 항구 간판에 우선 표시할 상품 ID |
| marketSlots | string[] | 시장 진열대에 우선 배치할 상품 ID |
| stallPositions | object | 상품별 진열 좌표 `{ x: 0~100, y: 0~100 }` |

`marketSlots`와 `stallPositions`는 기존 가격/재고 로직을 바꾸지 않고 화면 배치만 조정한다. 알 수 없는 상품 ID는 데이터 검증에서 실패한다.

## 16. tools.json

개인 장비는 배/수레와 분리한다. 배와 수레는 이동 수단이고, `tools.json`은 칼, 어업도구, 측량도구, 거래 장부, 언어 준비 도구처럼 플레이어 능력치를 조금 보강하는 장비를 다룬다.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| id | string | 장비 ID |
| name | string | 표시 이름 |
| category | string | `guard`, `fishing`, `navigation`, `trade`, `language` 계열 |
| price | number | 구매 가격 |
| stats | object | 전투, 어업, 항해, 거래, 언어 같은 소폭 보너스 |
| unlockHint | string | 장비가 왜 필요한지 알려주는 짧은 문구 |

저장 데이터는 `tools: Record<string, true>` 형태로 보유 장비를 기록한다.

## 17. companions.json

동료는 함께 항해하거나 장사를 돕는 가벼운 크루 시스템이다. 후속 중국/일본 교역을 고려해 언어 태그를 데이터에 포함한다.

주요 필드:

| 필드 | 타입 | 설명 |
|---|---|---|
| id | string | 동료 ID |
| name | string | 표시 이름 |
| role | string | 역할 이름 |
| recruitCost | number | 영입 비용. 가족 도움 인물은 0일 수 있다. |
| family | boolean | 가족 도움 인물 여부 |
| stats | object | 속도, 거래, 어업, 전투, 항해, 언어 보너스 |
| languages | string[] | `joseon`, `japanese`, `chinese` 같은 언어 태그 |
| line | string | 짧은 동료 대사 |

저장 데이터는 `companions: Record<string, true>` 형태로 영입 상태를 기록한다.

## 18. fleetName

`fleetName`은 함대/상단 이름이다. 기존 저장 데이터에는 기본값 `정우상단`을 보정해 넣고, 기존 localStorage 저장 키는 바꾸지 않는다.

# 모바일 UI 명세

## 0. 2026-04-27 가로형 기준 업데이트

- 기본 UX는 세로 모바일 앱이 아니라 가로화면 모바일 웹앱이다.
- 기준 해상도는 844 × 390, 932 × 430이다.
- 세로 화면에서는 “가로로 돌려서 플레이하세요” 안내를 표시할 수 있다.
- 기본 구조는 상단 상태바, 중앙 그림/지도 패널, 우측 행동 패널, 하단 빠른 메뉴다.
- 하단 빠른 메뉴는 항구 / 시장 / 지도 / 화물 / 의뢰 / 장비 / 장부를 기준으로 한다.
- 시장, 화물, 장부, 의뢰, 추천 루트에는 상품 아이콘이 상품명보다 먼저 인지되도록 배치한다.
- 항구 허브는 시장 / 관청 / 술집 / 조선소 NPC 시설 화면으로 이어진다.
- 전체 지도는 노드와 루트, 이동 수단 애니메이션을 SVG/CSS 기반으로 표시한다.

## 1. 기본 방향

- 모바일 웹앱 가로 화면 우선
- 기준 해상도: 844 × 390
- 작은 글자는 피하고 버튼은 손가락으로 누르기 쉽게 만든다.
- 모든 핵심 버튼은 최소 높이 44px 이상 권장
- 정보는 한 화면에 과도하게 넣지 말고 카드식으로 나눈다.

## 2. 화면 구조

### 2.1 시작 화면

구성:

- 게임 제목
- 새 게임
- 이어하기
- 간단 설명

### 2.2 지도 화면

구성:

- 상단 상태바: 위치, 돈, 날짜, 월간 사건
- 지도 영역: 항구/도시 아이콘
- 하단 탭: 지도 / 시장 / 화물 / 배·수레 / 의뢰
- 현재 위치 강조
- 이동 가능 루트만 활성화

항구 아이콘 색상 예시:

- S급: 금색 계열
- A급: 진한 파랑
- B급: 보통 파랑
- C급: 회색
- 위험/외국 항구: 보라 또는 빨강 테두리

### 2.3 항구 상세 화면

표시 정보:

- 항구 이름/등급
- 짧은 설명
- 시설 아이콘
- 생산 상품
- 수요 상품
- 위험 태그
- 가능한 행동

행동 버튼:

- 시장 보기
- 이동하기
- 어업하기
- 조선소/마방
- 의뢰 보기
- 쉬기

### 2.4 시장 화면

필수 정보:

- 상품명
- 현재 가격
- 보유 수량
- 구매 버튼
- 판매 버튼
- 수요/생산 표시
- 부패 상품 경고

권장 UI:

```text
[소금]
현재가 14냥  |  이 항구 생산품
보유 3개  |  무게 1
[- 팔기] [+ 사기]
```

### 2.5 화물/장부 화면

표시 정보:

- 현재 화물칸 사용량
- 보유 상품 목록
- 최근 거래 손익
- 부패 예정 상품
- 현재 목표 퀘스트

### 2.6 배·수레 화면

표시 정보:

- 현재 배
- 현재 수레
- 내구도
- 화물칸
- 속도
- 전투력
- 구매 가능한 목록

### 2.7 이동 선택 화면

표시 정보:

- 목적지
- 이동 방식: 육로/해로
- 소요 일수
- 위험도
- 주요 위험 태그
- 필요 허가장
- 예상 조수 위험

버튼:

- 출발
- 취소

### 2.8 이벤트 화면

구성:

- 이벤트 제목
- 설명문 2~3줄
- 선택지 버튼
- 선택 후 결과 표시

### 2.9 전투 화면

MVP 최소 구성:

- 적 이름
- 내 배/수레 상태
- 적 상태
- 행동 버튼: 공격 / 회피 / 수리 / 도주
- 결과 로그

### 2.10 의뢰/도감 화면

- 진행 중 의뢰
- 완료한 의뢰
- 발견한 도시/상품/지형

## 3. 하단 탭 권장

```text
[지도] [시장] [화물] [장비] [의뢰]
```

시장 탭은 현재 위치가 항구/도시일 때만 활성화한다.

## 4. 색상/톤

- 배경: 오래된 한지 느낌의 밝은 톤
- 위험: 붉은색/주황색 경고
- 수익: 초록색 또는 상승 화살표
- 손실: 붉은색 또는 하락 화살표
- 바다: 청색 계열
- 육로: 갈색 계열

실제 색상은 CSS 변수로 관리한다.

## 5. 한국어 문구 원칙

- 어려운 역사 용어는 툴팁을 붙인다.
- 한 문장은 짧게 유지한다.
- 아이가 읽을 수 있도록 명령형보다 설명형을 쓴다.

예시:

- “대마도에 가려면 왜관 허가장이 필요해요.”
- “간조라서 큰 배는 갯벌에 걸릴 수 있어요.”
- “이 상품은 이 도시에서 비싸게 팔 수 있어요.”

## 6. 첫 10분 가로 튜토리얼

가로 모바일 기준 첫 10분 안내는 compact horizontal panel로 표시한다.

- 단계: 면포 2개 구매 → 대구 이동 → 면포 판매 → 소금 장사 → 손수레 목표
- 각 단계는 상품/지도/장비 아이콘을 먼저 보여준다.
- 완료 단계는 밝게, 현재 단계는 강조, 이후 단계는 흐리게 표시한다.
- 현재 단계 버튼은 해당 탭으로 이동하며, 대구 이동 단계는 지도에서 대구 루트를 선택한다.

시장 추천은 상품 카드 안에서 짧은 배지로 표시한다.

- `사기 좋음`: 현재 항구에서 사서 인접 항구에 팔기 좋은 상품
- `팔 곳 있음`: 보유 화물 중 인접 항구에서 이익이 기대되는 상품
- `돈 부족` / `칸 부족`: 구매 불가 상태

## 7. 의뢰 완료 보상 모달

의뢰 완료 모달은 짧은 축하, 보상 칩, 다음 목표 카드로 구성한다.

- 보상 칩은 돈, 평판, 허가장, 기술 경험치를 아이콘과 숫자로 표시한다.
- 다음 목표 카드는 상품/지도/장비 아이콘과 한 줄 힌트를 표시한다.
- 다음 목표 카드를 누르면 관련 탭으로 이동한다.
- 844×390에서 모달이 화면 밖으로 튀어나가지 않아야 한다.

## 8. Scene-First UI Pass

기본 조작은 텍스트 표가 아니라 픽셀아트 장면 위에서 시작한다.

- 주요 메뉴는 하단 고정 탭이 아니라 상태바 아래 상단 메뉴로 둔다.
- 항구 화면은 지역 배경 위에 시장, 관청, 술집, 조선소, 출항 핫스팟을 올린다.
- 시장 화면은 상품 카드 목록이 아니라 장터 배경 위 상품 아이콘 진열대로 표시한다.
- 상품을 누르면 거래 팝업이 뜨고, 사기/팔기 버튼을 반복 클릭해 거래한다.
- 상세 수치와 추천 정보는 작은 배지와 팝업 안으로 압축한다.

## 9. 2026-04-28 항구 핫스팟과 지도 보정

항구 허브 핫스팟은 지역 배경의 실제 지형을 기준으로 배치한다.

- 시장은 장터/마을/부두 가까운 육지에 둔다.
- 관청은 언덕, 하늘, 배 위가 아니라 마을 건물 또는 관아가 있을 법한 위치에 둔다.
- 술집은 거리, 장터, 숙소 밀집 구역에 둔다.
- 조선소/수리소는 해안, 포구, 선착장 근처에 둔다.
- 내륙 도시는 조선소 대신 수레방/수리소 성격으로 표시한다.
- 출항/항로 핫스팟은 바다나 선착장 방향에 두고, 내륙 도시는 이동/길목으로 표시한다.

전체 지도는 추상 폴리곤 배경이 아니라 한국 전경을 닮은 픽셀아트 지도를 기본 배경으로 사용한다.

- 한반도 남부, 서해/남해/동해, 제주, 대마도가 한눈에 읽혀야 한다.
- 기존 포트 노드와 루트 선은 데이터 좌표를 유지하되, 픽셀 지도 위에 겹쳐 표시한다.
- 지도는 GIS 정확도보다 게임 내 이동 방향과 지역감 전달을 우선한다.

## 10. 2026-04-28 장면형 UI와 사운드 1차

우측 패널은 긴 설명 카드보다 장면 안 정보물처럼 보이도록 정리한다.

- 월간 소식은 간판형 `signboard`로 표시한다.
- 추천 루트와 장부 요약은 펼친 장부 느낌의 `ledger-popover`로 표시한다.
- NPC 안내와 사건 설명은 `speech-bubble` 형태로 표시한다.
- 지도 출발 전 정보는 여행 준비표로 압축하고, 위험/소요일/이동 수단은 아이콘 칩으로 보여준다.

시장은 장터 진열대 방식이다.

- 시장 입장 시 상품 아이콘 진열대를 먼저 보여준다.
- 상품을 누르면 해당 상품 거래 팝업이 열린다.
- 사기/팔기 버튼은 한 번 누를 때마다 1개씩 처리한다.
- 돈 부족, 화물칸 부족, 추천 매입, 판매 가능 정보는 짧은 칩으로 표시한다.

화물과 이동 준비는 슬롯으로 표현한다.

- 현재 화물은 상품 아이콘이 들어간 슬롯으로 표시한다.
- 육로는 수레 짐칸, 해로는 배 창고 중심으로 준비 상태를 보여준다.
- 적재 한계를 넘으면 “수레에 다 안 실려요.”처럼 짧은 안내를 표시한다.

이벤트는 장면 카드로 표시한다.

- 도적/해적/갯벌/태풍/검문/순풍/수리 계열은 CSS 픽셀풍 장면을 사용한다.
- 결과는 긴 문장보다 손실/획득 칩으로 압축한다.

사운드는 Web Audio API 기반 절차적 오디오를 사용한다.

- 외부 음악/효과음 파일을 포함하지 않는다.
- 첫 사용자 입력 이후 BGM과 효과음이 동작한다.
- 상단 상태바에서 BGM, SFX, 볼륨을 조절한다.
- 설정은 `joseon_trade_audio_v1` localStorage 키에 저장한다.

## 11. 2026-04-28 항구 생활감과 첫 30분 성장선

초반 핵심 항구는 같은 배경을 쓰더라도 다른 장터처럼 느껴져야 한다.

- 부산포: 왜관 길목, 면포/건어물/인삼 중심
- 대구: 내륙 큰 장, 소금/건어물/미역 수요 중심
- 전주: 한지와 곡식, 쌀/한지/부채 중심
- 목포: 서남해 갯벌, 소금/홍어/건어물 중심
- 제주: 바람 센 섬, 말/감귤/미역 중심
- 대마도: 허가가 필요한 바깥섬, 은/일본 종이/칠기 중심

항구 화면에는 `오늘의 항구` 간판을 두어 고유 설명과 대표 상품 아이콘을 보여준다. 시설 NPC 대사도 현재 항구에 맞는 문장으로 바뀐다.

첫 길잡이는 “첫 10분”에서 “첫 30분 성장길”로 확장한다.

- 면포 2개 구매
- 대구 이동
- 면포 판매
- 소금 장사
- 손수레 구매
- 어업
- 어선 준비
- 제주 준비

이벤트 선택지는 그림 버튼을 우선한다.

- 전투, 우회, 수리, 돈, 짐, 휴식, 허가 같은 선택지는 픽셀풍 아이콘을 가진 버튼으로 표시한다.
- 버튼에는 긴 설명 대신 선택명과 짧은 결과 힌트를 넣는다.

## 12. 2026-04-28 항구 데이터화/성장 지도 패스

- 항구별 말풍선과 대표 상품은 `port_flavors.json`에서 읽는다.
- 시장 진열대는 `marketSlots` 순서를 우선하고, `stallPositions`가 있으면 상품 아이콘을 장터 안의 좌표에 배치한다.
- 의뢰 탭 상단에는 첫 30분 성장길을 큰 그림 지도처럼 표시한다. 완료 단계는 초록, 다음 단계는 노란 강조, 먼 단계는 흐림 처리한다.
- 사건 결과 칩은 돈/배/수레/화물/정박 안전처럼 짧은 아이콘 언어를 함께 표시한다.
- 이 변경은 가격, 이동, 저장, 의뢰 완료 로직을 바꾸지 않고 표시 구조만 강화한다.

## 13. 2026-04-28 전체 폴리시 패스

- `port_flavors.json`은 모든 항구를 포함해야 한다.
- 시장 팝업의 기본 조작은 큰 `사기` / `팔기` 버튼 반복 클릭이다.
- 거래 피드백은 물건과 돈 변화를 한 줄 플로팅으로 보여준다.
- 성장 지도는 첫 장사 이후 손수레, 어업, 어선, 남해, 제주, 왜관 허가, 대마도까지 이어진다.
- 장비 구매와 배 호출 완료는 작은 축하 모달로 다음 행동을 안내한다.
- 월간 소식은 계절 픽셀 그림을 함께 보여준다.
- 저장은 1~3번 슬롯을 제공하되, 1번 슬롯은 기존 localStorage 키를 유지한다.

## 14. 2026-04-28 시장/핫스팟/동료 패스

- 시장 상품은 흩어진 카드보다 정렬된 진열대 우선으로 배치한다.
- 상품 팝업에는 매입 평균가, 현재 판매 손익, 가까운 추천 판매처를 짧게 표시한다.
- 시장은 좌상단/마을 입구 쪽, 술집은 시장 근처, 관청은 언덕/정자 쪽, 조선소는 물가 아래쪽에 배치한다.
- 핫스팟 아이콘은 서로 겹치지 않아야 하며, 지역별 공유 좌표를 쓰되 배경과 맞지 않는 항구는 후속으로 개별 override를 둔다.
- 의뢰 화면은 한 번에 약 3개만 노출해 다음 행동을 흐리지 않는다.
- 튜토리얼은 시간여행한 정우를 돕는 요정 말풍선 형식으로 안내한다.
- 장비 화면은 `탈것`과 `개인 장비`를 구분한다. 배/수레는 이동수단, 칼/어업도구/측량도구/거래장부/언어도구는 개인 장비다.
- 동료/가족 도움은 함대 패널에서 보여주고, 함대 이름은 짧은 입력으로 바꿀 수 있어야 한다.

## 15. 2026-04-28 사운드 재점검 패스

- 브라우저 정책 때문에 사운드는 첫 입력 이후에만 시작한다.
- 상태바에는 명시적인 `소리 시작` 버튼을 둔다.
- 소리가 준비되면 버튼은 `소리` 상태로 바뀐다.
- 시장 진입은 작은 문/종소리 계열 효과음을 낸다.
- 지도/화물/의뢰/장부 전환은 장부 넘김 계열 효과음을 낸다.
- 구매/판매/보상/출발/도착/위험/수리/배 호출/어업은 서로 다른 짧은 효과음을 사용한다.
- BGM은 항구, 시장, 지도 장면별로 다른 절차적 루프를 사용한다.
- 소리 없이도 게임 진행은 완전히 가능해야 한다.

## 16. 2026-04-28 MP3 사운드 적용 패스

- `bgm/`에 생성된 MP3 파일을 `starter/public/assets/audio/`로 복사해 실제 게임 오디오로 사용한다.
- MP3 파일 재생을 우선하고, 실패 시 기존 Web Audio 절차음으로 fallback한다.
- 항구 BGM은 공통/항구 트랙을 번갈아 사용할 수 있다.
- 시장 BGM은 시장 전용 트랙을 사용한다.
- 지도 BGM은 이동/해로 트랙을 사용한다.
- 상점 진입, 구매, 판매, 보상, 장부 넘김, 출항, 도착, 수레 이동, 위험, 도적, 해적, 수리, 어업, 동료 영입 효과음을 파일로 구분한다.
- 긴 생성형 효과음은 UI 반응을 해치지 않도록 짧은 시간만 재생한다.
## 2026-04-28 Korea Map, Market Popover, And Audio Runtime

- The map screen uses `starter/public/assets/maps/korea-route-map.png` as a raster pixel-art Korea overview.
- Map node labels use modern Korean city names such as `서울`, `부산`, `대구`, and `제주`; data IDs and historical port names remain unchanged.
- Market goods are sorted with buy recommendations, local specialties, cheap goods, and sale opportunities first.
- The market trade popover shows buy price, sell price, owned quantity, average purchase price, and the nearest recommended sale destination.
- Ship/cart images and equipment shop thumbnails must use `object-fit: contain` so vehicles are not clipped inside their cards.
- Runtime audio files use descriptive scene/SFX names and compressed web-sized MP3 files from `starter/public/assets/audio/`.

## 2026-04-29 Sale Guide And Equipment UI

- Map view highlights the best current cargo sale destination with a floating good icon, destination name, and expected profit.
- Map side panel includes a compact "지금 팔 곳" list. Tapping a recommendation selects the matching route preview.
- Cargo/ledger view puts owned cargo sale hints before the cargo slot ledger so the player immediately sees where to sell.
- Event choice buttons may show support text such as guard value, skill check progress, missing permit, or required cargo.
- Equipment view now opens with personal tools first: guard, fishing, navigation, trade, and language tool paths. Ship/cart growth remains visible as transport growth.

## 2026-04-29 Companion And Purchase Moment UI

- Facility panels may show a compact companion advice strip after the local NPC line.
- Event modals may show a companion advice strip above the choice buttons when a joined companion can plausibly help.
- Tool, ship, cart, and companion purchases use a shared modal with a large icon/avatar, detail chips, and one next-action button.
- The fleet panel shows a compact current companion advice strip so the player can feel that a joined companion is traveling with the fleet.
- These strips should stay short, icon-first, and readable at 844x390 without creating a new dialogue system.

## 2026-04-29 Companion Portrait And Event Result UI

- Companion avatars should use individual portrait assets when `portraitAsset` exists.
- Pixel portraits are small, crisp, and readable inside 38px to 54px avatar frames.
- Event result modals may show one companion result strip with portrait, name, and a short line explaining how that companion helped.
- Companion result strips are flavor-forward and should not crowd out the main event result chips.
## 2026-04-29 Milestone 8 UI Notes

Landscape remains the primary target: `844x390` and `932x430`. Portrait may show the rotate notice.

New compact UI elements:

- Fame chips in the top status bar: `상인 신용`, `탐방 명성`, `호위 명성`
- Port trust chip in the port flavor panel
- First-visit discovery modal with image, reward chips, and one next hint
- `팔도 탐방 도감` and `상단 장부 조각` sections inside the ledger/cargo tab
- Monthly news chips for trend goods, official demand goods, and risks
- Route danger chips in route preview
- Equipment screen `새로 유리해진 길` panel after growth purchases

The milestone keeps the scene-first direction: long paragraphs are avoided, while reputation, discovery, trust, trend, demand, danger, and seal progress are shown as icon-like chips or small cards. Any future additions should preserve no-horizontal-scroll behavior at the target landscape widths.

## 2026-04-29 Scene-First UI Pass 1

Primary focus screens: port main, map/travel, and market.

- Port main now treats the harbor background as the primary surface. Facility buttons are staged as hotspots over the scene, while strong CTA buttons for market, departure, quests, and fishing sit inside the hero scene.
- Map/travel now includes an inline SVG Korea overview layer instead of relying on an abstract polygon-feeling image. The layer includes west/south/east sea labels, a stylized peninsula, Jeju, Tsushima, mountain/river hints, route lines, reachable nodes, current position, and ship berth marker.
- Market now behaves like a market scene: goods sit on a stall shelf over the port background, and selecting a good opens a large trade overlay with buy/sell prices, owned quantity, average cost, price label, route hint, and large buy/sell command buttons.
- Common visual direction moved toward dark ink/navy scene panels, brass outlines, teal/gold CTAs, and hanji/wood detail panels.
- Capture targets for this pass are stored in `.logs/scene-first-ui-pass-1/`.
## 2026-04-29 Scene-First UI Pass 2

- Quest screen reads as a progression route: current main objective, first-30-minute growth path, three active/completed quest cards, and locked next quests.
- Equipment screen prioritizes growth motivation: current ship/cart, stat chips, next recommended upgrade, and newly useful routes before long purchase lists.
- Ledger/codex screen is an achievement board: visited ports, traded goods, completed quests, total profit, met people, discovery progress, and ledger seal progress.
- Quest, equipment, and ledger screens reuse the pass-1 visual language: compact HUD, floating tabs, dark translucent panels, brass borders, teal primary CTA, and icon-first cards.
- Each screen should connect back to the core loop with clear market/map/equipment/quest action buttons.

## 2026-05-03 조선 후기 지도/국경 장시 표시

- 지도 표기는 조선 후기 세계관을 우선한다. 한양, 부산포, 제포, 의주, 경흥처럼 시대감이 드러나는 표시명을 사용한다.
- 압록강과 두만강은 엷은 점선 강줄기와 작은 라벨로 표시한다.
- 국경 장시 루트는 일반 땅길/바닷길과 구분되는 보라색 점선으로 표시한다.
- 국경 장시 노드는 항구나 내륙 도시와 다른 마름모형 표시를 사용한다.
- 국경 장시 이동 버튼이 잠겨 있으면 “청 교역 허가” 또는 “두만강 통행 허가”처럼 구체적인 이유를 보여준다.

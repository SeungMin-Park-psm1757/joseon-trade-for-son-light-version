# 인수 검수 체크리스트

## 1. 실행

- [ ] `npm install`이 성공한다.
- [ ] `npm run dev`로 로컬 실행이 가능하다.
- [ ] `npm run build`가 성공한다.
- [ ] 브라우저 콘솔에 치명적 오류가 없다.

## 2. 시작/저장

- [ ] 새 게임을 시작할 수 있다.
- [ ] 부산포에서 시작한다.
- [ ] 시작 돈은 `game_constants.json` 기준으로 설정된다.
- [ ] 거래 후 새로고침해도 저장이 유지된다.
- [ ] 이어하기가 작동한다.
- [ ] 새 게임 재시작 기능이 있다.

## 3. 지도/이동

- [ ] 현재 위치가 지도에서 강조된다.
- [ ] 현재 위치와 연결된 루트만 이동 가능하다.
- [ ] 육로/해로 구분이 표시된다.
- [ ] 전체 지도 배경이 한국 전경 기반 픽셀아트로 보인다.
- [ ] 이동 전 소요 일수와 위험도가 표시된다.
- [ ] 전체 지도에서 항구/도시 노드와 루트 선이 보인다.
- [ ] 이동 시 배 또는 수레 아이콘이 출발지에서 도착지 방향으로 움직인다.
- [ ] 이동하면 날짜가 증가한다.
- [ ] 대마도는 허가장 없이는 진입이 제한된다.
- [ ] 선박이 다른 항구에 정박해 있으면 해로 이동이 막히고 배 호출 안내가 나온다.
- [ ] 육로 이동은 수레 적재 한계를 넘으면 출발할 수 없다.
- [ ] 해로 이동은 배 적재량과 배에 실을 수 있는 수레 짐 한계를 함께 반영한다.

## 4. 시장/교역

- [ ] 현재 항구의 상품 가격이 표시된다.
- [ ] 상품을 구매할 수 있다.
- [ ] 상품을 판매할 수 있다.
- [ ] 시장은 상품 진열대 중심으로 보이고 상품 클릭 후 거래 팝업이 열린다.
- [ ] 사기/팔기 버튼은 반복 클릭 시 1개씩 거래된다.
- [ ] 모든 상품은 시장에서 아이콘 또는 fallback 아이콘으로 표시된다.
- [ ] 화물/장부/의뢰/추천 루트에서도 상품 아이콘을 확인할 수 있다.
- [ ] 돈이 부족하면 구매가 막힌다.
- [ ] 화물칸이 부족하면 구매가 막힌다.
- [ ] 생산 상품과 수요 상품이 가격에 반영된다.
- [ ] 거래 후 돈과 화물 수량이 정확히 변한다.

## 5. 월별 경제

- [ ] 월이 바뀌면 가격표가 갱신된다.
- [ ] 같은 달에는 가격이 불필요하게 계속 바뀌지 않는다.
- [ ] `monthly_events.json`의 월별 보정이 반영된다.
- [ ] 월간 사건 이름이 UI에 표시된다.

## 6. 이벤트

- [ ] 이동 중 이벤트가 발생할 수 있다.
- [ ] 이벤트 선택지가 표시된다.
- [ ] 선택 결과가 게임 상태에 반영된다.
- [ ] 주요 이벤트는 픽셀풍 장면 카드로 표시된다.
- [ ] 이벤트 결과는 손실/획득 칩으로 이해할 수 있다.
- [ ] 갯벌/암초/태풍/도적/해적/검문/순풍 중 최소 5개가 작동한다.
- [ ] 육로 도적/산적 사건은 수레 내구도를 손상시키고 선박은 정박지에 있어 손상되지 않았다고 표시한다.
- [ ] 해로 위험 사건은 선박 내구도 손상을 선박 피해로 표시한다.
- [ ] 이벤트 후 자동 저장된다.

## 7. 전투

- [ ] 해적 또는 도적 이벤트에서 전투가 발생한다.
- [ ] 전투 결과가 돈, 화물, 내구도, 사기에 영향을 준다.
- [ ] 패배해도 게임을 계속할 수 있다.

## 8. 어업

- [ ] 어업 가능한 항구에서 어업 버튼이 보인다.
- [ ] 어업은 하루를 소모한다.
- [ ] 어업 보상으로 해산물 상품이 들어온다.
- [ ] 어업 수익은 교역보다 낮다.

## 9. 장비

- [ ] 배 목록을 볼 수 있다.
- [ ] 돈이 충분하면 배를 살 수 있다.
- [ ] 수레 목록을 볼 수 있다.
- [ ] 돈이 충분하면 수레를 살 수 있다.
- [ ] 배/수레 화물칸이 실제 거래 제한에 반영된다.
- [ ] 현재 배/수레와 다음 추천 장비가 그림으로 구분된다.
- [ ] 제주 준비와 대마도 허가 목표가 성장 카드로 보인다.

## 10. 퀘스트

- [ ] 튜토리얼 퀘스트가 표시된다.
- [ ] 목표 달성 시 보상을 받을 수 있다.
- [ ] 완료 퀘스트가 저장된다.

## 11. 모바일 UI

- [ ] 844 × 390에서 가로 스크롤이 생기지 않는다.
- [ ] 932 × 430에서 가로 스크롤이 생기지 않는다.
- [ ] 세로 화면에서는 가로 플레이 안내가 보인다.
- [ ] 주요 버튼이 손가락으로 누르기 쉽다.
- [ ] 상단 상태바에서 돈/날짜/위치를 확인할 수 있다.
- [ ] 하단 탭이 조작 가능하다.
- [ ] 이벤트 모달이 화면 밖으로 넘치지 않는다.
- [ ] 항구 허브의 시장/관청/술집/조선소가 NPC 시설 화면처럼 보인다.
- [ ] 항구 허브 핫스팟이 하늘이나 배 위가 아니라 지역 배경의 건물/길/부두 위치에 자연스럽게 놓인다.
- [ ] 우측 정보가 긴 텍스트 카드보다 간판/말풍선/장부형 UI에 가깝다.
- [ ] 출발 준비표에서 수레/배 적재 상태를 슬롯으로 확인할 수 있다.
- [ ] 상단 상태바에서 BGM/SFX/볼륨을 조절할 수 있다.
- [ ] 새로고침 후 사운드 설정이 유지된다.
- [ ] 부산포, 대구, 목포, 제주, 대마도는 대표 상품과 항구 소개가 다르게 보인다.
- [ ] 첫 길잡이는 첫 장사 이후 손수레, 어업, 어선, 제주 준비까지 그림 단계로 이어진다.
- [ ] 이벤트 선택지는 그림 아이콘이 있는 버튼으로 표시된다.

## 12. 데이터 수정성

- [ ] `ports.json`의 항구 이름을 바꾸면 UI에 반영된다.
- [ ] `goods.json`의 가격을 바꾸면 시장 가격에 반영된다.
- [ ] `routes.json`의 위험도를 바꾸면 이동 위험 표시가 바뀐다.
- [ ] 코드 내부에 대량의 항구/상품 하드코딩이 없다.
## 초반 10분 플레이 2차 패스

- [ ] 핵심 상품 12종 아이콘이 844×390 시장 카드에서 구분된다.
- [ ] 의뢰 목표가 아이콘 단계형으로 표시된다.
- [ ] 면포 2개 구매 후 튜토리얼 대구 이동 버튼이 대구 루트를 선택한다.
- [ ] 대구 도착 후 면포 판매로 첫 장사 의뢰 완료 모달이 뜬다.
- [ ] 추천 매입 상품이 시장 카드에서 `사기 좋음`으로 강조된다.
- [ ] 추천 판매 카드를 누르면 지도 루트가 선택된다.
- [ ] 844×390과 932×430에서 가로 스크롤이 없다.
- [ ] 390×844에서 가로 플레이 안내가 표시된다.

## Port Flavor Growth Result Pass

- [ ] `port_flavors.json`의 항구별 문장, 대표 상품, 시장 진열 순서가 UI에 반영된다.
- [ ] 부산포/대구 시장 상품이 표가 아니라 장터 좌표 위 아이콘으로 배치된다.
- [ ] 의뢰 탭 상단에 첫 30분 성장길 그림 지도가 보인다.
- [ ] 사건 결과 칩에 돈/배/수레/화물/정박 안전 아이콘이 함께 표시된다.
- [ ] 844×390과 932×430에서 해당 화면에 가로 스크롤이 없다.

## Full Polish Roadmap Pass

- [ ] `port_flavors.json`에 18개 항구가 모두 있다.
- [ ] 시장 거래 팝업은 큰 사기/팔기 버튼 2개 중심이다.
- [ ] 거래 후 물건과 돈 변화 플로팅이 보인다.
- [ ] 의뢰 성장 지도에 제주 도착, 왜관 허가, 대마도 단계가 보인다.
- [ ] 장비 구매와 배 호출 완료 시 축하 모달이 뜬다.
- [ ] 지도에서 배 정박 위치가 표시된다.
- [ ] 화물/장부 화면에서 항구/상품/NPC 도감 요약을 볼 수 있다.
- [ ] 시작 화면에서 1~3번 저장 슬롯을 고를 수 있다.
- [ ] 월간 소식 카드에 계절 그림이 표시된다.
- [ ] `npm run test:visual`이 핵심 화면 스크린샷과 가로 스크롤을 확인한다.

## Market Hotspot Tools Companion Pass

- [ ] 시장 상품이 844×390에서 정렬된 진열대처럼 보이고 아이콘이 겹치지 않는다.
- [ ] 상품 팝업에서 평균 매입가와 현재 판매 손익을 볼 수 있다.
- [ ] 보유 상품의 가까운 추천 판매처가 표시된다.
- [ ] 항구 핫스팟은 시장/술집/관청/조선소 위치가 배경과 어긋나지 않는다.
- [ ] 의뢰 화면에는 핵심 의뢰 약 3개만 우선 노출된다.
- [ ] 튜토리얼 안내자는 시간여행한 정우를 안내하는 요정 형식으로 보인다.
- [ ] 장비 화면에서 배/수레와 개인 장비가 구분된다.
- [ ] 개인 장비 구매 상태가 저장된다.
- [ ] 동료/가족 도움 패널이 보이고 함대 이름을 바꿀 수 있다.
- [ ] 함대 이름, 동료, 개인 장비가 새로고침 후 유지된다.
- [ ] 지도 전경은 폴리곤 느낌보다 픽셀아트 지도처럼 보인다.

## Audio Recheck Pass

- [ ] `소리 시작` 버튼을 누르면 AudioContext가 `running` 상태가 된다.
- [ ] 배경음악은 항구/시장/지도 장면에서 서로 다른 루프로 재생된다.
- [ ] 시장 탭 진입 시 문/종소리 계열 효과음이 난다.
- [ ] 구매, 판매, 보상, 출발, 도착, 위험, 수리, 배 호출, 어업 효과음이 서로 구분된다.
- [ ] 음악/SFX 토글과 볼륨 설정이 localStorage에 저장된다.
- [ ] 사운드가 꺼져 있어도 게임 진행이 막히지 않는다.
- [ ] `npm run test:smoke`가 오디오 unlock, 장면 전환, SFX, BGM tick을 검증한다.

## MP3 Audio Asset Integration

- [ ] `starter/public/assets/audio/`에 21개 MP3 파일이 안정적인 이름으로 들어 있다.
- [ ] 시장 화면에서는 `03_market_bgm.mp3`가 BGM으로 선택된다.
- [ ] 시장 진입 시 `08_shop_door_bell.mp3` 효과음이 선택된다.
- [ ] 구매/판매/보상/장부/출항/도착/수레/도적/해적/수리/어업/동료 효과음이 서로 다른 파일로 매핑된다.
- [ ] MP3 재생 실패 시 Web Audio fallback으로 게임이 계속 진행된다.
- [ ] `npm run test:smoke`가 file-backed audio source를 검증한다.
## Korea Map / Audio / Item Stat Polish

- [ ] `starter/public/assets/audio/` has descriptive MP3 file names for BGM and SFX.
- [ ] Runtime BGM files are under 1 MB each.
- [ ] Market entry plays `sfx-shop-door-bell.mp3` after audio unlock.
- [ ] Market BGM uses `bgm-market-valley-day.mp3`.
- [ ] The map background is a pixel-art Korea overview, not an abstract polygon map.
- [ ] Map node labels use modern Korean city names such as 서울, 부산, 대구, 제주.
- [ ] Market goods are sorted so likely buys and local specialties appear first.
- [ ] The trade popover shows buy price, sell price, and average purchase price when selling.
- [ ] Ship/cart thumbnails use contain-fit and are not clipped.
- [ ] Equipment and companion stats affect gameplay: navigation, trade, fishing, and guard each have a visible or mechanical effect.

## Sale Guide / Companion / Equipment Pass

- [ ] Buying an early good such as cotton cloth creates a visible map sale guide.
- [ ] The map sale guide highlights the route, destination, good icon, and expected profit.
- [ ] The cargo tab shows owned cargo first and provides a tappable sale destination button.
- [ ] Pressing a cargo sale hint opens the map with the matching route selected.
- [ ] Event choice buttons show companion/tool support such as guard, skill progress, or missing requirements.
- [ ] Personal equipment appears before ship/cart transport on the equipment tab.
- [ ] Tier 2 tools are locked until their prerequisite basic tool is owned.
- [ ] `npm run test:smoke` verifies sale guide, cargo hint, personal kit path, audio, and first-trade completion.

## Companion Reaction / Purchase Moment Pass

- [ ] Buying a personal tool opens a purchase notice with stat detail chips.
- [ ] Recruiting a companion opens a join notice with role and stat detail chips.
- [ ] A joined companion appears as a current advice strip in the fleet panel.
- [ ] Facility panels can show joined-companion advice.
- [ ] Event modals can show joined-companion advice before the choice buttons.
- [ ] Combat event choices still show guard/support hints.
- [ ] Purchase notices offer a next-action button that navigates to map, market, port, or vehicles as appropriate.
- [ ] 844x390 and 932x430 screenshots do not show horizontal scroll or clipped modal controls.

## Companion Portrait / Event Result Pass

- [ ] Every companion has a `portraitAsset` pointing to a local pixel portrait.
- [ ] Companion cards render portrait images instead of only letter badges.
- [ ] Companion recruit notice shows the matching portrait.
- [ ] Event result modal shows a companion result strip after resolving a supported event.
- [ ] Event result strip includes portrait, companion name, and a companion-specific line.
- [ ] Smoke test verifies companion avatar image and event companion result visibility.
## 2026-04-29 Milestone 8 Acceptance Additions

- [ ] New game shows the first 부산포 discovery card once.
- [ ] Existing saves load with default `fame`, `portTrust`, `discoveredIds`, and `completedLedgerSeals`.
- [ ] Top status bar shows `상인 신용`, `탐방 명성`, and `호위 명성`.
- [ ] First visit to a new port awards a discovery card, exploration fame, and port trust without repeat rewards.
- [ ] Ledger/cargo tab shows `팔도 탐방 도감`.
- [ ] Ledger/cargo tab shows `상단 장부 조각` progress.
- [ ] Monthly news shows trend goods, official demand goods, and risk tags when present.
- [ ] Market goods can show trend/official demand chips without overlapping the click-trade UI.
- [ ] Route preview shows danger chips and still allows normal travel.
- [ ] Equipment screen shows newly favorable route hints after growth purchases.
- [ ] Profitable sale can raise merchant fame and current-port trust without breaking trade logs.
- [ ] Event resolution can raise guard fame and show result chips.
- [ ] `npm run validate:data`, `npm run audit:consistency`, `npm run build`, `npm run test:smoke`, and `npm run test:visual` pass.

## 2026-04-29 Scene-First UI Pass 1

- [ ] Port main uses the harbor background as the dominant first-read visual.
- [ ] Port facilities appear as scene hotspots rather than a card dashboard.
- [ ] Port hero has visible primary CTAs for market and departure.
- [ ] Map screen shows a Korea-style peninsula silhouette, not an abstract island/polygon field.
- [ ] Jeju and Tsushima are visible in plausible relative positions.
- [ ] Land and sea routes are visually distinct.
- [ ] 압록강과 두만강이 지도에서 엷은 점선/라벨로 보인다.
- [ ] 의주/경흥 및 책문 장시/두만강 북방장이 조선 후기 국경 교역 구조로 보인다.
- [ ] 국경 장시 루트는 일반 땅길/바닷길과 다른 색/점선으로 표시된다.
- [ ] 청 교역 허가와 두만강 통행 허가가 없으면 국경 장시 이동이 막히고 이유가 표시된다.
- [ ] Map nodes can be clicked to select reachable routes.
- [ ] Market uses a stall shelf over the port scene.
- [ ] Product icons are larger than product text in the market first read.
- [ ] Product click opens a large buy/sell overlay with average buy price and current profit context.
- [ ] `1365x768`, `1920x1080`, `844x390`, and `932x430` screenshots have no horizontal scroll.

## 2026-04-29 Scene-First UI Pass 2

- [ ] Quest screen shows a current main objective, progress icons, and a direct next-action CTA.
- [ ] Quest screen uses the first 30-minute growth route as the primary visual, not a long text list.
- [ ] Quest cards show giver icon, objective icons, reward chips, and a short action button.
- [ ] Equipment screen shows current ship/cart, current stat chips, next recommended growth, and newly useful routes before long purchase lists.
- [ ] Equipment purchase modal still opens after buying a tool, ship, cart, or companion.
- [ ] Ledger/codex screen shows achievement summary chips for visited ports, traded goods, completed quests, total profit, and met people.
- [ ] Ledger/codex screen shows discovery progress and ledger seal progress as achievement cards.
- [ ] Cargo sale hints still select the matching map route.
- [ ] `1365x768`, `1920x1080`, `844x390`, and `932x430` screenshots for quest/equipment/ledger have no horizontal scroll.

## 2026-05-04 Mobile Portrait And Art QA Acceptance

- [x] `390x844` portrait shows only the orientation gate, not HUD/tabs/content/modal UI.
- [x] `412x915` portrait shows only the orientation gate, not gameplay UI.
- [x] Orientation gate includes a rotate icon, the required Korean guidance sentence, and one large `계속` button.
- [x] `844x390`, `932x430`, and `1024x600` landscape screenshots have no horizontal scroll.
- [x] Landscape HUD stays compact and does not collapse into vertical text columns.
- [x] Bottom tabs remain scrollable/fixed-height and do not wrap.
- [x] Map board and right route panel do not overlap in mobile landscape.
- [x] Port scene and side panel do not overlap in mobile landscape.
- [x] Market goods use larger painted icons and consistent object-fit behavior.
- [x] Inline polygon Korea map is removed from primary gameplay and replaced by the painted route map asset.
- [x] Travel animation token no longer uses crude inline SVG for ship/cart.
- [x] Hub/facility icons use the painted PNG versions instead of the tiny SVG versions.
- [x] `result-plain` placeholder is no longer selected for primary result icon display.
- [x] Visual screenshots are saved under `.logs/visual-mobile-portrait-art-2026-05-04/`.
- [x] `npm run validate:data`, `npm run audit:consistency`, `npm run build`, `npm run test:smoke`, and `npm run test:visual` were run for this pass.

## 2026-05-04 Junior Light Mode Acceptance

- [x] `junior-game/`이 `starter/`와 별도로 존재하고 독립 실행된다.
- [x] `starter/src/App.tsx`는 junior 구현을 직접 import하지 않는다.
- [x] Junior game은 full mode HUD, 하단 탭, 가격표, 지도 패널을 렌더링하지 않는다.
- [x] Junior mode 도입에서 요정이 “정우야, 여긴 조선이야!”라고 안내한다.
- [x] 상품 고르기 화면에는 면포, 건어물, 소금 3개 큰 카드만 보인다.
- [x] 선택한 상품이 짐에 실리는 화면과 `출발!` 버튼이 보인다.
- [x] 이동 화면에서 `부산포 → 대구`와 수레 이동 연출이 보인다.
- [x] 도착 후 `팔기` 버튼으로 성공 화면에 진입한다.
- [x] 성공 화면에서 돈 증가, 반짝임, `첫 장사 성공` 배지가 보인다.
- [x] `또 하기`는 junior 루프를 다시 시작한다.
- [x] `큰 모험 보기`는 full mode 링크 또는 안내로 연결된다.
- [x] 새로고침 후 `joseon_trade_junior_save_v1` 저장이 유지된다.
- [x] `390x844` portrait에서 회전 안내 없이 바로 플레이된다.
- [x] `844x390` landscape에서도 화면이 깨지지 않는다.

## 2026-05-13 Full Mode SWF-Inspired Implementation Acceptance

- [x] Junior Light Mode는 수정 대상에서 제외하고 full mode `starter/`만 개정한다.
- [x] 부산포 첫 루프가 시장 구매, 지도 선택, 이동 사건, 도착 판매, 첫 의뢰 완료, 손수레 목표로 이어진다.
- [x] 시장 팝업에 산 값, 파는 값, 평균가, 가격 이유, 추천 판매처, 즉시 되팔기 손익이 표시된다.
- [x] 지역 특산품, 수요품, 월별 유행품이 시장 간판과 상품 칩으로 보인다.
- [x] 지도 루트 선택 시 육로/해로, 위험 프로필, 소요일, 추천 준비물, 추천 상품, 보상 힌트가 보인다.
- [x] 도적, 해적, 태풍, 갯벌, 암초, 검문, 길손 상인, 표류선 구조 사건 데이터가 full mode 이벤트 흐름에 연결된다.
- [x] 첫 이동에서는 과도한 손실 없이 이동 중 사건을 경험할 수 있다.
- [x] 이벤트 선택지는 대응 준비물과 결과 힌트를 표시하고, 결과 모달은 다음 추천 행동을 표시한다.
- [x] 배/수레 구매 목록은 가격, 부족 금액, 새로 유리해지는 길을 보여준다.
- [x] 손수레, 어선, 연안 상선 목표가 장기 루프와 남해/제주/대마도 준비로 이어진다.
- [x] 장부 화면에서 최근 거래, 발견, 장부 조각 진행도와 다음 목표를 확인할 수 있다.
- [x] 사건/발견/의뢰/장비 모달은 겹쳐서 입력을 가로막지 않고 순차적으로 표시된다.
- [x] `npm run validate:data`, `npm run audit:consistency`, `npm run build`, `npm run test:smoke`, `npm run test:visual`이 통과한다.

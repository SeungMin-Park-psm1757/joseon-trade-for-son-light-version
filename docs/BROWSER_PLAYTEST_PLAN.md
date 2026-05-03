# 브라우저 플레이테스트 계획

## 1. 목적

Codex가 구현한 앱이 실제 모바일 브라우저 환경에서 “게임처럼” 작동하는지 검증합니다. 단순 빌드 성공이 아니라, 교역 루프와 조작감을 확인하는 것이 목적입니다.

## 2. 권장 viewport

| 이름 | 크기 | 목적 |
|---|---:|---|
| Landscape Standard | 844 × 390 | 기본 기준 |
| Landscape Large | 932 × 430 | 큰 스마트폰 가로 |
| Tablet Small | 1024 × 576 | 여유 폭 확인 |
| Desktop Wide | 1280 × 720 | 브라우저 배치 확인 |
| Portrait Fallback | 390 × 844 | 가로 안내/심한 깨짐 여부 확인 |

## 3. 필수 플레이 경로

```text
새 게임 시작
→ 부산포 상태 확인
→ 항구 허브에서 시장/관청/술집/조선소 NPC 시설 확인
→ 시장에서 상품 아이콘을 보고 면포 2개 또는 건어물 2개 구매
→ 화물 화면에서 상품 아이콘 확인
→ 전체 지도에서 대구/통영/여수 중 연결 루트 선택
→ 이동 전 위험·소요일 확인
→ 이동 실행 및 배/수레 이동 연출 확인
→ 이벤트가 있으면 선택지 처리
→ 도착지 시장에서 판매
→ 돈 증가 또는 손익 로그와 장부 아이콘 확인
→ 장비 화면에서 현재/다음 배·수레 목표 확인
→ 새로고침
→ 이어하기로 동일 상태 복구 확인
```

## 4. 위험 이벤트 확인 경로

- 서해/목포/강화 근처: 갯벌, 검문
- 남해/통영/여수/제주 근처: 태풍, 암초, 해적
- 내륙/산길: 도적, 호랑이대

이벤트는 확률이므로 테스트 편의를 위해 개발 모드에서 “이벤트 강제 발생” 버튼을 임시 제공해도 됩니다. 단, 실제 MVP 플레이에서는 숨기거나 개발 패널로 분리합니다.

## 5. 모바일 UX 체크

- 손가락으로 누르기 어려운 작은 버튼이 없는가?
- 시장에서 실수로 과도 구매하기 어렵게 되어 있는가?
- 이벤트 선택지가 화면 밖으로 나가지 않는가?
- 하단 탭이 iOS safe-area에 가리지 않는가?
- 지도와 카드 스크롤이 충돌하지 않는가?
- 돈/날짜/위치가 항상 확인 가능한가?
- 844 × 390과 932 × 430에서 가로 스크롤이 없는가?
- 세로 화면에서는 가로 플레이 안내가 보이는가?
- 상품과 시설을 텍스트보다 그림으로 먼저 파악할 수 있는가?

## 6. 플레이테스트 로그 양식

```text
날짜:
빌드/커밋:
viewport:

성공한 흐름:
- 

발견한 문제:
- 

UI 불편:
- 

밸런스 느낌:
- 

다음 수정 제안:
- 
```
## 2026-04-28 Landscape Tutorial Route Pass

추가 확인 항목:

- 844×390에서 첫 10분 튜토리얼 패널이 보인다.
- 면포 2개 구매 후 튜토리얼의 대구 이동 버튼이 지도에서 대구 루트를 선택한다.
- 추천 매입/판매 카드를 누르면 시장 상품 강조 또는 지도 루트 선택으로 이어진다.
- 의뢰 탭에서 목표가 아이콘 단계형으로 보인다.
- 390×844 세로 화면에서는 가로 플레이 안내가 보인다.

## 2026-04-28 Diegetic UI Audio Pass

추가 확인 항목:

- 항구 우측 정보가 간판/말풍선/장부형으로 보인다.
- 시장은 상품 진열대가 먼저 보이고, 상품 클릭 후 거래 팝업이 열린다.
- 사기/팔기 버튼을 반복 클릭하면 1개씩 거래된다.
- 지도 출발 준비표에서 수레/배 적재 슬롯이 보인다.
- 배가 다른 항구에 있을 때 사공/NPC 형태의 배 호출 안내가 보인다.
- 이벤트가 장면 카드와 결과 칩으로 표시된다.
- 첫 클릭 이후 BGM/SFX가 동작하고, 상단 상태바에서 끄거나 볼륨을 조절할 수 있다.
- 새로고침 후 사운드 설정이 유지된다.

## 2026-04-28 Port Growth Event Pass

추가 확인 항목:

- 부산포, 대구, 목포, 제주, 대마도에서 `오늘의 항구` 간판 내용과 대표 상품이 다르게 보인다.
- 첫 길잡이가 면포, 대구, 판매, 소금, 손수레, 어업, 어선, 제주 준비 순서로 이어진다.
- 이벤트 선택지가 텍스트 버튼만이 아니라 그림 아이콘이 있는 선택 버튼으로 표시된다.
- 844×390에서 첫 30분 길잡이가 상단 영역을 과도하게 밀어내지 않는다.
- 932×430에서 항구 생활감 패널과 시설 패널이 겹치지 않는다.

## 2026-04-28 Port Flavor Growth Result Pass

추가 확인 항목:

- 부산포와 대구 시장에서 상품 아이콘이 장터 진열 좌표에 맞춰 흩어져 보인다.
- 의뢰 탭에서 첫 30분 성장길이 큰 그림 지도형 패널로 보인다.
- 도적/이동 사건 결과 칩에 돈, 수레, 화물, 정박 안전 아이콘이 함께 표시된다.
- 844×390과 932×430에서 성장 지도와 시장 진열대가 가로 스크롤 없이 보인다.
- `port_flavors.json`의 상품 ID가 잘못되면 데이터 검증에서 실패한다.

## 2026-04-28 Full Polish Roadmap Pass

추가 확인 항목:

- 시작 화면에서 1~3번 저장 슬롯을 선택할 수 있다.
- 기존 저장이 있는 슬롯에서 새 게임을 누르면 확인 절차가 뜬다.
- 18개 항구의 `오늘의 항구` 간판과 대표 상품이 누락 없이 표시된다.
- 시장 팝업에서 큰 사기/팔기 버튼을 반복 클릭해 1개씩 거래된다.
- 거래 후 물건/돈 변화 플로팅이 표시된다.
- 의뢰 탭 성장 지도에 제주와 대마도 단계가 보인다.
- 장비 구매 또는 배 호출 시 축하 모달과 다음 행동 버튼이 뜬다.
- 지도에서 배 정박 항구가 작은 배 표시로 구분된다.
- 화물/장부 화면의 상단 도감에 방문 항구/상품/NPC 수가 표시된다.
- 월간 소식 카드에 계절 그림이 보인다.
## 2026-04-29 Milestone 8 Playtest Additions

Use `844x390` and `932x430` first. Then confirm portrait rotate notice at `390x844`.

Required manual flow:

1. Clear save, start a new game, and confirm the 부산포 discovery modal appears.
2. Close the discovery modal and confirm fame chips and port trust chip are visible.
3. Buy 면포 in the market and confirm monthly trend/demand chips do not overlap market badges.
4. Move to 대구 and confirm the 대구 discovery modal appears only on first arrival.
5. Sell 면포 and confirm merchant fame or trust feedback appears without breaking ledger records.
6. Open cargo/ledger and confirm `팔도 탐방 도감` and `상단 장부 조각` sections are visible.
7. Open equipment and confirm `새로 유리해진 길` route hints are visible.
8. Trigger or inspect event UI and confirm danger/result chips use route/event context.
9. Reload and continue; fame, discoveries, port trust, and ledger seal progress should remain.
10. Confirm no horizontal scroll on the target landscape viewports.

Automated checks now expect the first discovery modal and close it before continuing normal smoke/visual actions.

## 2026-04-29 Scene-First UI Pass 1 Checks

Required viewports:

- `1365x768`
- `1920x1080`
- `844x390`
- `932x430`

Manual visual checks:

1. Port main should read as a harbor scene first, not a dashboard card stack.
2. Port hotspots should sit plausibly on the scene and not overlap enough to block labels.
3. Hero CTA buttons for market/departure/quests should be visible without scrolling.
4. Map should clearly show a Korea-style peninsula, Jeju, Tsushima, and west/south/east sea labels.
5. Route lines should distinguish land and sea, selected/recommended routes, and current node.
6. Market should show a stall shelf with product icons before text.
7. Clicking a product should open a large readable trade overlay.
8. Buy/sell loops, route selection, and travel should still work.

Capture helper:

```bash
node scripts/scene-first-capture.mjs
```

Screenshots are written to `.logs/scene-first-ui-pass-1/` when `SCENE_OUT` points there.

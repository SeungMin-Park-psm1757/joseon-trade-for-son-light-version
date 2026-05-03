# 2026-04-27 Landscape Visual Map Pass

## 1. 변경 요약

- 기본 게임 UI를 844×390 / 932×430 기준 가로형 모바일 레이아웃으로 전환했다.
- 모든 상품에 `iconAsset`을 연결하고 시장, 화물, 장부, 의뢰, 추천 루트에 아이콘을 표시했다.
- 항구별 `visualType` / `sceneAsset`을 추가해 남해, 서해 갯벌, 내륙, 동해, 제주, 대마도 배경을 분리했다.
- 항구 허브를 시장/관청/술집/조선소 NPC 시설 화면으로 확장했다.
- 전체 지도에 노드/루트 선/위험 미리보기와 배·수레 이동 애니메이션을 추가했다.

## 2. 생성/반영한 에셋 목록

- `starter/public/assets/generated/region-scene-sheet.png`
- `starter/public/assets/generated/npc-portrait-sheet.png`
- `starter/public/assets/scenes/south-port.png`
- `starter/public/assets/scenes/west-mudflat.png`
- `starter/public/assets/scenes/inland-city.png`
- `starter/public/assets/scenes/east-port.png`
- `starter/public/assets/scenes/jeju.png`
- `starter/public/assets/scenes/tsushima.png`
- `starter/public/assets/npc/market-merchant.png`
- `starter/public/assets/npc/office-clerk.png`
- `starter/public/assets/npc/tavern-keeper.png`
- `starter/public/assets/npc/shipwright.png`
- `starter/public/assets/npc/rival-merchant.png`
- `starter/public/assets/npc/fallback-npc.png`
- `starter/public/assets/goods/*.png` 28종 + `fallback-good.png`

## 3. 상품 아이콘 매핑 방식

- `goods.json`의 각 상품에 `iconAsset: "/assets/goods/{id}.png"`를 추가했다.
- React에서는 `GoodIcon` 컴포넌트를 통해 표시하고, 로딩 실패 시 `/assets/goods/fallback-good.png`로 대체한다.

## 4. 항구 배경 매핑 방식

- `ports.json`에 `visualType`과 `sceneAsset`을 추가했다.
- 매핑은 `south_port`, `west_mudflat`, `inland_city`, `east_port`, `jeju`, `tsushima` 6종이다.
- 코드에는 `sceneAssetForPort` fallback을 둬 저장 데이터가 일부 오래되어도 기본 항구 배경으로 보정된다.

## 5. NPC 시설 화면 구현 방식

- `FacilityPanel`을 추가하고 `market`, `office`, `tavern`, `shipyard` 메타데이터를 연결했다.
- 항구 허브에서 시설을 고르면 오른쪽 패널에 NPC 초상, 짧은 대사, 관련 액션이 표시된다.
- 시장/장비 탭 내부에서는 중복 행동 버튼을 숨겨 실제 조작 UI가 우선 보이게 했다.

## 6. 전체 맵 이동 연출 방식

- `WorldMapBoard`가 `ports.json` 좌표와 `routes.json` 연결을 SVG 선으로 표시한다.
- `travelAnimation` 상태를 1초 동안 켜고, 배 또는 수레 이미지를 출발지에서 도착지로 CSS keyframe 이동시킨 뒤 기존 이동 로직을 실행한다.
- 연출 중에는 출발 버튼을 비활성화한다.

## 7. 테스트 결과

- 원본 Google Drive 경로에서는 `npm run validate:data`: 성공.
- temp copy `npm install`: 성공.
- temp copy `npm run validate:data`: 성공.
- temp copy `npm run build`: 성공.
- temp copy `npm run test:smoke`: 성공, 2 passed.

## 8. 가로화면 UI 확인 결과

- 844×390: 새 게임, 항구 허브, 시장 아이콘 구매, 화물 아이콘, 지도 이동, 이동 애니메이션, 판매, 장비 목표, NPC 시설, 새로고침 후 이어하기 확인.
- 932×430: 이어하기 후 항구 화면 확인.
- 가로 스크롤: 844×390 false, 932×430 false.
- 스크린샷: `.logs/mobile-landscape-visual-pass/`

## 9. 남은 한계

- 상품 아이콘은 우선 deterministic pixel placeholder이므로, 핵심 상품부터 imagegen/수작업 품질 보강 여지가 있다.
- 산길/고개 전용 이벤트 배경은 아직 추가하지 않았다.
- 장비 구매 UX는 시각화 중심으로 개선했지만, 조선소 수리/구매 분리 탭까지는 확장하지 않았다.

## 10. 다음 추천 작업

- 1순위: 상품 아이콘 28종 중 초반 핵심 10종을 더 선명한 고정 픽셀 스프라이트로 재작업.
- 2순위: 의뢰 objective resolver를 장비 구매, 방문, 납품, 이벤트 해결 전체에 맞춰 데이터 주도 UI로 정리.
- 3순위: 지도에서 추천 매도/매입 루트를 선택 목적지 패널에 더 직접 연결.

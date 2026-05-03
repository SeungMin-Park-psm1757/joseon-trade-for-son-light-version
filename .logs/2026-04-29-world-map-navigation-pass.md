# 2026-04-29 World Map Navigation Pass

## 작업 개요

3차 작업은 기존 지도 화면을 남부 중심의 둥근 섬 느낌에서 북부까지 포함한 한반도 전도형 교역망으로 개편하고, 도시 선택과 우측 이동 패널의 반응을 안정화하는 것이 목표였다.

## 수정 파일

- `starter/src/App.tsx`
- `starter/src/styles.css`
- `starter/public/data/ports.json`
- `starter/public/data/routes.json`
- `starter/public/data/port_flavors.json`
- `starter/public/data/discoveries.json`
- `starter/public/data/ledger_seals.json`
- `starter/public/data/map_layers.json`
- `data/ports.json`
- `data/routes.json`
- `data/port_flavors.json`
- `data/discoveries.json`
- `data/ledger_seals.json`
- `data/map_layers.json`
- `PLAN.md`
- `.logs/world-map-navigation-pass/*.png`

## 도시/항로 데이터 변경 요약

- 기존 남부/중부/도서 좌표를 새 한반도 실루엣에 맞게 재배치했다.
- 제주, 대마도, 흑산도는 하단 코치 UI에 가리지 않도록 위쪽으로 보정했다.
- 북부 도시 7개와 북부 발견 카드 7개를 추가했다.
- 북부 항로/육로 9개를 추가해 한양에서 개성, 평양, 신의주, 남포, 원산, 함흥, 청진으로 이어지는 네트워크를 만들었다.
- `map_layers.json`도 북서 강길권, 북동 풍랑권, 중부 내륙권 등 전체 한반도 기준 구역으로 갱신했다.
- 새 `북방 장부` ledger seal을 추가해 북부 방문/교역/위험 대응이 장기 목표에 포함되도록 했다.

## 추가된 북한/북부 도시

- 평양 `pyeongyang`
- 남포 `nampo`
- 신의주 `sinuiju`
- 원산 `wonsan`
- 함흥 `hamhung`
- 청진 `chongjin`
- 개성 `kaesong`

## 추가된 주요 루트

- `hanyang-kaesong`
- `kaesong-pyeongyang`
- `pyeongyang-sinuiju`
- `pyeongyang-nampo`
- `pyeongyang-wonsan`
- `nampo-ganghwa`
- `gangneung-wonsan`
- `wonsan-hamhung`
- `hamhung-chongjin`

## UI 변경

- `KoreaRouteMapLayer`를 전체 한반도 실루엣, 북부 영역, DMZ풍 구획선, 서해/동해/남해 레이블, 제주/울릉도/대마도 도서로 다시 그렸다.
- 지도 노드에 `data-testid="map-port-{id}"`를 추가했다.
- 항구/섬 항구/내륙 거점은 노드 모양과 내부 마커가 다르게 보이도록 했다.
- 노드 hit target을 키우고 라벨 pointer event를 막아 클릭이 작은 라벨/선에 흔들리지 않게 했다.
- 우측 route preview에 `위치 타입`, `수리`, `적재`, `예상 수익` 고정 그리드를 추가했다.

## 전후 스크린샷

- Before: `.logs/world-map-navigation-pass/before-map-1365x768.png`
- Before: `.logs/world-map-navigation-pass/before-map-ulsan-selected-1365x768.png`
- Before: `.logs/world-map-navigation-pass/before-map-1920x1080.png`
- After: `.logs/world-map-navigation-pass/after-map-1365x768.png`
- After: `.logs/world-map-navigation-pass/after-map-ulsan-selected-1365x768.png`
- After: `.logs/world-map-navigation-pass/after-map-kaesong-selected-1365x768.png`
- After: `.logs/world-map-navigation-pass/after-map-1920x1080.png`
- After: `.logs/world-map-navigation-pass/after-map-ulsan-selected-1920x1080.png`

## 검증 결과

- `npm run validate:data`: 통과. 25 ports, 32 routes.
- `npm run audit:consistency`: 통과. Git checkout 아님 환경 경고만 있음.
- `npm run build`: 통과.
- `npm run test:smoke`: 통과. 5 tests passed.
- `npm run test:visual`: 통과.
- Playwright 직접 검수 1365x768/1920x1080: 가로 오버플로 없음, port node 25개, route line 32개, 북부 도시 7개 모두 존재.
- Playwright 직접 검수: 부산포에서 울산 선택 시 `selectedDestination=울산`, selected route line 표시, 우측 route overview 표시.
- Playwright 직접 검수: 한양 상태에서 개성 선택 시 `selectedDestination=개성`, 우측 패널 텍스트 정상 반영.
- Playwright 직접 검수: 제주/대마도/흑산도 노드는 1365x768과 1920x1080에서 하단 코치보다 위에 있어 가려지지 않음.

## 남은 리스크

- 북부 지역은 MVP 범위를 넘는 장거리 목표이므로 경제 밸런스와 퀘스트 보상은 후속 플레이테스트에서 조정이 필요하다.
- 한반도 실루엣은 GIS 정확도보다 게임 가독성을 우선한 수작업 SVG이다. 더 정교한 픽셀 지도 에셋으로 분리하는 작업은 후속 아트 패스에서 가능하다.
- 25개 노드가 한 화면에 표시되면서 서울/개성/강화처럼 가까운 라벨은 여전히 빽빽하다. 현재 클릭은 안정화했지만, 후속으로 zoom/focus 또는 지역 필터를 넣으면 더 좋아진다.

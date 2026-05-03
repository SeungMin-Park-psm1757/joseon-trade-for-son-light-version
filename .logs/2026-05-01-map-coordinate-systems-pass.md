# 2026-05-01 Map Coordinate Systems Pass

## 변경 요약

- 지도 거점 25개의 `map.x/y`를 한반도 전도 기준으로 재배치하고, 각 거점에 현대 위경도 기반 `geo.lat/lon`을 추가했다.
- `map_layers.json`에 `korea-normalized-v2` 좌표계 설명, 0~100 정규화 viewport, aspect 처리 기준, 섬 anchor를 기록했다.
- React 지도 렌더링에서 지도 SVG, 경로 SVG, 마커, 판매 추천 팝업, 이동 토큰이 모두 같은 0~100 좌표계를 공유하도록 명시했다.
- 남해안, 서해안, 북부 밀집 거점의 라벨 충돌을 `map.labelSide` 기반으로 분산했다.
- 지도 우측 route preview의 보조 칩 대비를 높여 선택 도시 정보가 더 안정적으로 읽히도록 보강했다.

## 좌표 체계

- 좌표 단위: `normalized-percent`
- 원점: 지도 캔버스 좌상단
- 범위: `x: 0..100`, `y: 0..100`
- 배경, SVG 지도 레이어, route line, marker, label, sale popover, travel token은 모두 같은 viewport를 사용한다.
- 배경 이미지는 cover crop이 아니라 같은 viewport에 맞춰 늘어나는 방식으로 관리한다. 따라서 해상도가 변해도 마커가 배경 지도에서 벗어나지 않는다.
- 거점별 `geo.lat/lon`은 현대 지명 기준 근사 위경도다. 실제 좌표를 그대로 투영하지 않고, 현재 painted Korea map 실루엣에 맞춰 수동 정규화했다.

## 수정된 거점

- 북부/북서: 신의주, 평양, 남포, 개성
- 북동/동해: 원산, 함흥, 청진, 강릉, 포항, 울산
- 수도권/중부: 한양/서울, 강화, 충주
- 내륙 남부: 전주, 대구, 안동
- 서남해/남해: 군산포, 목포, 흑산도, 여수, 통영, 진해/제포, 부산포
- 섬: 제주, 대마도

## 겹침/오배치 해결

- 남해안 밀집 구간에서 부산포/진해/통영/여수 라벨 방향을 분산했다.
- 서해안 목포/흑산도/군산포 라벨을 좌측으로 빼서 해로와 겹침을 줄였다.
- 북부 신의주/남포/평양과 동북부 원산/함흥/청진 라벨을 서로 다른 방향으로 분리했다.
- 지도 route line은 해로와 육로 모두 normalized endpoint를 사용하며, stroke는 `vector-effect: non-scaling-stroke`로 고정했다.
- 마커 유형은 항구/내륙/섬/외국 거점/수도/생산/교역 role로 시각 구분한다.

## 해상도 검수 결과

스크린샷 저장 경로: `.logs/map-systems-audit/`

- `1920x1080`: 가로 스크롤 없음, visible label collision 0건
- `1600x900`: 가로 스크롤 없음, visible label collision 0건
- `1366x768`: 가로 스크롤 없음, visible label collision 0건

측정 파일:

- `.logs/map-systems-audit/map-layout-report-after.json`

스크린샷:

- `.logs/map-systems-audit/map-1920x1080-after.png`
- `.logs/map-systems-audit/map-1600x900-after.png`
- `.logs/map-systems-audit/map-1366x768-after.png`

## 테스트 결과

- `npm run validate:data`: 성공
- `npm run audit:consistency`: 성공, Git checkout 경고만 표시
- `npm run build`: 성공
- `npm run test:smoke`: 성공, 6 passed
- `npm run test:visual`: 성공

## 남은 리스크

- `geo.lat/lon`은 정확한 외부 GIS 투영이 아니라 게임용 전도 실루엣에 맞춘 근사값이다.
- 지도 배경 자체가 그림 기반이므로, 향후 지형 이미지를 교체하면 같은 좌표계 기준으로 재검수해야 한다.
- 현재 라벨 충돌 측정은 visible labels 기준이다. 모든 라벨을 항상 표시하는 별도 지도 모드가 생기면 라벨 layer를 더 세밀하게 분리해야 한다.

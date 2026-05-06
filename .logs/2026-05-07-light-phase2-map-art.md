# Light Phase 2 Map Art

Date: 2026-05-07

## 추가/유지된 도시 목록

총 21개 도시를 유지했다.

- 서울, 개성, 평양, 신의주
- 춘천, 강릉, 원산, 함흥, 청진
- 안동, 대구, 울산, 부산, 진주, 통영
- 전주, 광주, 순천, 여수, 목포
- 제주

## 특산품 매핑 요약

- 서울: 여러 물건을 잘 사주는 큰 장터
- 안동: 한지, 약초
- 대구: 약초, 쌀
- 부산: 면포, 건어물
- 통영/여수: 생선, 건어물
- 목포: 소금, 생선
- 전주: 한지, 쌀
- 제주: 귤
- 신의주: 강길/북방 교역 이미지
- 청진/함흥/원산: 동북 해안 및 북방 이미지

## 지도 표현 방식

- `junior-game/public/assets/maps/korea-light-map.svg` 신규 추가.
- 위성/relief 느낌의 지도 대신 라이트 전용 2D 전도형 SVG를 사용한다.
- 바다/육지/제주도/산맥/강/동해/서해/남해를 단순하게 표현했다.
- 압록강과 두만강은 점선/힌트 선으로 표현했다.
- 기존 도시 좌표와 route 데이터는 유지하되, 새 지도 배경에 맞도록 노드 스타일을 조정했다.

## 도시 선택 UX

- 도시 노드에 작은 지역 아이콘/라벨을 표시한다.
- 현재 위치는 pulse, 선택 도시는 scale up + glow + ripple, 갈 수 있는 도시는 초록 강조로 구분한다.
- 선택 카드에는 지역명, 도시명, 한 줄 설명, 대표 물건 1~2개, 이동 수단 힌트를 보여준다.

## 아트 교체 목록

- 지도 배경: `korea-route-map.webp` 표시에서 `korea-light-map.svg` 표시로 교체.
- 지도 CSS 배경도 `korea-light-map.svg` 기준으로 변경.
- 지도 노드 색, 그림자, 선택 링, route 선 스타일을 라이트 2D 톤으로 조정.

## 검수 결과

```text
cd junior-game
npm run build
npm run test

build: passed
test: 44 passed
```

## 스크린샷

경로: `.logs/2026-05-07-light-phase2-map-art/`

- `map-overview.png`
- `map-city-selected-busan.png`
- `map-city-selected-seoul.png`
- `map-city-selected-jeju.png`
- `map-city-selected-andong.png`
- `map-mobile-390x844.png`
- `map-mobile-412x915.png`

## 남은 품질 이슈

- 21개 도시가 모두 보이기 때문에 북부 지역 라벨은 조금 밀집되어 있다.
- 후속 단계에서는 줌/지역 접기 또는 도시 그룹 표시를 넣으면 더 읽기 좋아진다.
- SVG 지도는 코드형 2D 지도라 일관성은 좋아졌지만, 최종 아트 패스에서 hand-painted bitmap으로 다시 그리면 더 풍부해질 수 있다.

## 다음 단계 권고

- 지도 확대/축소 또는 북부/중부/남부 지역 보기 토글.
- 도시 선택 효과음 연결.
- 도시별 썸네일 카드와 지도 노드 아이콘을 같은 아트 세트로 통일.

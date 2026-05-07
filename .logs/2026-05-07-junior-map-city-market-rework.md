# Junior map/city/market rework

## 변경 요약
- junior/light version의 지도 거점을 26개로 확장했다.
- 인천, 남포, 대마도, 중국 항구, 북방 항구를 추가했다.
- 도시 타입을 내륙 장터, 동해 항구, 남해 항구, 서해 항구, 북방 장터, 섬 거점으로 분리했다.
- 서울-안동 육로와 울산-강릉-원산 해로를 포함해 해상/육상 연결망을 보강했다.
- 도시 화면을 도시 헤더, 특산품, 추천 행동, 주요 행동, 진행 목표 구조로 재배치했다.
- 장터 상단 빈 슬롯을 요약형 짐 패널로 바꾸고, 상품 카드의 원형 placeholder 느낌을 제거했다.
- “어디에 팔아봐” 계열 문구를 “인기 많아”, “값이 좋아”, “찾는 사람이 많아” 계열로 정리했다.

## 추가 도시
- 인천
- 남포
- 대마도
- 중국 항구
- 북방 항구

## 주요 연결 보강
- 서울 ↔ 인천
- 서울 ↔ 안동
- 안동 ↔ 강릉
- 평양 ↔ 남포
- 남포 ↔ 인천
- 인천 ↔ 목포
- 목포 ↔ 여수
- 부산 ↔ 울산
- 울산 ↔ 강릉
- 울산 ↔ 원산
- 부산 ↔ 대마도
- 대마도 ↔ 중국 항구
- 신의주 ↔ 중국 항구
- 청진 ↔ 북방 항구

## 검수 결과
- `npm run build`: 통과
- `npm run test`: 60 passed
- 금지어 검색: `팔아봐`, `판매처`, `매수가`, `매도가`, `수요`, `공급`, `수익률` 노출 없음
- 장터: 구매 후 화면 유지, 짐 요약 갱신 확인
- 지도: 26개 도시 노드 표시, 승인 지도 이미지 사용 확인

## 스크린샷
- `.logs/2026-05-07-junior-map-city-market-rework/city-busan-rework.png`
- `.logs/2026-05-07-junior-map-city-market-rework/city-incheon-rework.png`
- `.logs/2026-05-07-junior-map-city-market-rework/map-rework.png`
- `.logs/2026-05-07-junior-map-city-market-rework/map-incheon-selected.png`
- `.logs/2026-05-07-junior-map-city-market-rework/market-rework.png`
- `.logs/2026-05-07-junior-map-city-market-rework/travel-sea-route-rework.png`
- `.logs/2026-05-07-junior-map-city-market-rework/mobile-430-map-selected.png`

## 남은 후속 개선
- 도시가 26개로 늘어 북부/수도권 노드 밀도가 높아졌다. 다음 단계에서 라벨 충돌을 더 줄이면 좋다.
- 대외 거점은 학습용 단순 명칭으로 처리했다. 역사 고증 톤을 별도 검수할 수 있다.
- 해로가 많아진 만큼 배 보유 전/후 안내를 더 친절하게 조정할 여지가 있다.
- 도시별 고유 배경은 현재 승인 장면 자산을 재활용한다. 완전 고유 26개 배경은 별도 아트 패스로 남긴다.
- 지도 클릭 효과음은 아직 없다.

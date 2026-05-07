# Junior mobile map/market/ship layout pass

## 변경 요약
- 실제 390x844 모바일 캡처 기준으로 첫 화면의 정우 일러스트 중심축을 보정했다.
- 요정 대화/미션 메시지를 상단 정우 상태바 바로 아래로 올려, 화면마다 다음 행동 안내가 먼저 보이게 했다.
- 지도 화면은 하단 설명 패널을 제거하고, 선택 도시 옆 말풍선형 정보 카드로 바꿨다.
- 도시 연결망을 확장해 태백산맥 일부를 제외한 인접 도시 이동 선택지를 늘렸다.
- 장터 상품 카드의 내부 높이와 글자/버튼 배치를 보정해 `사기` 버튼과 힌트 문구가 카드 안에서 잘리지 않게 했다.
- 배 카드에는 단계별 돛/짐/깃발/선체 보강 표현을 더해 작은 나룻배, 작은 돛배, 튼튼한 돛배, 장사배의 차이를 더 보이게 했다.

## 프롬프트 문서
- `.prompts/2026-05-07-junior-mobile-map-market-ship-layout.md`

## 수정 파일
- `junior-game/src/JuniorApp.tsx`
- `junior-game/src/juniorData.ts`
- `junior-game/src/juniorStyles.css`

## 모바일 검수
- 390x844 viewport에서 시작, 장터, 지도, 탈것 화면을 캡처했다.
- 장터 첫 줄 상품 카드의 버튼 잘림을 발견해 카드 내부 높이를 추가 보정했다.
- 지도는 선택 도시 정보가 지도 하단 독립 패널이 아니라 도시 근처 말풍선으로 표시된다.

## 스크린샷
- `.logs/2026-05-07-junior-mobile-map-market-ship-layout/viewport/intro-390-viewport.png`
- `.logs/2026-05-07-junior-mobile-map-market-ship-layout/viewport/market-390-viewport-v2.png`
- `.logs/2026-05-07-junior-mobile-map-market-ship-layout/viewport/map-390-viewport.png`
- `.logs/2026-05-07-junior-mobile-map-market-ship-layout/viewport/shop-390-viewport.png`
- `.logs/2026-05-07-junior-mobile-map-market-ship-layout/viewport/shop-boats-scrolled-390.png`

## 테스트
- `cd junior-game && npm run build` 통과
- `cd junior-game && npm run test` 통과: 60 passed

## 남은 한계
- 배 자체 원본 PNG는 유지했고, 이번 단계에서는 카드 내 단계 차이를 CSS 레이어로 강화했다.
- 다음 단계에서 배 4종을 완전한 신규 투명 PNG로 다시 제작하면 시각 품질을 더 안정적으로 고정할 수 있다.

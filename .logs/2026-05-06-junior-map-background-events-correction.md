# 2026-05-06 Junior Map/Background/Event Correction

## 변경 요약

- 이전 모드의 `korea-route-map.webp`를 `junior-game/public/assets/maps/`로 복사해 junior 전용 전도형 지도 배경으로 적용했다.
- 추상 초록 지도 SVG 덩어리를 제거하고, 전도 래스터 위에 도시 버튼과 경로만 얹었다.
- 도시 화면은 full mode를 import하지 않고 junior 전용 배경 자산과 도시별 object-position/filter로 구분했다.
- 이동 모션을 약 1초에서 약 2.55초로 늦췄다.
- 이동 이벤트 풀을 20개 이상 맞춤법 퀴즈로 확장했다.
- 자유 플레이 이동 이벤트 확률을 3% 이하로 낮췄다.

## 이벤트 구조

- 도적: 6개
- 해적: 6개
- 야생동물: 5개
- 상인: 5개
- 날씨: 3개

모든 주요 이동 이벤트는 맞춤법 퀴즈로 극복한다. 오답이어도 게임오버는 없고 작은 돈 손해 또는 짐 손실만 있다.

## 검수

```text
cd junior-game
npm run build -> passed
npm run test  -> 36 passed
```

## 스크린샷

`.logs/screenshots/junior-map-cities-events-fix-2026-05-06/`

- `01-map-390-new-korea.png`
- `02-busan-city-bg.png`
- `03-daegu-city-bg.png`
- `04-pyongyang-visit-bg.png`
- `05-travel-slower.png`
- `06-animal-event.png`
- `07-merchant-event.png`

## 남은 보완

- 도시 21곳 각각의 완전 고유 배경 일러스트는 아직 부족하다. 현재는 품질 좋은 전면 배경과 도시별 포지션/톤 조정으로 구분했다.
- 다음 패스에서는 서울/평양/안동/목포/제주 등 주요 도시별 전용 배경을 별도 제작하면 더 좋아진다.

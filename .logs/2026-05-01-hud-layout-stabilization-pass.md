# HUD Layout Stabilization Pass

## 변경 요약

- 항구/시장/지도 화면의 가로형 shell 폭을 1920px 기준에 맞게 확장하고, 1366px에서는 전체 폭을 사용하도록 조정했다.
- 항구 우측 패널을 `오늘의 항구 -> 우선 행동 -> 시설/NPC -> 화물 -> 시장 소식 -> 추천` 흐름으로 재정렬했다.
- 항구 핫스팟 좌표를 시설 성격에 맞게 다시 배치했다. 시장/술집은 장터 쪽, 관청은 언덕/관문 쪽, 조선소는 선착장 쪽, 출항은 바다 쪽에 가깝게 조정했다.
- 요정 튜토리얼 패널을 짧고 고정된 안내 바로 줄여 본문 CTA와 연결했다.
- 모달 dim, 중앙 정렬, 너비/높이를 보강해 발견/퀘스트/이벤트 모달이 화면 하단에 밀리지 않도록 했다.

## 레이아웃 원칙

- 1920x1080에서는 콘텐츠 폭을 `1760px`까지 사용해 좌우 빈 공간을 줄인다.
- 1366x768에서는 shell을 `100%`로 두고, 메인 장면과 우측 패널이 한 화면에 안정적으로 들어오게 한다.
- 우측 패널은 페이지 전체 스크롤이 아니라 패널 내부 스크롤만 허용한다.
- 주요 행동은 `시장 가기`, `출항/이동`, `의뢰 3개` 3개 CTA로 먼저 노출한다.
- 빈 상태는 이유와 다음 행동을 함께 알려준다.

## 검수 결과

- `npm run validate:data`: 성공
- `npm run audit:consistency`: 성공, 로컬 Git checkout 아님 경고만 있음
- `npm run build`: 성공
- `npm run test:smoke`: 성공, 6 passed
- `npm run test:visual`: 성공

## 화면 확인

- 1920x1080: 가로 스크롤 없음. shell 1760px 사용.
- 1366x768: 가로 스크롤 없음. shell 1366px 사용.
- 우측 패널: 내부 스크롤 허용, 화면 전체 밀림 없음.
- 자동 저장 HUD: 1366px에서도 줄바꿈 없이 표시.

## 스크린샷

- `.logs/hud-layout-audit/desktop1920-port-after.png`
- `.logs/hud-layout-audit/desktop1920-market-after.png`
- `.logs/hud-layout-audit/desktop1920-map-after.png`
- `.logs/hud-layout-audit/desktop1366-port-after.png`
- `.logs/hud-layout-audit/desktop1366-market-after.png`
- `.logs/hud-layout-audit/desktop1366-map-after.png`
- `.logs/hud-layout-audit/desktop1366-modal-after.png`

## 남은 리스크

- 우측 패널은 정보량이 많아 1366x768에서는 내부 스크롤이 남는다. 기능상 안전하지만, 다음 패스에서 하위 카드 일부를 접힘 처리하면 더 좋아진다.
- 시장 화면은 장면형이 되었지만 상품 진열대가 아직 한 줄 중심이다. 카테고리별 선반/좌판 분리까지 하면 더 직관적이다.
- CSS cascade가 오래 누적되어 있어, 후속 패스에서 레이아웃 관련 최종 override를 정리하는 리팩터가 필요하다.

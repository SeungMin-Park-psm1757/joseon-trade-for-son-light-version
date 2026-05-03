# Art Consistency Pass

## 변경 요약

- 상품/시설/결과/장비/요정 아이콘을 48색 pixel-painted 규칙으로 재처리했다.
- 잘못 매핑되어 있던 결과 아이콘과 배/수레 티어 이미지를 바로잡았다.
- 배경, 지도, UI 카드, 버튼에 공통 팔레트/외곽선/픽셀 질감 레이어를 적용했다.
- 요정 패널을 작은 아이콘이 아니라 `요정` 이름표가 붙은 대화형 동반자 프레임으로 강화했다.
- 장비 화면에서 배/수레/장비 텍스트가 밝은 패널 위 흰색으로 보이던 가독성 문제를 수정했다.

## 아트 방향 통일 기준

- 팔레트: 먹색/남색 HUD, 황동 CTA, 청록 선택 상태, 한지색 정보 패널.
- 외곽선: 주요 아이콘과 카드에는 짙은 갈색 2px 전후의 외곽선을 적용.
- 질감: 배경/지도/시장 장면에는 미세한 pixel grid와 vignette를 겹쳐 회화풍 배경과 픽셀풍 UI 사이의 괴리를 줄임.
- 스케일: 상품/시설/결과/장비 아이콘은 192px 원본 기준으로 정리하고 런타임에서는 동일한 drop-shadow와 pixel rendering을 사용.
- 버튼 문법: primary는 황동, 선택/현재는 청록, ghost/보조는 먹색 반투명, disabled는 회색으로 통일.

## 교체/보정한 자산

- `starter/public/assets/painted2d/goods/*.png`: 상품 아이콘 28종 + fallback 색상/외곽선/잔여 조각 정리.
- `starter/public/assets/painted2d/ui/hub-*.png`: 시장/관청/술집/조선소/지도/어업 시설 아이콘 재처리.
- `starter/public/assets/painted2d/ui/result-*.png`: 결과 아이콘 매핑 수정 및 재처리.
- `starter/public/assets/painted2d/vehicles/cart-tier-1..4.png`: 수레 티어 이미지 교체.
- `starter/public/assets/painted2d/vehicles/ship-tier-1..4.png`: 배 티어 이미지 교체.
- `starter/public/assets/painted2d/companions/guide-spirit-*.png`: 요정 3종 재처리.
- `starter/public/assets/painted2d/characters/guide-spirit-*.png`: 요정 3종 미러 재처리.

원본 백업:
- `.logs/art-consistency-audit/original-icons/`

## 전/후 비교 포인트

- 이전: 수레 슬롯에 배가 나오고, 배 구입 화면에 돈주머니가 보이는 식의 자산 매핑 오류가 있었다.
- 이후: 수레는 수레, 배는 배로 표시되며 티어별 작은 표식으로 성장 차이를 구분한다.
- 이전: 요정은 작은 장식 아이콘처럼 보였다.
- 이후: 별도 프레임, glow, 이름표를 가진 대화 동반자로 보인다.
- 이전: 지도만 다른 장르의 고해상도 지도처럼 튀었다.
- 이후: 지도에도 동일한 pixel grid, brass/teal node, dark outline을 적용했다.
- 이전: 상단 탭과 내부 버튼의 문법이 다소 섞였다.
- 이후: 황동 CTA와 청록 선택 상태로 통일했다.

## 검증

- `npm run validate:data`: 성공
- `npm run audit:consistency`: 성공, Git checkout 아님 경고만 있음
- `npm run build`: 성공
- `npm run test:smoke`: 성공, 6 passed
- `npm run test:visual`: 성공

## 스크린샷

- `.logs/art-consistency-audit/desktop1366-port-art-after.png`
- `.logs/art-consistency-audit/desktop1366-market-art-after.png`
- `.logs/art-consistency-audit/desktop1366-map-art-after.png`
- `.logs/art-consistency-audit/desktop1366-vehicles-art-after.png`
- `.logs/art-consistency-audit/desktop1920-port-art-after.png`
- `.logs/art-consistency-audit/desktop1920-market-art-after.png`
- `.logs/art-consistency-audit/desktop1920-map-art-after.png`
- `.logs/art-consistency-audit/desktop1920-vehicles-art-after.png`

## 남은 미세 이슈

- 배경 원본은 여전히 고해상도 회화 기반이다. 이번 패스에서는 CSS 질감과 팔레트 보정으로 통일했지만, 완전한 픽셀아트 배경으로 가려면 배경 원본을 별도 제작해야 한다.
- 몇몇 결과 아이콘은 source sheet 기반이라 상징성은 좋아졌지만, 이벤트별 전용 장면 아이콘까지는 아직 아니다.
- 시장 진열은 통일감이 좋아졌지만, 좌판/상자/바구니별 진열대 구분까지 넣으면 더 게임답다.

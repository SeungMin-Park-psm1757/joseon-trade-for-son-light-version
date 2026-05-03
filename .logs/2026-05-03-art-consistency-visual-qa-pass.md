# 2026-05-03 Art Consistency Visual QA Pass

## 1. 작업 개요

- 목표: 저품질 2D 오브젝트, 겹침, UI 위계 약화 문제를 전수 점검하고 1366x768, 1600x900, 1920x1080 기준으로 안정화.
- 접근: 실제 브라우저 캡처를 `before/after`로 저장한 뒤, 화면 기준 문제 28건을 1:1로 수정.
- 캡처 경로:
  - Before: `.logs/art-polish-pass3/before/`
  - After: `.logs/art-polish-pass3/after/`

## 2. 수정 파일 목록

- `starter/src/artDirection.ts`
- `starter/src/painted2d-art.css`
- `starter/public/data/asset_manifest.json`
- `data/asset_manifest.json`
- `starter/public/assets/painted2d/ui/hub-market.svg`
- `starter/public/assets/painted2d/ui/hub-office.svg`
- `starter/public/assets/painted2d/ui/hub-tavern.svg`
- `starter/public/assets/painted2d/ui/hub-shipyard.svg`
- `starter/public/assets/painted2d/ui/hub-map.svg`
- `starter/public/assets/painted2d/ui/hub-fish.svg`
- `starter/public/assets/painted2d/companions/guide-spirit-default.svg`
- `starter/public/assets/painted2d/companions/guide-spirit-happy.svg`
- `starter/public/assets/painted2d/companions/guide-spirit-warning.svg`

## 3. 교체/수정 자산 목록

- 시설 핫스팟 아이콘 6종을 PNG 런타임 참조에서 SVG 런타임 참조로 교체.
- 요정 안내 아이콘 3종을 PNG 런타임 참조에서 SVG 런타임 참조로 교체.
- 새 SVG는 외부 에셋 없이 Codex가 작성한 프로젝트 내부 벡터 자산이며, `asset_manifest.json`에 `codex-svg`, `project-bound`로 기록.

## 4. 아트 방향 통일 기준

- 팔레트: 먹색/남색 패널, 청록 CTA, 황동 테두리, 한지색 보조 패널.
- 아이콘 문법: 굵은 먹선, 황동 강조, 64x64 기준, 텍스트 없는 실루엣 우선.
- 패널 문법: 주요 장면 위 컨트롤은 어두운 반투명 패널, 정보/목록은 한지색 패널.
- 버튼 문법: primary는 청록, secondary는 한지/황동, 위험/비활성은 채도와 대비를 낮춤.
- 지도 문법: 마커와 라벨을 황동 링+먹색 라벨로 강화해 배경 지도와 분리.

## 5. 문제 식별 및 수정 결과

| # | 수정 전 문제 | 수정 후 결과 |
|---|---|---|
| 1 | 하단 fixed 요정 패널이 항구 장면을 가림 | 요정 안내를 상단 흐름형 패널로 이동 |
| 2 | 요정 패널이 시장 NPC와 진열대를 가림 | 시장 장면 하단 가림 제거 |
| 3 | 요정 패널이 지도 남서부/제주 영역을 가림 | 지도 하단 가림 제거 |
| 4 | 요정 패널이 장비 화면 하단 구매 목록을 가림 | 장비 화면 하단 충돌 제거 |
| 5 | 1920 폭에서 빠른 탭이 요정 바 위에 겹침 | 요정 바 폭을 왼쪽 컴팩트 영역으로 제한 |
| 6 | 844x390에서 탭이 튜토리얼 단계 클릭을 가로챔 | 모바일에서는 탭을 정상 흐름으로 전환 |
| 7 | 844x390에서 튜토리얼 경로가 숨겨져 테스트/동선 불능 | 작은 화면에서는 활성 단계 1개만 표시 |
| 8 | 시장 상품 카드가 너무 커서 표/대시보드처럼 보임 | 진열대형 2열/4열 압축 레이아웃으로 재정렬 |
| 9 | 시장 진열대가 과도한 빈 공간을 남김 | 고정 row 높이와 shelf 배경을 적용 |
| 10 | 시장 카드 배경이 평평한 크림색 반복 | 목재/한지 혼합 카드와 그림자 적용 |
| 11 | 상품 아이콘이 카드 안에서 중심 시각 요소가 약함 | 아이콘 크기/그림자/중앙 정렬 강화 |
| 12 | 추천/특산/수요 배지가 작고 장식처럼 보임 | pill 크기와 대비를 통일 |
| 13 | 거래 팝업이 주변 UI와 분리된 웹 패널처럼 보임 | 황동 테두리, 한지 배경, CTA 위계 적용 |
| 14 | 시장 NPC가 하단 패널에 눌려 보임 | NPC 크기와 위치를 재조정 |
| 15 | 시설 핫스팟 PNG가 배경 품질보다 낮아 튐 | 시설 아이콘 6종을 통일 SVG로 교체 |
| 16 | 시설 버튼이 스티커형 베이지 박스처럼 보임 | 어두운 반투명 간판형 버튼으로 재스타일 |
| 17 | 시설 버튼 크기/간격이 제각각 | clamp 기반 크기와 내부 icon plaque 통일 |
| 18 | 항구 CTA들이 같은 강도로 보여 우선순위 약함 | primary/secondary/ghost 색상 위계 보강 |
| 19 | 우측 패널 정보 카드들이 모두 같은 톤 | 정보 패널 테두리/배경/그림자 계층화 |
| 20 | side panel 하단 잘림이 의도 없는 clipping처럼 보임 | 패널 간격/스크롤 affordance 개선 |
| 21 | 지도 마커가 단순 UI dot처럼 보임 | 황동 링, 청록 중심, 현재 위치 glow 적용 |
| 22 | 지도 라벨이 작고 검은 pill처럼 튐 | 황동 테두리와 밝은 글자 라벨로 통일 |
| 23 | 지도 경로가 배경에 묻힘 | route line shadow/강조 유지 |
| 24 | 모달이 평평한 크림색 팝업처럼 보임 | dim, blur, 황동 테두리, 한지 패널 적용 |
| 25 | 요정 캐릭터 존재감이 약함 | SVG 요정 3종과 빛나는 프레임 적용 |
| 26 | 작은 칩/뱃지가 화면마다 다른 모양 | chip/badge radius, border, inset highlight 통일 |
| 27 | 배/수레 이미지가 카드 안에서 잘리거나 늘어날 위험 | object-fit contain, 비율 유지 규칙 보강 |
| 28 | 1366/1600/1920에서 가로 스크롤 가능성 | 실제 캡처 스크립트로 x overflow 0 확인 |

## 6. 해상도별 검증 결과

| 해상도 | 검증 화면 | 결과 |
|---|---|---|
| 1366x768 | 항구, 시장, 거래 팝업, 지도, 장비 | 가로 overflow 0, 주요 겹침 없음 |
| 1600x900 | 항구, 시장, 거래 팝업, 지도, 장비 | 가로 overflow 0, 지도/우측 패널 안정 |
| 1920x1080 | 항구, 시장, 거래 팝업, 지도, 장비 | 가로 overflow 0, 상단 탭/요정 바 충돌 재수정 완료 |
| 844x390 | 항구, 시장 smoke 보조 확인 | 가로 overflow 0, 튜토리얼 단계 클릭 가능 |

## 7. 전/후 비교 포인트

- Before: 요정 패널이 fixed bottom으로 장면과 CTA를 덮음.
- After: 요정 안내가 상단 compact guide bar로 이동해 장면을 가리지 않음.
- Before: 시설 아이콘이 저품질 PNG 스티커처럼 보임.
- After: 시설 아이콘은 같은 SVG 문법으로 통일되어 배경과 UI 사이의 품질 편차가 줄어듦.
- Before: 시장은 큰 크림색 상품 카드가 벌어진 목록처럼 보임.
- After: 시장은 어두운 장터 진열대 위 한지 물품 카드로 보이며 상품 아이콘이 먼저 읽힘.
- Before: 지도 마커/라벨이 UI 점처럼 떠 보임.
- After: 황동 링과 먹색 라벨로 한반도 지도 위 게임 노드처럼 보임.

## 8. 테스트 결과

- `npm run validate:data`: 성공
- `npm run audit:consistency`: 성공
  - 경고: 로컬 작업 폴더가 Git checkout이 아니라는 기존 환경 경고만 있음.
- `npm run build`: 성공
- `npm run test:smoke`: 성공, 6/6
- `npm run test:visual`: 성공

## 9. 남은 리스크

- 844x390은 기능/가로 overflow는 통과하지만 물리적 높이가 매우 낮아 시장/항구 장면이 압축된다. 후속으로 모바일 전용 더 큰 터치 모드가 있으면 좋다.
- 기존 PNG 허브 아이콘 파일은 남겨두었지만 런타임은 SVG를 사용한다. 정리 전까지는 fallback 성격의 미사용 자산으로 남는다.
- 배경 자체는 고품질 painted2D이고 새 SVG 아이콘은 선명한 UI 벡터라 완전히 같은 래스터 질감은 아니다. 다만 화면 내 품질 편차는 이전보다 크게 줄었다.

## 10. 다음 추천 작업

1. 844x390 전용 ultra-compact scene layout: 시장/항구 장면에서 핵심 조작만 남기는 별도 모바일 가로 프리셋.
2. 상품/이벤트 결과 칩의 전체 SVG 아이콘화: 텍스트 pill 의존을 더 줄이기.
3. 미사용 PNG 허브/요정 자산 정리 및 asset manifest의 deprecated 필드 도입.

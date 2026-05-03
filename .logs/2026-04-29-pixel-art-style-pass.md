# 2026-04-29 Pixel Art Style Pass

## 작업 개요

2차 작업은 상품 아이콘, 요정 안내자, 이동 토큰, 시장/지도/장비 UI의 해상감과 정보 위계를 하나의 픽셀아트 게임처럼 맞추는 것이 목표였다. 외부 이미지 생성이나 라이선스 불명확 자산은 쓰지 않고, React/SVG/CSS 안에서 재현 가능한 픽셀 자산으로 교체했다.

## 수정 파일

- `starter/src/App.tsx`
- `starter/src/styles.css`
- `PLAN.md`
- `.logs/2026-04-29-pixel-art-style-pass.md`
- `.logs/pixel-art-style-pass/*.png` 전후 비교 스크린샷

## 핵심 변경

- 모든 `GoodIcon` 렌더링을 기존 `/assets/goods/*.png` 표시 대신 48px 기준 런타임 SVG 픽셀 아이콘으로 교체했다.
- 상품 카테고리별 팔레트를 `grain`, `salt`, `seafood`, `textile`, `luxury`, `craft`, `resource`, `metal`, `foreign`, `medicine`, `livestock`, `food`, `restricted`로 나누고, 외곽선/명암/프레임 규칙을 통일했다.
- 요정은 `GuideSpirit` 컴포넌트로 재구성하고 `default`, `happy`, `warning` 표정 변형을 추가했다.
- 튜토리얼 코치와 시장 상품 상세에 요정 말풍선형 안내를 붙여 생산지, 수요지, 손해 거래를 실제 흐름 안에서 설명하게 했다.
- 지도 이동 중 보이던 배/수레 PNG 토큰을 투명 배경 SVG 픽셀 토큰으로 바꿔 배경이 비치는 직사각형 합성 문제를 제거했다.
- 상품 타일, 거래 팝오버, 추천 패널, 장비 카드, CTA 버튼에 픽셀풍 테두리/그림자/한지+목재 배경을 적용했다.

## 새/교체된 아이콘 목록

다음 28개 상품은 모두 동일한 픽셀 프레임 기반 런타임 아이콘으로 교체되었다.

- 쌀 `rice`
- 보리 `barley`
- 콩 `beans`
- 소금 `salt`
- 건어물 `dried_fish`
- 생선 `fresh_fish`
- 홍어 `skate`
- 미역 `seaweed`
- 면포 `cotton_cloth`
- 삼베 `hemp_cloth`
- 비단 `silk`
- 명주실 `silk_thread`
- 한지 `paper`
- 서책 `books`
- 부채 `fan`
- 목재 `lumber`
- 소나무 목재 `pine_lumber`
- 철 `iron`
- 은 `silver`
- 인삼 `ginseng`
- 약초 `herbs`
- 말 `horse`
- 감귤 `citrus`
- 일본 종이 `japanese_paper`
- 칠기 `lacquerware`
- 화약 `gunpowder`
- 차 `tea`
- 도자기 `ceramics`

## 전후 비교 스크린샷

- Before: `.logs/pixel-art-style-pass/before-port-1365x768.png`
- Before: `.logs/pixel-art-style-pass/before-market-1365x768.png`
- Before: `.logs/pixel-art-style-pass/before-map-1365x768.png`
- Before: `.logs/pixel-art-style-pass/before-travel-animation-1365x768.png`
- Before: `.logs/pixel-art-style-pass/before-equipment-1365x768.png`
- Before: `.logs/pixel-art-style-pass/before-market-1920x1080.png`
- After: `.logs/pixel-art-style-pass/after-port-1365x768.png`
- After: `.logs/pixel-art-style-pass/after-market-1365x768.png`
- After: `.logs/pixel-art-style-pass/after-map-1365x768.png`
- After: `.logs/pixel-art-style-pass/after-travel-animation-1365x768.png`
- After: `.logs/pixel-art-style-pass/after-equipment-1365x768.png`
- After: `.logs/pixel-art-style-pass/after-market-1920x1080.png`
- After: `.logs/pixel-art-style-pass/after-travel-animation-1920x1080.png`
- After: `.logs/pixel-art-style-pass/after-equipment-1920x1080.png`

## 검증 결과

- `npm run validate:data`: 통과. 17 data files, 18 ports, 28 goods, 23 routes, 10 tools, 9 companions.
- `npm run audit:consistency`: 통과. 로컬 폴더가 Git checkout이 아니라는 환경 경고만 있음.
- `npm run build`: 통과.
- `npm run test:smoke`: 통과. 5 tests passed.
- `npm run test:visual`: 통과.
- Playwright 직접 검수 1365x768/1920x1080: 가로 오버플로 없음, 상품 아이콘 전부 SVG, 요정 말풍선 overflow 없음, 거래 팝오버 viewport 안에 있음, 이동 토큰은 SVG이며 배경색 `rgba(0, 0, 0, 0)`.

## 남은 리스크

- 기존 PNG 상품 파일은 데이터 호환을 위해 남겨두었다. 이후 완전한 에셋 파이프라인을 만든다면 manifest와 실제 파일도 정리할 수 있다.
- 현재 아이콘은 코드 기반 SVG라 스타일 통일성은 높지만, 수작업 픽셀 스프라이트 시트만큼의 질감 차별화는 다음 아트 패스에서 더 높일 수 있다.
- 튜토리얼 코치는 하단 고정 UI라 작은 가로 화면에서 일부 콘텐츠를 계속 압축한다. 844x390 기준은 통과했지만, 장기적으로는 접힘/펼침 상태를 두는 편이 더 좋다.

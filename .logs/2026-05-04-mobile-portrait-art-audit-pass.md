# 2026-05-04 Mobile Portrait And Art Audit Pass

## 1. 변경 요약

- 휴대폰 세로 화면에서는 full mode 게임 UI를 렌더링하지 않고 orientation gate만 반환하도록 React 단계에서 차단했다.
- `visualViewport` 기반 `--vvw`, `--vvh` CSS 변수를 추가해 모바일 브라우저 실제 표시 높이를 landscape 레이아웃에 반영했다.
- `844x390`, `932x430`, `1024x600` landscape에서 HUD, 탭, 본문, 우측 패널이 겹치지 않도록 마지막 cascade override를 추가했다.
- primary gameplay art에서 인라인 polygon 지도, 그림판식 ship/cart SVG, tiny hub SVG, `result-plain.png` placeholder 경로를 제거했다.
- visual QA 스크립트가 portrait gate, desktop 3종, mobile landscape 3종을 직접 캡처하도록 확장됐다.

## 2. Portrait 대응 방식

- 조건: `width <= 760 && height > width`.
- 표시: `PortraitOrientationGate`만 렌더링.
- 포함 요소: 회전 아이콘, "이 게임은 가로 화면에서 더 잘 보여요. 휴대폰을 옆으로 돌려주세요.", 큰 `계속` 버튼.
- 숨김 요소: HUD, 탭, 본문, 우측 패널, 하단 요정/튜토리얼 패널, 모든 모달.
- `계속` 버튼은 게임 진입 버튼이 아니라 확인 메시지만 보여준다.

## 3. Landscape 모바일 조정 방식

- safe area와 visual viewport를 `styles.css` 최종 블록에서 사용한다.
- HUD는 핵심 정보만 남기고 월간/자동저장/세부 오디오 컨트롤을 좁은 landscape에서 축약한다.
- 탭바는 flex 기반 horizontal scroll로 전환해 세로 글자 붕괴를 막았다.
- port/map은 `minmax(0, 1fr) + minmax(222-238px, 0.46-0.48fr)` 2열을 유지하고, side panel은 내부 스크롤을 가진다.
- tutorial coach는 모바일 landscape에서 작고 낮게 배치해 CTA를 가리지 않도록 했다.
- transient toast는 visual QA에서 사라진 뒤 캡처되며, 실제 배치도 좁은 landscape에서 오른쪽 작은 알림으로 보정했다.

## 4. 그래픽 문제 식별 목록

| # | 파일/위치 | 문제 유형 | 심각도 | 수정 방식 |
|---|---|---|---|---|
| 1 | `starter/src/App.tsx` `KoreaRouteMapLayer` | polygon-like / low-detail map | High | 인라인 SVG 지도 제거, painted WebP 지도 사용 |
| 2 | `starter/src/App.tsx` peninsula path | style mismatch | High | `korea-route-map.webp`로 대체 |
| 3 | `starter/src/App.tsx` island ellipses | ms-paint-like / crude illustration | High | raster map으로 대체 |
| 4 | `starter/src/App.tsx` mountain/river SVG strokes | visual hierarchy mismatch | Minor | raster map과 CSS route overlay로 역할 분리 |
| 5 | `starter/src/App.tsx` map sea rectangles | low-detail map | Minor | painted map background으로 대체 |
| 6 | `starter/src/App.tsx` `VehiclePixelToken` sea token | ms-paint-like / crude illustration | High | `ship-tier-2.png` 사용 |
| 7 | `starter/src/App.tsx` `VehiclePixelToken` land token | ms-paint-like / crude illustration | High | `cart-tier-2.png` 사용 |
| 8 | `starter/public/assets/painted2d/ui/hub-market.svg` | icon too tiny / unreadable | High | `hub-market.png` 경로로 전환 |
| 9 | `starter/public/assets/painted2d/ui/hub-office.svg` | icon too tiny / unreadable | High | `hub-office.png` 경로로 전환 |
| 10 | `starter/public/assets/painted2d/ui/hub-tavern.svg` | ms-paint-like / crude illustration | High | `hub-tavern.png` 경로로 전환 |
| 11 | `starter/public/assets/painted2d/ui/hub-shipyard.svg` | icon too tiny / unreadable | High | `hub-shipyard.png` 경로로 전환 |
| 12 | `starter/public/assets/painted2d/ui/hub-map.svg` | placeholder asset | High | `hub-map.png` 경로로 전환 |
| 13 | `starter/public/assets/painted2d/ui/hub-fish.svg` | style mismatch | Minor | `hub-fish.png` 경로로 전환 |
| 14 | `starter/public/assets/painted2d/ui/result-plain.png` | placeholder asset | High | `plain` 결과를 `result-safe.png`로 매핑 |
| 15 | `starter/public/assets/painted2d/maps/korea-route-map.webp` use site | wrong aspect ratio risk | Minor | `.korea-map-raster` object-fit/fill 고정 |
| 16 | goods icons in market cards | icon too tiny / unreadable | Minor | final object-fit and existing larger market icon frame 유지 |
| 17 | goods icons in cargo/route chips | inconsistent border/shadow/frame | Minor | common `.good-icon` contain rule 적용 |
| 18 | hub hotspot images | inconsistent border/shadow/frame | Minor | unified padded frame, radius, inset border, shadow 적용 |
| 19 | ship/cart route tokens | blurry upscale risk | Minor | `image-rendering:auto` and drop-shadow 적용 |
| 20 | guide spirit portrait | wrong aspect ratio risk | Minor | common contain rule 적용 |
| 21 | NPC portraits/facility NPCs | wrong aspect ratio risk | Minor | common contain rule 적용 |
| 22 | route destination scene thumbnails | wrong aspect ratio | Minor | contain baseline, mobile route preview crop size 고정 |
| 23 | season art | style mismatch | Minor | common contain rule 적용 |
| 24 | companion avatars | wrong aspect ratio risk | Minor | common contain rule 적용 |
| 25 | discovery/seal/equipment thumbnails | inconsistent border/shadow/frame | Minor | common contain rule 적용 |
| 26 | bottom tab auxiliary icons/text | visual hierarchy mismatch | Minor | fixed-height scrollable tabbar 적용 |
| 27 | mobile toast over tabs | visual hierarchy mismatch | Minor | mobile landscape toast offset and visual wait 보정 |

## 5. 수정/교체 자산 목록

- 지도: `starter/public/assets/painted2d/maps/korea-route-map.webp`를 primary map layer로 사용.
- 이동 토큰: 인라인 SVG ship/cart 제거, `vehicles/ship-tier-2.png`, `vehicles/cart-tier-2.png` 사용.
- 시설 아이콘: `ui/hub-*.svg` 경로를 `ui/hub-*.png`로 교체.
- 결과 아이콘: `result-plain.png` 대신 `result-safe.png` 매핑.
- 공통 프레임/렌더링: goods, hub, vehicle, guide, NPC, companion, discovery, seal, equipment 이미지에 `object-fit`/frame/선명도 규칙 추가.

## 6. 테스트 결과

- 원본 경로: `npm run validate:data` 통과.
- 원본 경로: `npm run audit:consistency` 통과.
- 임시 ASCII 경로 `C:\Users\QuIC\AppData\Local\Temp\joseon-trade-starter-mobileqa`: `npm run build` 통과.
- 임시 ASCII 경로: `npm run test:smoke` 통과, 7 passed.
- 임시 ASCII 경로: `npm run test:visual` 통과.
- 참고: 원본 Google Drive 경로에서는 Windows `.bin` shim이 한글/공백 경로에서 `tsc`를 실행하지 못해 build/smoke/visual은 동일 파일을 임시 ASCII 경로에 복사해 검증했다.

## 7. 스크린샷 경로

- `.logs/visual-mobile-portrait-art-2026-05-04/portrait-390x844.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/portrait-412x915.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/port.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/market.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/map.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/market-932.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/map-1024x600.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/desktop-port-1366x768.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/desktop-map-1366x768.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/desktop-port-1600x900.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/desktop-map-1600x900.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/desktop-port-1920x1080.png`
- `.logs/visual-mobile-portrait-art-2026-05-04/desktop-map-1920x1080.png`

## 8. 남은 한계

- 일부 discovery/seal 이미지는 같은 painted style을 공유해 반복감이 있다. primary 화면의 깨짐은 줄었지만, 장기적으로는 지역별 고유 컷을 추가하는 편이 좋다.
- market 화면은 모바일 landscape에서 일부 상품 그리드가 화면 아래로 이어진다. 현재는 스크롤/overflow 제어로 깨짐은 없지만, 다음 pass에서 상품 필터/압축을 더 하면 좋다.
- 기존 CSS cascade가 매우 길어 최종 override에 의존하는 규칙이 많다. 이후 라이트모드와 공존하려면 responsive layer를 별도 파일로 분리하는 것이 좋다.

## 9. 다음 추천 작업

- 지역 발견 카드와 도장 이미지의 고유 컷 추가.
- market goods grid의 모바일 landscape 밀도 2차 정리.
- `styles.css` responsive/art QA block을 전용 CSS layer로 분리.
- Playwright visual test에 이미지 잘림/빈 캔버스 픽셀 검사 추가.

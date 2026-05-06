# 2026-05-05 Story Family And Art Fix

## 판단한 수정 프롬프트

정우만 조선으로 시간여행했다는 전제로 본게임을 정리한다. 세연, 엄마, 아빠는 조선 화면과 능력치에서 제거하고, 거상이 되어 현대세계로 돌아갈 단서를 모으는 큰 목표를 스토리 초안으로 다시 쓴다. 지게/수레/장비/봄 장터/발견 카드에 남은 그림판식 또는 잘린 자산은 통일된 2D 게임 PNG 자산으로 교체한다. 같은 지적이 반복되지 않도록 art/story QA 스크립트를 추가한다.

## 실제 수정

- `App.tsx`에 `DISABLED_STORY_COMPANION_IDS`를 추가해 `park_seyeon`, `dad`, `mom`을 초기 상태, 기존 저장 normalize, 능력치 합산, 장비 화면, 동료 조언, 이벤트 결과에서 제외했다.
- family helper row는 삭제하지 않고 JSX 주석으로 비활성화했다.
- 시작 화면 문구를 "정우 혼자 조선에 도착했고 거상이 되어 현대세계로 돌아갈 단서를 모은다"는 목표로 수정했다.
- `docs/STORYLINE_REWRITE_DRAFT.md`에 큰 스토리라인 검토 초안을 작성했다.
- `cart-backpack`, `cart-handcart`, `cart-packhorse`, `cart-ox_cart`, `cart-merchant_wagon`, `cart-escort_caravan` 자산을 새로 만들고 cart id별로 사용하게 했다.
- 도구 아이콘 10종과 fallback kind 아이콘을 PNG로 만들고 `ToolIcon`이 CSS doodle 대신 해당 이미지를 쓰게 했다.
- `season-spring/summer/autumn/winter.png`를 만들어 봄 장터 등 월간 소식 이미지가 SVG 그림판풍으로 보이지 않게 했다.
- `discovery_busan_waegwan_road.png`를 단일 완성 아이콘으로 교체해 첫 발견 카드에서 잘린 두 그림처럼 보이던 문제를 없앴다.
- tutorial dialogue의 바람이 초상 경로를 `.svg`에서 `.png`로 바꿨다.
- `npm run audit:art`를 추가해 banned primary placeholder, family helper UI, guide SVG portrait 회귀를 잡는다.

## 검증

- `npm run validate:data`: pass
- `npm run audit:consistency`: pass
- `npm run audit:art`: pass
- `npm run build`: pass, ASCII temp path
- `npm run test:smoke`: pass, 7 passed, ASCII temp path
- `npm run test:visual`: pass, ASCII temp path

## 스크린샷

- `.logs/visual-story-art-fix-2026-05-05/vehicles.png`
- `.logs/visual-story-art-fix-2026-05-05/port.png`
- `.logs/visual-story-art-fix-2026-05-05/market.png`
- `.logs/visual-story-art-fix-2026-05-05/desktop-port-1366x768.png`
- 별도 확인: `C:\Users\QuIC\AppData\Local\Temp\story-art-discovery-modal.png`

## 남은 판단

- 가족 캐릭터 데이터와 asset manifest 항목은 보존했다. 사용자가 스토리 검토 후 완전 삭제를 지시하면 데이터/자산/manifest까지 정리하면 된다.
- 지게/수레 자산은 이제 id별로 구분되지만, 후속 pass에서 더 회화적인 질감까지 올릴 수 있다.

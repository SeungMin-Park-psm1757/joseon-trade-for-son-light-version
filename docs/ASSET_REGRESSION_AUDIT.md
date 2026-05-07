# Junior Asset Regression Audit

이번 감사의 기준은 새 그림 생성이 아니라 **이전 승인 자산 보존**과 **퇴화 자산 선별 제거**다.

## Summary

- `approved_keep_assets`: 기존 2D 일러스트풍 WEBP/PNG 자산을 잠금 처리했다.
- `replace_bad_assets`: 최근 추가된 단순 SVG 도시 배경, SVG 상품, SVG 배, generated route PNG, CSS 도형형 이동 배경을 교체 또는 제거했다.
- 승인 잠금 파일: `docs/APPROVED_ASSET_LOCK.json`
- before/after 스크린샷: `.logs/visual-regression-repair/`

## Audit Table

| asset path | current status | reason | target replacement source | severity |
|---|---|---|---|---|
| `junior-game/public/assets/maps/korea-approved-map.webp` | keep | 한반도 해안선, 산맥, 바다, 제주가 가장 자연스러운 승인 지도 | `starter/public/assets/painted2d/maps/korea-route-map.webp` | critical |
| `junior-game/public/assets/maps/korea-light-map.svg` | replace | 단순화된 SVG 지도라 blob/도형 느낌이 강함 | removed; replaced by `korea-approved-map.webp` | critical |
| `junior-game/public/assets/scenes/busan-port.webp` | keep | 항구/배/장터 느낌이 살아 있는 승인 배경 | keep | critical |
| `junior-game/public/assets/scenes/daegu-town.webp` | keep | 내륙 장터와 마을감이 있는 승인 배경 | keep | high |
| `junior-game/public/assets/scenes/east-port.webp` | keep | 동해 항구/산지 배경으로 재사용 가치 높음 | keep | high |
| `junior-game/public/assets/scenes/inland-city.webp` | keep | 내륙 도시/성문/장터 화면의 승인 배경 | keep | high |
| `junior-game/public/assets/scenes/jeju.webp` | keep | 제주/섬/바닷길 표현이 선명한 승인 배경 | keep | high |
| `junior-game/public/assets/scenes/market-street.webp` | keep | 장터/상업 도시 화면에 적합 | keep | high |
| `junior-game/public/assets/scenes/south-port.webp` | keep | 남해 항구/배 이동에 적합 | keep | high |
| `junior-game/public/assets/scenes/west-mudflat.webp` | keep | 서해/목포/강가 길에 적합 | keep | high |
| `junior-game/public/assets/cities/*.svg` | replace | 도시별 고유성을 주려 했으나 도형/SVG 임시 배경처럼 보임 | removed; city scenes restored to `assets/scenes/*.webp` | critical |
| `junior-game/public/assets/goods/cotton_cloth.png` | keep | 작은 카드에서도 면포로 읽히는 승인 PNG | keep | high |
| `junior-game/public/assets/goods/dried_fish.png` | keep | 건어물 식별성이 좋음 | keep | high |
| `junior-game/public/assets/goods/salt.png` | keep | 소금 아이콘으로 명확함 | keep | high |
| `junior-game/public/assets/goods/paper.png` | keep | 한지/종이 식별성이 좋음 | keep | high |
| `junior-game/public/assets/goods/citrus.png` | keep | 귤 아이콘으로 바로 읽힘 | keep | high |
| `junior-game/public/assets/goods/fresh_fish.png` | keep | 생선 실루엣이 명확함 | keep | high |
| `junior-game/public/assets/goods/herbs.png` | keep | 약초로 읽히는 승인 PNG | keep | high |
| `junior-game/public/assets/goods/rice.png` | keep | 쌀 아이콘으로 명확함 | keep | high |
| `junior-game/public/assets/goods-v2/*.svg` | replace | PNG 승인본보다 단순하고 카드에서 가벼워 보임 | removed; `assets/goods/*.png` restored | critical |
| `junior-game/public/assets/vehicles/junior-cart-bundle.png` | keep | 기존 수레 승인본, 단순 SVG보다 완성도 높음 | keep | high |
| `junior-game/public/assets/vehicles/junior-cart-handcart.png` | keep | 수레 구조가 명확하고 게임 오브젝트로 읽힘 | keep | high |
| `junior-game/public/assets/vehicles/junior-cart-large.png` | keep | 성장 단계가 보이는 승인 수레 | keep | high |
| `junior-game/public/assets/vehicles/junior-cart-merchant.png` | keep | 장사용 상위 수레로 구분 가능 | keep | high |
| `junior-game/public/assets/boats/small_ferry.png` | keep | full mode 승인 선박 PNG 기반 | copied from `ship-tier-1.png` | critical |
| `junior-game/public/assets/boats/sailboat.png` | keep | full mode 승인 선박 PNG 기반 | copied from `ship-tier-2.png` | critical |
| `junior-game/public/assets/boats/sturdy_sailboat.png` | keep | full mode 승인 선박 PNG 기반 | copied from `ship-tier-3.png` | critical |
| `junior-game/public/assets/boats/merchant_ship.png` | keep | full mode 승인 선박 PNG 기반 | copied from `ship-tier-4.png` | critical |
| `junior-game/public/assets/boats/*.svg` | replace | 배가 단순 아이콘처럼 보여 장비 성장감이 약함 | removed; PNG ships restored | critical |
| `junior-game/public/assets/routes/*.png` | replace | generated route cutscene이 단순 도형 산/길 중심으로 퇴화 | removed; route scenes now use approved `assets/scenes/*.webp` | critical |
| `junior-game/public/assets/events/book.svg` | keep | fallback/장부 상징용으로 제한 사용 | keep but locked as utility, not scene art | medium |
| `junior-game/public/assets/events/ending_door.svg` | keep | 엔딩 상징용으로 제한 사용 | keep but follow-up polish possible | medium |
| `junior-game/public/assets/events/bandit.svg` | replace | 전면 컷인으로 쓰기에는 SVG 아이콘감이 강함 | removed; event backgrounds mapped to approved scenes | high |
| `junior-game/public/assets/events/pirate.svg` | replace | 해적 이벤트 컷인 품질 편차 발생 | removed; event backgrounds mapped to approved scenes | high |
| `junior-game/public/assets/events/animal.svg` | replace | 동물/호랑이 이벤트가 임시 아이콘처럼 보임 | removed; event backgrounds mapped to approved scenes | high |
| `junior-game/public/assets/events/merchant.svg` | replace | 상인 컷인이 장터 배경보다 약함 | removed; event backgrounds mapped to `market-street.webp` | high |
| `junior-game/public/assets/events/rain.svg` | replace | 날씨 컷인이 단순 벡터감 | removed; mapped to `west-mudflat.webp` | medium |
| `junior-game/public/assets/events/wind.svg` | replace | 순풍 컷인이 단순 벡터감 | removed; mapped to `south-port.webp` | medium |
| `junior-game/public/assets/jeongwoo/jeongwoo.png` | keep | 정우 캐릭터 승인 자산 | keep | critical |
| `junior-game/public/assets/fairy/fairy-default.png` | keep | 요정 기본 승인 자산 | keep | critical |
| `junior-game/public/assets/fairy/fairy-happy.png` | keep | 요정 기쁨 승인 자산 | keep | critical |
| `junior-game/src/juniorStyles.css` travel CSS layers | replace | CSS 산/강/파도 도형이 route art를 가리고 임시 느낌을 냄 | hidden; approved scene art used as primary background | critical |
| `junior-game/src/juniorStyles.css` cargo empty dashed slots | replace | 점선 placeholder처럼 보임 | solid soft slots | medium |
| `junior-game/scripts/generate-art-pack.mjs` | replace | 퇴화한 SVG city/goods/boat/event 생성 경로 | removed | critical |
| `junior-game/scripts/generate-route-cutscenes.mjs` | replace | 퇴화한 route PNG 생성 경로 | removed | critical |

## Approved Keep Assets

승인 자산은 `docs/APPROVED_ASSET_LOCK.json`에 고정했다. 후속 작업에서 더 좋은 후보가 있어도 먼저 감사 문서와 비교 스크린샷으로 승격해야 한다.

## Replacement Result

- 지도: SVG 지도에서 approved WEBP 지도 중심으로 복구.
- 도시 배경: 도시 SVG 제거, 승인 WEBP scene 복구.
- 상품: `goods-v2` SVG 제거, 승인 PNG 상품 복구.
- 배: SVG 제거, full mode 승인 선박 PNG 복구.
- 이동: generated route PNG 제거, 승인 scene WEBP를 primary travel art로 사용.
- 장터: 상품 아이콘 크기 확대, 빈 짐칸 점선 제거.

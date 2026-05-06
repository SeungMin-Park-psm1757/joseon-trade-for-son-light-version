# Junior Cart Asset Replacement

Date: 2026-05-05

## 1. 변경 요약

- junior-game의 임시 수레 그림을 2D 동화풍 수레 PNG 4종으로 교체했다.
- 생성 이미지는 체크 배경이 포함된 RGB 원본이어서, 알파 배경을 후처리하고 512x512 RGBA PNG로 저장했다.
- 장터, 가게, 이동 화면에서 새 수레를 실제로 사용하도록 연결했다.

## 2. 새 에셋

- `junior-game/public/assets/vehicles/junior-cart-bundle.png`
- `junior-game/public/assets/vehicles/junior-cart-handcart.png`
- `junior-game/public/assets/vehicles/junior-cart-large.png`
- `junior-game/public/assets/vehicles/junior-cart-merchant.png`

## 3. 적용 화면

- 장터: 현재 수레를 장터 헤더에 작게 표시.
- 가게: 손수레, 큰 수레, 장사 수레 카드에 각각 전용 그림 표시.
- 이동: 현재 운반 수단 그림으로 이동 연출 표시.

## 4. 게임 데이터

- `JuniorVehicle.image` 필드를 추가했다.
- `merchant_cart`를 추가해 네 번째 수레 에셋도 실제 성장 카드로 사용한다.
- 장사 수레는 240냥, 짐칸 5칸이다.

## 5. 테스트 결과

- `cd junior-game && npm run build`: 통과.
- `cd junior-game && npm run test`: 28 passed.
- 390x844 스크린샷 계측: 장터, 가게, 이동 화면 모두 viewport 안에 들어옴.

## 6. 스크린샷

경로: `.logs/screenshots/junior-cart-assets-2026-05-05/`

- `01-cart-contact-sheet.png`
- `02-market-cart.png`
- `03-shop-carts.png`
- `04-travel-cart.png`

## 7. 검수 결과

- 그림판 임시 그림처럼 보이지 않음: Pass.
- 수레 형태가 바로 이해됨: Pass.
- 작은 크기에서도 바퀴와 짐칸 실루엣이 읽힘: Pass.
- 상품/배/도시 카드와 톤이 조화로움: Pass.
- 라이트모드의 밝은 2D 동화풍 방향과 맞음: Pass.

## 8. 남은 한계

- 배 에셋은 이번 범위가 아니어서 기존 `result-ship.png`를 계속 사용한다.
- 추후 수레 단계별 간단한 반짝임/구매 연출을 추가하면 성장감이 더 좋아진다.

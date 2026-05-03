# 모바일 smoke test 명세

Codex가 `starter/tests/smoke.spec.ts`를 구현하거나 수정할 때 참고할 테스트 명세입니다.

## 테스트 1. 시작 화면

- 앱 접속
- `new-game-button`이 보인다.
- 새 게임 시작
- `status-current-port`가 부산포 또는 시작 항구를 표시한다.

## 테스트 2. 시장 구매

- `tab-market` 클릭
- 첫 구매 가능한 상품의 `buy-button-{goodId}` 클릭
- 보유금 또는 화물량이 변한다.
- `autosave-indicator` 또는 최근 로그가 보인다.

## 테스트 3. 이동

- `tab-map` 클릭
- 이동 가능한 `travel-button-{routeId}` 중 하나 클릭
- 이동 확인/실행
- 현재 위치 또는 날짜가 변한다.

## 테스트 4. 저장 복구

- 새로고침
- `continue-button` 클릭
- 이전 위치/돈/화물 상태가 유지된다.

## 테스트 5. 대마도 제한

- 왜관 허가장이 없는 상태에서 대마도 루트를 선택한다.
- 진입 제한 또는 경고가 표시된다.

## 테스트 6. 모바일 레이아웃

- viewport 390 × 844
- `body` 또는 앱 루트에 가로 스크롤이 없어야 한다.
- 하단 탭이 보이고 클릭 가능해야 한다.

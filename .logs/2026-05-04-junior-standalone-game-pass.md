# 2026-05-04 Junior Standalone Game Pass

## 1. 별도 폴더 구조

- `junior-game/`을 별도 Vite + React + TypeScript 앱으로 구성했다.
- full mode의 `starter/src/App.tsx`, `starter/src/types.ts`, `starter/src/main.tsx`에서 junior import와 `gameMode` 연결을 제거했다.
- junior 전용 코드는 `junior-game/src/`에 두고, 자산은 `junior-game/public/assets/` 아래 `goods`, `fairy`, `jeongwoo`, `scenes`, `ui`, `vehicles`로 분리했다.
- CSS는 `.junior-*` prefix만 사용한다.

## 2. 라이트모드 플로우

고정 6단계로 구현했다.

1. 조선에 도착
2. 물건 고르기
3. 물건 사기
4. 다른 마을로 가기
5. 물건 팔기
6. 성공 칭찬 받기

상품은 면포, 건어물, 소금 3개만 보인다.

## 3. 세로형 UX 구현 방식

- 기준 화면은 `390x844`, `412x915`, `430x932` portrait다.
- portrait에서 회전 안내 없이 바로 플레이된다.
- 상단은 정우와 돈, 중앙은 큰 그림/상품 카드, 하단은 큰 버튼 1개로 구성했다.
- 성공 화면만 `또 하기`, `큰 모험 보기` 2개 버튼을 둔다.
- `844x390` landscape에서도 깨지지 않도록 축약 배치를 추가했다.

## 4. 요정 대화 방식

- 요정 얼굴과 말풍선을 모든 단계의 첫 읽기 요소로 배치했다.
- 문장은 한 화면 1~2개로 제한했다.
- “정우야”를 사용해 친구가 말하는 느낌으로 안내한다.
- 시스템 문체와 긴 튜토리얼 문단은 쓰지 않았다.

## 5. 성공 연출

- 성공 화면에 웃는 정우, 기쁜 요정, 커지는 돈주머니, 별 3개, `첫 장사 성공!` 배지를 배치했다.
- `팔기` 버튼을 누르면 짧은 Web Audio 성공음이 재생된다.
- 첫 버전에는 실패, 손해, 위험을 넣지 않았다.

## 6. 저장 분리 방식

- full mode 저장 키 `joseon_trade_save_v1`은 유지한다.
- junior game은 별도 키 `joseon_trade_junior_save_v1`을 사용한다.
- junior 저장 내용은 `currentStep`, `selectedGoodId`, `coins`, `completedRuns`, `badges`, `hasSeenIntro`만 포함한다.

## 7. 테스트 결과

- `cd junior-game && npm run build`: 통과.
- `cd junior-game && npm run test`: 12개 통과.
  - `390x844` portrait
  - `412x915` portrait
  - `430x932` portrait
  - `844x390` landscape
- `cd starter && npm run validate:data`: 통과.
- `cd starter && npm run audit:consistency`: 통과.
- `cd starter && npm run build`: 통과.
- `cd starter && npm run test:smoke`: 7개 통과.
- `cd starter && npm run test:visual`: 통과.

## 8. 스크린샷 경로

- `.logs/junior-standalone-game-2026-05-04/portrait-arrive-390x844.png`
- `.logs/junior-standalone-game-2026-05-04/portrait-pick-390x844.png`
- `.logs/junior-standalone-game-2026-05-04/portrait-success-390x844.png`
- `.logs/junior-standalone-game-2026-05-04/landscape-success-844x390.png`

## 9. 남은 한계

- junior 자산은 기존 painted2d 자산 중 품질이 맞는 이미지를 junior 폴더로 복사해 사용했다. 완전 신규 원화 세트는 아니다.
- `큰 모험 보기`는 full mode로 이동하는 링크 역할만 하며, 배포 경로가 정해지면 실제 URL을 확정해야 한다.
- 성공음은 Web Audio 기반 짧은 효과음이며, 별도 음원 파일은 아직 없다.

## 10. 다음 추천 작업

- junior 전용 정우 웃는 표정과 요정 표정 변형을 추가한다.
- `큰 모험 보기`의 배포 URL을 환경 변수 또는 런처 페이지와 연결한다.
- 성공 배지를 모으는 스티커판을 실패 없는 확장 목표로 붙인다.

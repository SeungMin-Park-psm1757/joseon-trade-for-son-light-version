# 2026-04-27 진행도/장부/시장 UX 안정화 로그

## 작업 내용

- `GameState`에 `ledger`, `questProgress`, `questNotices`, `cargoCost`, `lastEventResult`, `lastMonthNews`를 추가했다.
- 기존 저장 데이터가 새 필드를 갖지 않아도 `normalizeState`에서 기본값을 채워 이어하기가 깨지지 않게 했다.
- 구매/판매/이동/어업을 구조화된 기록으로 저장하고, 의뢰 완료 판정을 텍스트 로그 검색에서 상태 기반 진행도로 교체했다.
- 튜토리얼 의뢰 3개(`tutorial_first_trade`, `salt_to_daegu`, `fish_for_inland`)가 실제 거래 행동으로 완료되도록 구현했다.
- 시장에 수량 `- / +`, 예상 금액, 가격 라벨, 부족 사유, 보유/화물 정보를 추가했다.
- 월별 소식 카드와 이벤트 결과 모달, 의뢰 완료 보상 모달을 추가했다.
- Playwright smoke test 포트를 5174로 분리해 기존 dev server와 충돌하지 않게 했다.

## 검증

- 원본 `starter/`에서 `npm run validate:data`: 통과.
- 원본 `starter/`에서 `npm install --no-audit --prefer-online`: Google Drive 경로 파일 쓰기 문제(`EBADF`, `EPERM`)로 실패. 남은 partial `node_modules`는 삭제했다.
- 동일 소스를 `%TEMP%/joseon-trade-run-1777274499585`에 복사해 `npm install`, `npm run build`, `npm run test:smoke` 실행: 통과.
- Playwright 390px 수동 흐름 확인:
  - 새 게임
  - 면포 2개 구매
  - 부산포 → 대구 이동
  - 이벤트 처리
  - 면포 판매 후 첫 장사 완료
  - 소금 5개 구매/판매 후 소금 납품 완료
  - 건어물 4개 구매/판매 후 건어물 장사 완료
  - 장부 항목 저장 확인
  - 새로고침 후 이어하기로 완료 의뢰와 위치 유지 확인
  - 가로 스크롤 없음

## 남은 한계

- 첫 3개 의뢰는 안정화했지만, 후속 의뢰 타입(`deliver`, `ownCart`, `repairShip`, `surviveCombat`)은 아직 완전한 objective resolver가 아니다.
- 시장 재고는 “구매 가능” 수준의 MVP 표시이며 항구별 실제 재고 수량 시뮬레이션은 없다.
- 원본 저장소 경로가 Google Drive라 npm 패키지 압축 해제가 불안정하다. 개발 실행은 로컬 비동기 동기화가 없는 경로에서 하는 편이 안전하다.

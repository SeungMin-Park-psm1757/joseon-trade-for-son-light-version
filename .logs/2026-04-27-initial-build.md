# 2026-04-27 최초 빌드 작업 로그

## 작업 내용

- `prompts/01_initial_build_prompt.md`와 필수 문서를 기준으로 `starter/` 앱 구현을 시작했다.
- `public/data/*.json`를 fetch로 로드하고, 항구/상품/루트/이벤트/의뢰 데이터를 화면과 계산에 사용하도록 구현했다.
- 새 게임/이어하기, LocalStorage 자동 저장, 상단 상태바, 하단 탭, 지도, 시장, 화물 장부, 장비, 의뢰/도감 화면을 추가했다.
- 월별 가격표 생성, 구매/판매, 이동 가능 루트, 대마도 허가장 제한, 이동 이벤트, 간단 자동 전투, 어업, 배/수레 구매를 MVP 범위로 구현했다.
- `src/vite-env.d.ts`를 추가해 Vite CSS import 타입 선언을 보강했다.

## 검증

- `npm run validate:data`: 통과.
- Google Drive 경로의 `node_modules` 쓰기 오류로 `starter/` 직접 `npm install`은 실패했다.
- 동일 소스를 `%TEMP%/joseon-trade-run`에 복사해 `npm install`, `npm run build`, `npm run test:smoke`를 실행했다.
- Temp 복사본 기준 `npm run build`: 통과.
- Temp 복사본 기준 `npm run test:smoke`: 2개 통과.
- Playwright 390px viewport 수동 흐름: 새 게임, 면포 구매, 부산포에서 대구 이동, 판매, 새로고침 후 이어하기 복구 확인. 가로 스크롤 없음.

## 알려진 이슈

- 현재 의뢰 완료 판정은 MVP용 단순 로그 기반이다. 후속 단계에서 objective별 진행 카운터를 별도 상태로 분리하는 것이 좋다.
- 작업 환경의 Google Drive 경로에서 npm 패키지 압축 해제 중 `EBADF`/`EPERM`이 발생해 의존성 설치가 깨진다. 앱 코드는 Temp 복사본에서 검증했다.

# 2026-04-28 Context, Roadmap, CI Audit Pass

## 1. 변경 요약

- 현재 대화/작업 맥락을 `docs/CURRENT_CONTEXT.md`로 압축했다.
- 향후 작업 큐를 `docs/NEXT_WORK_ROADMAP.md`에 12개 우선순위로 정리했다.
- `starter/scripts/audit-consistency.mjs`를 추가해 데이터, 에셋, 문서, package script 일관성을 점검한다.
- `.github/workflows/ci.yml`을 추가해 GitHub Actions에서 validate/audit/build/smoke/visual 순서로 검증하도록 했다.
- `AGENTS.md`와 `PLAN.md`의 오래된 세로 기준 지침에 2026-04-28 가로형 게임 방향 보정 섹션을 추가했다.

## 2. 컨텍스트 압축 방식

- 최신 방향은 가로형 모바일 픽셀아트 웹게임으로 명시했다.
- 핵심 시스템은 교역/이동/저장/의뢰/objective resolver/항구 핫스팟/장터/NPC/지도/선박 정박/사운드까지 요약했다.
- 런타임 데이터는 `starter/public/data/*.json`, 루트 미러는 `data/*.json`로 정리했다.
- Google Drive 경로의 `node_modules/.bin` 및 Playwright package config 문제가 있을 때 temp copy 검증을 표준 우회로로 기록했다.

## 3. 향후 작업 리스트

`docs/NEXT_WORK_ROADMAP.md`에 다음 흐름으로 정리했다.

1. 항구별 개성 완성
2. 시장 UI 추가 단순화
3. 장기 성장 지도
4. 이벤트 연출 강화
5. 배/수레 성장 연출
6. 배 호출 서비스 고도화
7. 사운드 2차 패스
8. 도감/수집 요소
9. 월별 계절감
10. 저장/가족 플레이 편의
11. 시각 회귀 테스트
12. 데이터 밸런스 패스

## 4. 일관성 감사 방식

`npm run audit:consistency`는 다음을 확인한다.

- `starter/public/data/*.json`와 `data/*.json` 미러 일치
- 모든 상품 iconAsset 파일 존재
- 모든 항구 sceneAsset 파일 존재
- `port_flavors.json`이 모든 항구를 덮고 market slot goodId가 유효함
- route endpoint와 mode 유효성
- quest objective의 good/port/cart/ship 참조 유효성
- result icon PNG 존재
- continuity 문서 존재
- package script 존재

첫 실행에서 `port_flavors.json`이 `portId`가 아니라 `id`를 쓰는 실제 구조와 감사 규칙이 어긋나는 오류를 잡았고, 앱 구조에 맞게 감사 규칙을 수정했다.

## 5. GitHub Actions 방식

`.github/workflows/ci.yml`:

- Node 22
- `npm ci`
- `npm run validate:data`
- `npm run audit:consistency`
- `npm run build`
- `npm run test:smoke`
- `npm run test:visual`
- 실패 여부와 무관하게 visual screenshot artifact 업로드

`starter/scripts/visual-check.mjs`는 `BASE_URL`이 없으면 자체적으로 Vite dev server를 시작한 뒤 844x390, 932x430 화면을 캡처하고 가로 스크롤을 실패 처리한다.

## 6. 테스트 결과

원본 workspace:

- `npm run validate:data`: 성공
- `npm run audit:consistency`: 성공, 단 로컬 `.git` 없음 경고
- `npm run test:smoke`: 성공
- `npm run build`: 실패. Google Drive 경로의 `node_modules/.bin` tsc 실행 문제
- `npm run test:visual`: 실패. 원본 `node_modules/@playwright/test/package.json` package config 읽기 문제

Temp copy:

- 경로: `C:\Users\QuIC\AppData\Local\Temp\joseon-trade-context-ci-pass`
- `npm install`: 성공
- `npm run validate:data`: 성공
- `npm run audit:consistency`: 성공, 단 `.git` 없음 경고
- `npm run build`: 성공
- `npm run test:smoke`: 성공, 3 passed
- `npm run test:visual`: 성공

## 7. 스크린샷

Temp copy에서 생성한 visual smoke screenshot을 원본에 복사했다.

- `.logs/visual-regression-current/port.png`
- `.logs/visual-regression-current/market.png`
- `.logs/visual-regression-current/map.png`
- `.logs/visual-regression-current/quests.png`
- `.logs/visual-regression-current/vehicles.png`
- `.logs/visual-regression-current/cargo.png`
- `.logs/visual-regression-current/market-932.png`

## 8. 남은 한계

- 현재 로컬 workspace는 `.git` 폴더가 없어 실제 GitHub status/diff 검사는 할 수 없다.
- 원본 Google Drive 경로의 `node_modules`는 빌드와 visual test에 불안정하다. CI 또는 temp copy 검증을 신뢰한다.
- visual check는 아직 baseline diff가 아니라 smoke screenshot과 가로 스크롤 검출 단계다.

## 9. 다음 추천 작업

1. 항구별 고유 핫스팟 좌표와 장터 배치 데이터화.
2. visual regression baseline 비교 도입.
3. save slot metadata와 이어하기 화면 개선.

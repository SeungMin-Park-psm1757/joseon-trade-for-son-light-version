# 변경 내역

## 2026-04-27 — Codex use case 반영 업그레이드

### 추가

- `AGENTS.md`: Codex 작업 규칙, 검증, 로그, UI 반복 원칙
- `PLAN.md`: 플레이어 목표, 메인 루프, 입력, 승패, 진행, 시각 방향, milestone
- `.logs/README.md`: Codex 작업 로그 폴더
- `.prompts/README.md`: 이미지/반복 프롬프트 보관 폴더
- `docs/CODEX_OFFICIAL_WORKFLOW.md`: 공식 use case 반영 방식
- `docs/UI_ITERATION_GUIDE.md`: 작은 UI 변경 가이드
- `docs/BROWSER_PLAYTEST_PLAN.md`: 모바일 브라우저 플레이테스트 경로
- `docs/ARCHITECTURE_BLUEPRINT.md`: 권장 구현 구조와 data-testid
- `tests/MOBILE_SMOKE_TEST_SPEC.md`: smoke test 명세
- `prompts/06_granular_ui_change_prompt.md`: 작은 UI 변경 템플릿
- `prompts/07_browser_playtest_prompt.md`: 브라우저 플레이테스트 프롬프트
- `prompts/08_plan_update_prompt.md`: PLAN 업데이트 프롬프트
- `prompts/09_future_asset_generation_prompt.md`: 후속 이미지 생성/에셋 보강 프롬프트
- `starter/scripts/validate-data.mjs`: 데이터 JSON 검증 스크립트
- `starter/playwright.config.ts`: 모바일 Playwright smoke test 설정
- `starter/tests/smoke.spec.ts`: 초기 smoke test 뼈대

### 수정

- `README.md`: Codex 사용 순서를 계획 기반 흐름으로 개편
- `CODEX_TASK.md`: `PLAN.md`, `AGENTS.md`, 브라우저 검증, 작은 UI 변경 원칙 반영
- `prompts/01_initial_build_prompt.md`: 계획→구현→검증 흐름 강화
- `prompts/02_self_review_prompt.md`: 빌드/데이터/브라우저 검증 기준 강화
- `prompts/04_mobile_ui_polish_prompt.md`: 큰 리디자인 대신 작은 변경 반복 방식으로 조정
- `docs/SOURCES.md`: Codex 공식 use case 링크와 반영 원칙 추가
- `docs/DATA_SCHEMA.md`: `game_constants.json` 시작 상태 설명 추가
- `starter/package.json`: `validate:data`, `test:smoke` 스크립트와 Playwright/@types devDependency 추가
- `data/game_constants.json`, `starter/public/data/game_constants.json`: `startingState.currentPortId` 추가

### 검증

- `node starter/scripts/validate-data.mjs` 통과

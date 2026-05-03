# 팔도상단: 조선의 바람

조선 후기 한국형 교역 RPG를 모바일 웹앱으로 구현하는 Codex 작업 지침입니다.

## Tech Stack

- Vite + React + TypeScript
- CSS/SVG/HTML 기반 2D 모바일 UI
- LocalStorage 저장
- JSON 데이터: `starter/public/data/*.json`
- 초기 MVP에는 서버, 로그인, 결제, 멀티플레이를 넣지 않습니다.
- Phaser/PixiJS는 후속 확장 후보입니다. 1차 MVP는 교역 루프와 모바일 UI 완성이 우선입니다.

## Must-read files

작업 전 반드시 다음 파일을 읽으세요.

1. `PLAN.md`
2. `CODEX_TASK.md`
3. `docs/MVP_SCOPE.md`
4. `docs/SYSTEM_SPEC.md`
5. `docs/UI_SPEC.md`
6. `docs/CODEX_OFFICIAL_WORKFLOW.md`
7. `tests/ACCEPTANCE_CHECKLIST.md`

## Working rules

- 먼저 계획을 확인하고, 필요한 경우 `PLAN.md`를 업데이트한 뒤 구현하세요.
- 구현 작업은 `starter/` 안에서 진행하세요.
- 데이터 ID와 JSON 구조를 함부로 바꾸지 마세요.
- 항구/상품/루트/이벤트 데이터는 코드에 대량 하드코딩하지 마세요.
- 게임 루프를 해치는 큰 리디자인보다 작은 완성 단위를 우선하세요.
- 모바일 세로 화면 390px 폭을 기준으로 검증하세요.
- 작업 중 중요한 결정, 버그, 수정 내역은 `.logs/`에 기록하세요.
- 이미지 생성은 1차 MVP에서 기본 사용하지 않습니다. 사용자가 명시적으로 요청하거나 후속 단계에서만 사용하고, 프롬프트는 `.prompts/`에 저장하세요.
- 외부 무료 에셋을 실제 포함할 때는 `asset_plan/LICENSE_CHECKLIST.md`에 따라 라이선스를 확인하세요.

## Verification

기능 구현 또는 수정 후 가능한 범위에서 다음을 실행하세요.

```bash
cd starter
npm install
npm run validate:data
npm run build
npm run test:smoke
```

Codex 환경에 Playwright 또는 브라우저 테스트 도구가 있으면 앱을 실제 브라우저에서 열고 아래 흐름을 직접 확인하세요.

```text
새 게임 → 부산포 → 시장 구매 → 이동 → 이벤트 → 판매 → 자동 저장 → 새로고침 후 이어하기
```

## UI iteration rules

UI 수정 요청을 받으면 한 번에 하나의 작은 변경만 처리하세요.

- 바꿀 화면, viewport, 목표 변경을 먼저 확인합니다.
- 기존 컴포넌트, 상태 흐름, 데이터 구조를 보존합니다.
- 필요한 파일만 최소 수정합니다.
- 브라우저에서 변경 전후를 확인합니다.
- 변경 파일과 검증 내용을 짧게 보고합니다.

## Do not

- 1차 MVP에 중국 본토, 일본 본토, 항구 투자, 실시간 해전, 서버 저장을 넣지 마세요.
- 라이선스가 불명확한 에셋을 포함하지 마세요.
- 폰트 파일을 포함하지 마세요.
- UI 수정 중 게임 로직을 임의로 바꾸지 마세요.
- 성능 부담이 큰 실시간 경제 시뮬레이션을 만들지 마세요. 가격은 월별로 갱신합니다.

## 2026-04-28 direction update

- 현재 기본 UX 목표는 세로 모바일이 아니라 가로형 모바일 웹게임입니다.
- 핵심 검증 viewport는 844x390, 932x430입니다.
- 390x844 세로 화면은 가로 플레이 안내를 표시해도 됩니다.
- 현재 방향은 텍스트 앱이 아니라 픽셀아트 장면, 핫스팟, 장터, NPC, 지도 이동, 사운드가 중심인 게임 UI입니다.
- 교역, 이동, 저장, 의뢰, 선박 정박지, 사운드 설정 구조는 유지하면서 표현 완성도를 올립니다.
- 현재 검증 명령은 다음을 기준으로 합니다.

```bash
cd starter
npm run validate:data
npm run audit:consistency
npm run build
npm run test:smoke
npm run test:visual
```

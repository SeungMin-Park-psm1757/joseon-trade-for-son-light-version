# Codex 공식 use case 반영 메모

이 문서는 OpenAI Developers의 Codex use case 두 가지를 이 프로젝트에 맞게 적용한 작업 기준입니다.

참고 URL:

- https://developers.openai.com/codex/use-cases/browser-games
- https://developers.openai.com/codex/use-cases/make-granular-ui-changes

## 1. Browser game use case 적용

공식 use case의 핵심은 “게임 브리프를 바로 코드로 던지지 말고, 먼저 구체적인 게임 계획을 정의한 뒤 브라우저에서 테스트하며 반복한다”입니다. 이 프로젝트에서는 이를 다음처럼 반영합니다.

### 적용 사항

- 루트에 `PLAN.md`를 추가한다.
- 루트에 `AGENTS.md`를 추가해 Codex의 작업 규칙을 고정한다.
- Codex는 작업 전에 `PLAN.md`, `CODEX_TASK.md`, `docs/*`, `tests/*`를 읽는다.
- 구현 후 `npm run build`, `npm run validate:data`, `npm run test:smoke`를 실행한다.
- Codex 환경에 Playwright 또는 live browser 기능이 있으면 실제 모바일 viewport에서 플레이한다.
- 작업 로그를 `.logs/`에 남긴다.
- 향후 이미지 생성 프롬프트는 `.prompts/`에 저장한다.

## 2. Granular UI changes use case 적용

공식 use case의 핵심은 “기존 앱에서 작은 UI 변경을 한 번에 하나씩 처리하고, 브라우저에서 검증한 뒤 다음 변경으로 넘어간다”입니다. 이 프로젝트에서는 UI polish를 다음 방식으로 진행합니다.

### 적용 사항

- `prompts/06_granular_ui_change_prompt.md`를 추가한다.
- UI 수정은 한 번에 하나의 surface만 건드린다.
- 예: 지도 항구 버튼 크기, 시장 카드 간격, 하단 탭 sticky 처리, 이벤트 모달 높이 조정.
- UI 수정 중 게임 로직, 데이터 구조, 저장 키를 바꾸지 않는다.
- 변경 후 모바일 viewport에서 직접 확인한다.
- 변경 파일과 검증 내용을 짧게 보고한다.

## 3. 이 프로젝트에서의 우선순위

이 프로젝트의 기본 목적은 아드님이 즐길 수 있는 조선 무역 RPG 1차 프로토타입입니다. 따라서 공식 use case를 그대로 따라 “이미지 생성 기반 게임”으로 가기보다는, 다음 순서를 우선합니다.

```text
계획 명확화
→ 교역 루프 구현
→ 모바일 조작성 검증
→ 이벤트/어업/장비 보강
→ 작은 UI 수정 반복
→ 무료 2D 에셋 또는 이미지 생성 보강
```

## 4. Codex에게 기대하는 작업 방식

### 좋은 방식

- 먼저 현재 구조와 데이터 파일을 읽는다.
- `PLAN.md`의 milestone 순서대로 구현한다.
- 한 기능을 구현하면 바로 빌드 또는 브라우저로 확인한다.
- UI 수정은 작은 단위로 처리한다.
- 변경 이유를 `.logs/`에 남긴다.

### 피해야 할 방식

- 전체 앱을 한 번에 리디자인한다.
- 데이터 JSON을 무시하고 화면에 항구/상품을 하드코딩한다.
- 모바일 검증 없이 PC 화면 기준으로 끝낸다.
- 이미지 에셋 찾기에 시간을 먼저 쓴다.
- 중국/일본 본토, 항구 투자, 실시간 해전을 1차 MVP에 넣는다.

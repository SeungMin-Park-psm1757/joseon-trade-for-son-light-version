# 참고 소스와 기술 메모

이 문서는 Codex 또는 개발자가 기술 선택과 라이선스 판단을 할 때 참고하기 위한 링크 모음이다.

## OpenAI Codex 공식 문서

- OpenAI Developers — Codex: https://developers.openai.com/codex
- OpenAI Developers — Codex use case, Create browser-based games: https://developers.openai.com/codex/use-cases/browser-games
- OpenAI Developers — Codex use case, Make granular UI changes: https://developers.openai.com/codex/use-cases/make-granular-ui-changes
- OpenAI Developers — Codex CLI: https://developers.openai.com/codex/cli
- OpenAI Developers — Codex best practices: https://developers.openai.com/codex/learn/best-practices

## 이 프로젝트에 반영한 Codex 운영 원칙

- 브라우저 게임은 구현 전 `PLAN.md`로 목표, 루프, 입력, 승패, 진행, 시각 방향, 스택, milestone을 명확히 한다.
- `AGENTS.md`로 작업 규칙, 검증 명령, 로그 방식, 도구 사용 방식을 고정한다.
- 가능하면 Playwright 또는 live browser로 실제 게임을 플레이하며 검증한다.
- UI polish는 한 번에 하나의 작은 변경만 처리한다.
- 작은 UI 변경은 기존 컴포넌트, 데이터 흐름, 라우팅, 상태 구조를 보존한다.
- 이미지 생성은 후속 단계에서만 사용하고 프롬프트를 `.prompts/`에 보관한다.

## 웹게임/프론트엔드

- Phaser 공식 사이트: https://phaser.io/
- Phaser Docs: https://docs.phaser.io/
- PixiJS: https://pixijs.com/
- Tiled JSON Map Format: https://doc.mapeditor.org/en/stable/reference/json-map-format/
- MDN localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Playwright: https://playwright.dev/

## 무료 에셋

- Kenney Assets: https://kenney.nl/assets
- Kenney Support / CC0 안내: https://kenney.nl/support
- OpenGameArt: https://opengameart.org/
- Game-icons.net: https://game-icons.net/

## 사용 원칙

- 이 패키지에는 외부 에셋 파일을 직접 포함하지 않았다.
- Codex는 우선 임시 도형/아이콘/텍스트 기반 UI로 구현한다.
- 이후 무료 에셋을 도입할 때는 각 에셋의 라이선스를 확인한다.
- Kenney 에셋은 공식 지원 문서 기준으로 게임 에셋이 CC0로 안내되지만, 실제 프로젝트 반영 시 각 다운로드 페이지와 포함 license 파일을 함께 확인한다.

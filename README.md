# 팔도상단: 조선의 바람 — Codex 투입용 ZIP 패키지

작성일: 2026-04-27  
업그레이드: Codex 공식 use case 중 **browser-based games**와 **granular UI changes** 흐름을 반영

이 패키지는 **모바일 웹앱 기반 조선 후기 무역 RPG 1차 프로토타입**을 Codex가 바로 개발할 수 있도록 만든 작업 묶음입니다.

## 개발 목표

> 한국 남부·제주·대마도 지도에서 항구를 이동하며, 상품을 사고팔고, 월별 가격 변동과 위험 이벤트를 겪고, 돈을 벌어 배와 수레를 사는 게임 루프를 구현한다.

## 핵심 결정사항

- 플랫폼: 모바일 웹앱 중심
- 시대: 조선 후기 상업 성장기
- 지도: 대한민국 남부·중부 + 제주 + 대마도
- 해외: 첫 버전은 대마도까지만, 중국·일본 본토는 후속 확장
- 경제: 실시간 시뮬레이션이 아니라 **월별 가격 갱신**
- 전투: 초기에는 자동/선택지형 간단 전투
- 어업: 교역보다 효율 낮은 보조 수입
- 저장: 브라우저 `localStorage` 자동 저장
- 그래픽: 무료 2D 에셋 우선, 부족하면 임시 UI/아이콘으로 대체
- 항구 투자: 첫 버전 제외

## 이번 업그레이드의 핵심

기존 패키지는 “Codex에게 구현을 맡기는 문서 묶음”이었다면, 이번 버전은 다음이 강화되었습니다.

1. `PLAN.md` 추가: 게임 목표, 메인 루프, 입력, 승패, milestone을 Codex가 먼저 읽도록 구성
2. `AGENTS.md` 추가: Codex 작업 규칙, 검증 명령, UI 반복 원칙 고정
3. live browser/Playwright 검증 기준 추가
4. 작은 UI 변경용 프롬프트 추가
5. `.logs/`, `.prompts/` 작업 기록 구조 추가
6. 데이터 검증 스크립트와 smoke test 뼈대 추가
7. 모바일 브라우저 플레이테스트 계획 추가

## ZIP 구성

```text
joseon-trade-codex-pack/
├─ README.md
├─ AGENTS.md
├─ PLAN.md
├─ CODEX_TASK.md
├─ docs/
│  ├─ GAME_DESIGN.md
│  ├─ MVP_SCOPE.md
│  ├─ SYSTEM_SPEC.md
│  ├─ DATA_SCHEMA.md
│  ├─ UI_SPEC.md
│  ├─ IMPLEMENTATION_PLAN.md
│  ├─ ARCHITECTURE_BLUEPRINT.md
│  ├─ BROWSER_PLAYTEST_PLAN.md
│  ├─ UI_ITERATION_GUIDE.md
│  ├─ CODEX_OFFICIAL_WORKFLOW.md
│  └─ SOURCES.md
├─ data/
├─ prompts/
│  ├─ 01_initial_build_prompt.md
│  ├─ 02_self_review_prompt.md
│  ├─ 03_playtest_fix_prompt.md
│  ├─ 04_mobile_ui_polish_prompt.md
│  ├─ 05_data_balance_prompt.md
│  ├─ 06_granular_ui_change_prompt.md
│  ├─ 07_browser_playtest_prompt.md
│  ├─ 08_plan_update_prompt.md
│  └─ 09_future_asset_generation_prompt.md
├─ asset_plan/
├─ tests/
├─ .logs/
├─ .prompts/
└─ starter/
```

## Codex 사용 순서

### 1차 구현

1. ZIP 압축을 풉니다.
2. Codex에 `prompts/01_initial_build_prompt.md`를 붙여넣습니다.
3. Codex가 `AGENTS.md`와 `PLAN.md`를 먼저 읽게 합니다.
4. `starter/` 안에 실제 앱을 구현하게 합니다.
5. 구현 후 아래 명령 검증을 요구합니다.

```bash
cd starter
npm install
npm run validate:data
npm run build
npm run test:smoke
```

### 2차 자가검토

`prompts/02_self_review_prompt.md`를 사용합니다.

### 플레이테스트

`prompts/07_browser_playtest_prompt.md`를 사용합니다.

### 작은 UI 수정

`prompts/06_granular_ui_change_prompt.md`를 사용합니다. 한 번에 하나의 UI 문제만 지시하는 방식이 좋습니다.

## 권장 구현 방향

1차 MVP는 Phaser보다 **Vite + React + TypeScript + SVG/HTML 지도**가 적합합니다. 이유는 다음과 같습니다.

- 모바일 UI와 시장/장부/창고 화면을 빠르게 만들 수 있습니다.
- 데이터 JSON 중심 구조가 Codex에게 명확합니다.
- 게임 루프가 완성된 뒤 Phaser나 Canvas 기반 맵으로 확장할 수 있습니다.
- 외부 서버 없이 `localStorage`로 저장 가능합니다.

## 최우선 완성 기준

그래픽 완성도보다 아래 루프가 먼저입니다.

```text
지도 → 항구 선택 → 이동 → 이벤트 → 시장 구매/판매 → 월 변경 → 가격 갱신 → 저장 → 배/수레 구매
```

## 참고

공식 Codex browser game use case는 먼저 구체적인 `PLAN.md`를 만들고, `AGENTS.md`로 작업 규칙을 주며, 브라우저 테스트와 반복을 활용하는 흐름을 권장합니다. 공식 granular UI changes use case는 기존 앱에서 작은 UI 변경을 한 번에 하나씩 처리하고 브라우저로 검증하는 방식을 권장합니다. 이 패키지는 그 흐름을 조선 무역 RPG MVP 목적에 맞게 변형했습니다.

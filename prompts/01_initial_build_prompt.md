# Codex 최초 빌드 프롬프트 — 계획 기반 브라우저 게임 구현

이 저장소를 읽고 `starter/` 폴더 안에 실행 가능한 모바일 웹앱 프로토타입을 구현해 주세요.

## 먼저 할 일

1. `AGENTS.md`를 읽고 작업 규칙을 따르세요.
2. `PLAN.md`를 읽고 milestone 순서를 확인하세요.
3. 필요한 경우 구현 전 `PLAN.md`를 짧게 보완하되, MVP 범위는 넓히지 마세요.
4. 작업 로그를 `.logs/`에 남기세요.
5. Codex 환경에 `$playwright-interactive` 또는 브라우저 검증 도구가 있으면 구현 후 실제 모바일 viewport에서 플레이 흐름을 확인하세요.

## 프로젝트

- 제목: 팔도상단: 조선의 바람
- 장르: 조선 후기 무역 RPG
- 플랫폼: 모바일 웹앱
- 스택: Vite + React + TypeScript
- 저장: LocalStorage
- 데이터: `starter/public/data/*.json`
- 1차 목표: 교역 루프 완성

## 가장 중요한 목표

그래픽보다 **교역 루프**를 먼저 완성하세요.

```text
새 게임 → 부산포 시작 → 시장 구매 → 지도 이동 → 이벤트 → 판매 → 돈 증가 → 월별 가격 갱신 → 저장 → 배/수레 구매
```

## 반드시 읽을 문서

1. `AGENTS.md`
2. `PLAN.md`
3. `CODEX_TASK.md`
4. `docs/MVP_SCOPE.md`
5. `docs/SYSTEM_SPEC.md`
6. `docs/DATA_SCHEMA.md`
7. `docs/UI_SPEC.md`
8. `docs/ARCHITECTURE_BLUEPRINT.md`
9. `docs/BROWSER_PLAYTEST_PLAN.md`
10. `tests/ACCEPTANCE_CHECKLIST.md`

## 구현 요구사항

- 데이터 JSON을 코드에 대량 하드코딩하지 마세요.
- 모바일 세로 화면을 우선하세요.
- 한국어 UI를 사용하세요.
- 처음 실행 시 새 게임과 이어하기를 보여주세요.
- 새 게임은 `game_constants.json`의 `startingState`를 사용하세요.
- 가격표는 월별로 생성하고 저장하세요.
- 월이 바뀌면 가격표를 갱신하세요.
- 현재 위치에서 연결된 루트만 이동 가능하게 하세요.
- 구매/판매 시 화물칸과 보유금을 검사하세요.
- 이동 시 위험 이벤트가 발생할 수 있어야 합니다.
- 최소 이벤트: 갯벌 좌초, 암초, 태풍, 도적, 해적, 관아 검문, 순풍.
- 어업 기능을 구현하되 교역보다 수익이 낮게 하세요.
- 대마도는 왜관 허가장 없이는 진입 불가 또는 강한 경고가 필요합니다.
- 거래/이동/이벤트 후 자동 저장하세요.
- 핵심 UI 요소에는 `docs/ARCHITECTURE_BLUEPRINT.md`의 `data-testid`를 붙이세요.

## 이미지와 에셋

- 1차 구현에서는 이미지 생성이나 외부 에셋 다운로드에 시간을 쓰지 마세요.
- CSS, SVG, 이모지, 간단한 도형으로 먼저 플레이 가능하게 만드세요.
- 이미지 생성 또는 무료 에셋 적용은 후속 단계에서만 진행하세요.

## 구현 후 검증

다음을 실행하세요.

```bash
cd starter
npm install
npm run validate:data
npm run build
npm run test:smoke
```

브라우저 검증이 가능하면 다음 흐름을 직접 테스트하세요.

```text
새 게임 → 부산포 → 시장에서 상품 구매 → 연결 루트 이동 → 이벤트 처리 → 도착지 판매 → 새로고침 → 이어하기
```

## 완료 보고

완료 후 다음을 요약하세요.

- 구현된 기능
- 실행 방법
- 실행한 검증 명령과 결과
- 브라우저/모바일 확인 결과
- 미구현/후속 기능
- 알려진 이슈
- `.logs/`에 남긴 로그 파일

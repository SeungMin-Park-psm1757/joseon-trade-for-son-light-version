# 2026-05-04 Junior Light Mode Pass

## 1. 변경 요약

- 시작 화면에 `정우의 첫 장사놀이`와 `정우의 거상 모험` 모드 선택을 추가했다.
- 초등학교 1학년용 junior mode를 full mode와 별도 렌더링 구조로 추가했다.
- Junior mode 첫 장사 루프: 도입 → 상품 고르기 → 사기 → 이동 → 팔기 → 성공 → 다시 하기/큰 모험 보기.
- 문서와 acceptance checklist에 junior mode 기준을 추가했다.

## 2. mode 분리 방식

- `GameState.gameMode: "full" | "junior"`를 추가했다.
- 기존 저장에 `gameMode`가 없으면 `normalizeState`에서 `"full"`로 보정한다.
- `App.tsx`는 `state.gameMode === "junior"`일 때 full mode HUD/탭/모달 트리를 렌더링하지 않고 `JuniorModeShell`로 넘긴다.

## 3. junior mode 화면 구조

- `starter/src/junior/JuniorModeShell.tsx`
- `starter/src/junior/juniorMode.css`
- 화면 단계:
  - intro
  - pick
  - buy
  - travel
  - sell
  - success

## 4. junior progression 구조

- `juniorProgress.step`
- `juniorProgress.selectedGoodId`
- `juniorProgress.juniorMoney`
- `juniorProgress.lastReward`
- `juniorProgress.lastRunGoodId`
- `juniorStep`
- `juniorCompletedRuns`
- `juniorBadges`

## 5. 사용 문장 기준

- 한 화면 1~2문장.
- 요정이 정우 이름을 부른다.
- 사용 문장: “정우야, 여긴 조선이야!”, “그림을 보고 하나 골라봐.”, “좋아! 짐에 실었어.”, “이제 팔아보자!”, “와! 첫 장사 성공!”
- 어려운 경제 용어는 junior UI에 넣지 않았다.

## 6. full mode와 충돌 방지 방식

- full mode 컴포넌트와 CSS를 junior 화면에서 재사용하지 않는다.
- junior CSS는 `junior-` prefix를 사용한다.
- 기존 데이터 ID와 JSON 구조는 바꾸지 않았다.
- full mode 시작 버튼의 `data-testid="new-game-button"`은 유지했다.
- junior 진행도는 별도 필드에 저장한다.

## 7. 테스트 결과

- `node scripts/validate-data.mjs`: 통과.
- `node scripts/audit-consistency.mjs`: 통과.
- 원본 경로 `npm install`: 2회 시간 초과로 일부 `node_modules` 파일이 0바이트가 되었고, 영문 임시 경로의 정상 설치본으로 복구했다.
- 원본 경로 `node node_modules/typescript/bin/tsc -b`: 통과.
- 원본 경로 `npm run build`: 통과.
- 원본 경로 `npm run test:smoke`: 통과, 7 passed.
- 원본 경로 `npm run test:visual`: 통과.
- 영문 임시 경로 `C:\codex-tmp\joseon-junior-light\starter`에서 `npm install`: 통과.
- 영문 임시 경로에서 `npm run validate:data`: 통과.
- 영문 임시 경로에서 `npm run audit:consistency`: 통과. 단, 복사본이 Git checkout이 아니라는 경고가 있었다.
- 영문 임시 경로에서 `npm run build`: 통과.
- 영문 임시 경로에서 `npm run test:smoke`: 통과, 7 passed.
- 영문 임시 경로에서 `npm run test:visual`: 통과.
- Playwright로 junior mode 수동 흐름을 확인했다: 시작 → 좋아 → 면포 선택 → 출발 → 도착 → 팔기 → 성공 → 새로고침 → 이어하기 → 성공 화면 복원.
- Playwright로 junior mode의 `큰 모험 보기`가 full mode HUD로 전환되는 것을 확인했다.

## 8. 스크린샷 경로

- `.logs/junior-light-mode-2026-05-04/`
- 주요 파일:
  - `junior-landscape-intro-844x390.png`
  - `junior-landscape-pick-844x390.png`
  - `junior-landscape-buy-844x390.png`
  - `junior-landscape-travel-844x390.png`
  - `junior-landscape-success-844x390.png`
  - `junior-landscape-continue-success-844x390.png`
  - `junior-portrait-intro-390x844.png`

## 9. 남은 한계

- Junior mode는 현재 첫 장사 루프 1종만 제공한다.
- 돈 증가 연출은 CSS 애니메이션 중심이며 동전 개별 카운트업은 아직 없다.
- Google Drive 한글/공백 경로에서 `npm install`이 오래 걸리거나 시간 초과될 수 있다. 이번에는 임시 영문 경로 설치본으로 원본 `node_modules`를 복구한 뒤 원본 경로 검증까지 완료했다.

## 10. 다음 추천 작업

- Playwright visual smoke에 junior mode 선택 및 1회 성공 루프를 추가한다.
- `390x844`, `844x390`, `932x430` 스크린샷을 `.logs/`에 저장한다.
- Junior mode용 스티커판과 더 쉬운 동전 증가 연출을 추가한다.

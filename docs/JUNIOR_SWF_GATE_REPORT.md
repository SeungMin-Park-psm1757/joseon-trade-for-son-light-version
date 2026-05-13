# Junior SWF Gate Report

Last checked: 2026-05-14

목적: full mode에 반영된 SWF-inspired loop를 Junior Light Mode에 적용하기 전에, 분석 산출물과 git 작업 범위를 분리해 오염을 막는다. 이 문서는 junior 구현 문서가 아니라 **작업 개시 전 release gate**다.

## 1. 현재 기준 확인

| 항목 | 결과 |
|---|---|
| full mode 기준 브랜치 | `codex/full-mode-qa-balance` |
| full mode 기준 커밋 | `a12caf3` |
| full mode 커밋 설명 | `Implement and balance full mode SWF-inspired loop` |
| 현재 브랜치 | `codex/junior-swf-inspired-redesign` |
| 현재 HEAD | `a12caf3` |
| junior 준비 브랜치 생성 | 완료. `a12caf3`에서 분기 |

실행한 필수 명령:

```bash
git status --short
git branch --show-current
git log --oneline -5
git diff --name-only
git diff --cached --name-only
```

최근 로그:

```text
a12caf3 Implement and balance full mode SWF-inspired loop
add840e feat(junior): add PWA-ready mobile release polish
0ecc7bd feat(light): rebuild mobile portrait trade adventure
176cdf0 Update README for deployed game
e9b5f92 Polish art layout and fix CI browser install
```

현재 staged 파일:

```text
없음
```

## 2. 현재 작업트리 상태 요약

현재 작업트리는 깨끗하지 않다. Junior 작업 전 반드시 분리/정리해야 한다.

### junior-game 변경

필수 명령 결과:

```bash
git diff --name-only | rg '^junior-game/'
```

결과: **junior-game 변경 다수 존재**.

범위:

- `junior-game/public/assets/boats/*.svg` 삭제
- `junior-game/public/assets/cities/*.svg` 삭제
- `junior-game/public/assets/events/*.svg` 삭제
- `junior-game/public/assets/goods-v2/*.svg` 삭제
- `junior-game/public/assets/maps/korea-light-map.svg` 삭제
- `junior-game/public/assets/routes/*.png` 삭제
- `junior-game/scripts/generate-art-pack.mjs` 삭제
- `junior-game/scripts/generate-route-cutscenes.mjs` 삭제
- `junior-game/src/*.tsx|*.ts|*.css` 수정
- `junior-game/tests/junior-smoke.spec.ts` 수정

필수 명령 결과:

```bash
git diff --cached --name-only | rg '^junior-game/'
```

결과: **없음**. 즉, junior 변경은 현재 staged 상태가 아니다.

### starter/full mode 변경

현재 uncommitted starter/data 변경도 남아 있다.

```text
data/tutorial_dialogues.json
starter/package.json
starter/public/assets/painted2d/discoveries/discovery_busan_waegwan_road.png
starter/public/assets/painted2d/ui/result-plain.png
starter/public/assets/painted2d/vehicles/cart-tier-1.png
starter/public/assets/painted2d/vehicles/cart-tier-2.png
starter/public/assets/painted2d/vehicles/cart-tier-3.png
starter/public/assets/painted2d/vehicles/cart-tier-4.png
starter/public/data/tutorial_dialogues.json
starter/scripts/visual-check.mjs
starter/src/artDirection.ts
starter/tests/smoke.spec.ts
```

이 파일들은 `a12caf3` full mode SWF loop 커밋 범위와 별도로 남은 작업트리 변경이다. Junior 작업 커밋에 섞으면 안 된다.

### a12caf3 커밋 오염 여부

확인 명령:

```bash
git show --name-only --format='' a12caf3 | rg '^junior-game/'
```

결과: **없음**.

판정: `a12caf3` full mode 기준 커밋에는 `junior-game/` 변경이 포함되지 않았다.

## 3. reference-swf 폴더 상태와 커밋 정책

현재 `reference-swf/`는 untracked 상태다.

확인된 하위 폴더:

| 경로 | 파일 수 | 크기 | 커밋 정책 |
---|---:|---:|---|
| `reference-swf/original/` | 3 | 26,999,188 bytes | 커밋 금지 |
| `reference-swf/extracted/` | 17 | 135,821 bytes | 커밋 금지 |
| `reference-swf/screenshots/` | 3 | 1,122 bytes | 원칙상 커밋 금지 |
| `reference-swf/tools-notes/` | 14 | 5,799,022 bytes | 원본 문자열/추출 메모 포함 가능성이 있어 커밋 금지 권장 |
| `reference-swf/analysis/` | 7 | 41,701 bytes | 분석 문서만 선별 커밋 가능 |

정책:

- SWF 원본 파일은 저작권상 분석용으로만 보관한다.
- 추출된 이미지, 사운드, 코드, 원문 문자열 덤프는 공개 저장소에 커밋하지 않는다.
- 커밋 가능 후보는 분석 문서뿐이다.
- Junior 작업에 필요한 경우에도 `reference-swf/analysis/full-mode/*.md` 또는 향후 `reference-swf/analysis/light-mode/*.md`만 선별한다.

권장 `.gitignore` 정책:

```gitignore
reference-swf/original/
reference-swf/extracted/
reference-swf/screenshots/
reference-swf/tools-notes/
swf reference/
*.swf
```

주의: 이번 gate에서는 `.gitignore`를 수정하지 않았다. 정책만 문서화했다.

## 4. Full Mode 산출물 확인 결과

| 파일 | 존재 | bytes | lines | junior 참고성 |
|---|---|---:|---:|---|
| `reference-swf/analysis/full-mode/swf-analysis-index.md` | 예 | 2,461 | 60 | 직접 참고 가능 |
| `reference-swf/analysis/full-mode/caribbean-admiral-15268-structure.md` | 예 | 7,458 | 118 | 구조 참고 가능 |
| `reference-swf/analysis/full-mode/caribbean-admiral-2-16000-structure.md` | 예 | 7,436 | 122 | 구조 참고 가능 |
| `reference-swf/analysis/full-mode/frontier-structure.md` | 예 | 7,114 | 128 | 구조 참고 가능 |
| `reference-swf/analysis/full-mode/swf-comparison-table.md` | 예 | 4,445 | 37 | 구조 참고 가능 |
| `reference-swf/analysis/full-mode/full-mode-gameplay-extraction.md` | 예 | 8,720 | 136 | 직접 참고 가능 |
| `reference-swf/analysis/full-mode/full-mode-adaptation-priority.md` | 예 | 4,067 | 99 | 직접 참고 가능 |
| `docs/FULL_MODE_SWF_REDESIGN.md` | 예 | 33,237 | 302 | 직접 참고 가능 |
| `docs/FULL_MODE_IMPLEMENTATION_PLAN_FROM_SWF.md` | 예 | 15,429 | 257 | 직접 참고 가능 |
| `docs/FULL_MODE_SWF_IMPLEMENTATION_REVIEW.md` | 예 | 6,542 | 77 | 구조 참고 가능 |
| `docs/FULL_MODE_BALANCE_NOTES.md` | 예 | 7,486 | 123 | 구조 참고 가능 |
| `docs/FULL_MODE_SWF_IMPLEMENTATION_CHECK.md` | 예 | 6,082 | 127 | 직접 참고 가능 |
| `docs/JUNIOR_MODE_DESIGN.md` | 예 | 6,868 | 154 | 직접 기준 |
| `docs/JUNIOR_PLAYTEST_CHECKLIST.md` | 예 | 2,127 | 86 | 직접 기준 |
| `docs/JUNIOR_BALANCE_NOTES.md` | 예 | 2,365 | 72 | 직접 기준 |

`reference-swf/analysis/light-mode/` 폴더는 존재하지만 현재 파일은 없다.

## 5. Junior 작업 시 주의사항

1. 아직 junior 구현을 시작하지 않는다.
2. 현재 `junior-game/` 변경은 이미 작업트리에 남아 있는 기존 잔여물이다. 새 SWF-inspired junior 작업과 바로 섞으면 안 된다.
3. Junior 작업 전 선택지가 필요하다:
   - 기존 junior 변경을 별도 커밋으로 정리하거나,
   - 별도 stash/worktree로 이동하거나,
   - 사용자 승인 후 폐기한다.
4. `starter/`와 `junior-game/`을 한 커밋에 섞지 않는다.
5. SWF 원본/추출 자료는 junior 번들에 절대 포함하지 않는다.
6. Junior는 full mode의 시스템을 축소 이식하는 것이 아니라, 초등 저연령용으로 재해석한다.
7. Junior에서는 장부, 복잡한 경제표, 긴 위험 이벤트, 허가/국경/해전 구조를 그대로 넘기지 않는다.

## 6. Junior에 넘길 수 있는 Full Mode 요소

| Full mode 요소 | Junior 적용 방향 |
|---|---|
| 빠른 버튼 피드백 | 큰 버튼, 즉시 소리/움직임/짧은 문장 |
| 첫 장사 루프 | 상품 고르기 → 싣기 → 이동 → 팔기 → 보상 |
| 이동 중 긴장감 | 손실 없는 짧은 길 이벤트 또는 날씨 카드 |
| 보상 리듬 | `+냥`, 배지, 다음 목표 한 줄 |
| 지역 이동 이유 | 부산포 상품을 대구에 팔면 돈이 늘어나는 구조 |
| 상품 차이 | 3개 이하 상품의 그림/가격 차이 |
| 장비 목표 | 손수레 그림 목표, 즉시 숫자 부담은 최소화 |
| 반복 루프 | 또 하기, 다른 상품 해보기, 작은 배지 수집 |

## 7. Junior에 넘기면 안 되는 Full Mode 요소

| Full mode 요소 | 제외 이유 |
|---|---|
| 평균가/스프레드/추천 판매처 상세표 | Junior UI 과밀 |
| 복잡한 route risk 카드 | 저연령 이해 부담 |
| 도적/해적/태풍 손실 이벤트 | 짜증/공포/실패감 가능 |
| 장부 조각/허가장/북방/대마도 목표 | Junior 첫 장사놀이 범위 초과 |
| 배 정박지와 해로/육로 적재 분리 | 핵심 조작 복잡도 증가 |
| 동료/도구/스킬 보정 | 상태 관리가 과함 |
| SWF 원본 자산/코드/문구 | 저작권 및 정책상 금지 |

## 8. 다음 단계 진행 가능 여부

판정: **조건부 가능**.

가능한 것:

- Junior SWF-inspired redesign 설계 문서 작성.
- `reference-swf/analysis/full-mode/*.md`와 full mode 검수 문서를 기준으로 junior용 변환표 작성.
- `docs/JUNIOR_MODE_DESIGN.md`, `docs/JUNIOR_PLAYTEST_CHECKLIST.md`, `docs/JUNIOR_BALANCE_NOTES.md` 업데이트 계획 수립.

아직 하면 안 되는 것:

- junior-game 구현 착수.
- 현재 dirty junior 변경 위에 새 기능을 덧칠.
- SWF 원본/추출 자료를 커밋하거나 게임 번들에 포함.
- `starter/` full mode 변경과 `junior-game/` 변경을 한 커밋에 섞기.

작업 전 gate:

1. `git diff --name-only | rg '^junior-game/'` 결과를 재확인한다.
2. 기존 junior 잔여 변경의 처리 방식을 결정한다.
3. `git diff --cached --name-only`가 비어 있는지 확인한다.
4. SWF 분석 문서를 커밋해야 한다면 `reference-swf/analysis/**/*.md`만 선별한다.

최종 결론: **full mode 산출물은 확인되었고, junior 작업 기준 브랜치는 분리되었다. 그러나 현재 작업트리에 junior-game 잔여 변경이 많으므로, 구현 착수 전 반드시 기존 junior 변경을 별도 처리해야 한다.**

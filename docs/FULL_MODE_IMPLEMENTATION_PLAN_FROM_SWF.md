# Full Mode Implementation Plan From SWF Analysis

작성일: 2026-05-13

목적: `docs/FULL_MODE_SWF_REDESIGN.md`의 설계를 실제 구현 단계로 나누기 위한 계획이다. 이 문서는 구현 순서와 데이터 변경 계획을 정의하며, 아직 코드 구현을 시작하지 않는다.

## 1. 구현 원칙

| 원칙 | 내용 |
|---|---|
| 기존 구조 유지 | `starter/src/App.tsx`, `types.ts`, `styles.css`, `starter/public/data/*.json` 구조를 유지하고 필요한 필드만 확장한다. |
| 데이터 우선 | 항구, 상품, 루트, 이벤트, 의뢰는 코드에 대량 하드코딩하지 않는다. |
| ID 유지 | 기존 데이터 ID와 저장 키를 함부로 바꾸지 않는다. |
| Full mode 우선 | 라이트모드와 저장, UI, 데이터 흐름을 섞지 않는다. |
| 짧은 리듬 | SWF에서 얻은 빠른 선택, 위험, 결과, 보상 리듬만 조선식으로 변환한다. |
| 검증 가능한 단위 | 각 milestone은 `validate:data`, `audit:consistency`, `build`, `smoke`, `visual` 확인이 가능한 크기로 나눈다. |

## Milestone A: 초반 30분 루프 강화

| 항목 | 계획 |
|---|---|
| 목표 | 부산포 시작, 첫 면포 구매, 대구/전주/목포 선택, 첫 사건, 첫 판매, 손수레 목표, 남해/제주/대마도 예고가 끊기지 않게 만든다. |
| 수정 파일 | `starter/src/App.tsx`, `starter/src/types.ts`, `starter/src/styles.css` |
| 데이터 파일 | `quests.json`, `tutorial_dialogues.json`, `port_flavors.json`, `goods.json`, `routes.json`, `ledger_seals.json` |
| 테스트 | `npm run validate:data`, `npm run audit:consistency`, `npm run build`, `npm run test:smoke`, 844x390 수동 루프 확인 |
| 완료 기준 | 새 게임 후 30분 목표 흐름이 UI에서 자연스럽게 이어지고, 첫 거래 후 다음 목표가 손수레/소금/남해 중 하나로 명확히 보인다. |

구현 메모:

| 작업 | 내용 |
|---|---|
| 첫 구매 안내 | 부산포 시장에서 면포와 건어물의 추천 판매처를 더 선명하게 표시한다. |
| 목적지 삼지선다 | 대구, 전주, 목포를 초반 추천 카드로 띄우되 실제 루트 연결과 가격 계산을 사용한다. |
| 첫 사건 보장 | 첫 이동은 너무 큰 손실 없이 길손 상인, 약한 도적 소문, 안개 같은 낮은 강도 사건을 우선한다. |
| 첫 장비 목표 | 손수레 가격, 필요한 돈, 구매 후 화물칸 증가를 결과 모달에서 바로 보여준다. |
| 장기 목표 예고 | 남해 장부, 제주 항로, 왜관 허가의 잠금 이유를 장부와 지도에 함께 표시한다. |

## Milestone B: 지도/이동 이벤트 강화

| 항목 | 계획 |
|---|---|
| 목표 | 지도에서 목적지를 고르기 전에 위험, 소요일, 준비물, 예상 손익, 장비 대응을 한눈에 읽게 한다. |
| 수정 파일 | `starter/src/App.tsx`, `starter/src/types.ts`, `starter/src/styles.css` |
| 데이터 파일 | `routes.json`, `events.json`, `monthly_events.json`, `map_layers.json`, `tools.json`, `companions.json` |
| 테스트 | `npm run validate:data`, `npm run build`, `npm run test:visual`, 지도에서 남해/서해/산길/북방 루트 선택 확인 |
| 완료 기준 | 각 루트의 위험 태그가 계절, 장비, 동료 보정과 함께 route preview에 표시되고, 잠긴 루트는 구체적 이유를 보여준다. |

구현 메모:

| 작업 | 내용 |
|---|---|
| 위험 준비표 | `routes.hazards`와 월별 위험을 합쳐 "태풍 높음", "갯벌 주의", "검문 가능"처럼 표시한다. |
| 권역 사건 덱 | 남해/서해/동해/산길/북방 접경의 사건 후보를 구분한다. |
| 이동 결과 칩 | `돈 -`, `화물 -`, `배 내구 -`, `수레 내구 -`, `신뢰 +`, `명성 +`를 표준화한다. |
| 회복 CTA | 큰 손실 뒤에는 어업, 안전 거래, 수리, 관아 의뢰를 추천한다. |

## Milestone C: 경제/가격/장터 강화

| 항목 | 계획 |
|---|---|
| 목표 | 항구별 장터 차이와 상품 수요 차이를 더 분명하게 만들고, 플레이어가 "어디서 사서 어디서 팔지" 스스로 판단하게 한다. |
| 수정 파일 | `starter/src/App.tsx`, `starter/src/types.ts`, `starter/src/styles.css` |
| 데이터 파일 | `ports.json`, `goods.json`, `monthly_events.json`, `port_flavors.json`, `asset_manifest.json` |
| 테스트 | `npm run validate:data`, `npm run audit:consistency`, `npm run build`, 시장 구매/판매 smoke 확인 |
| 완료 기준 | 시장 상단에서 특산품, 수요품, 유행품, 추천 판매처가 보이고, 같은 항구 되팔기 손해가 명확히 설명된다. |

구현 메모:

| 작업 | 내용 |
|---|---|
| 시세 간판 | 생산품, 수요품, 월별 유행품을 한 줄 칩으로 보여준다. |
| 상품 역할 | 안정 상품, 고수익 상품, 의뢰 상품, 부패 주의 상품을 배지로 구분한다. |
| 추천 거래 | 보유금/화물칸/도착지 수요/위험을 합친 추천을 표시한다. |
| 항구 신뢰 보너스 | 높은 신뢰가 가격, 검문, 의뢰, 장터 슬롯에 작게 영향을 주도록 설계한다. |

## Milestone D: 배/수레 성장 강화

| 항목 | 계획 |
|---|---|
| 목표 | 장비 구매가 단순 수치 상승이 아니라 새 길을 안정화하는 목표가 되게 한다. |
| 수정 파일 | `starter/src/App.tsx`, `starter/src/types.ts`, `starter/src/styles.css` |
| 데이터 파일 | `ships.json`, `carts.json`, `tools.json`, `companions.json`, `routes.json`, `quests.json` |
| 테스트 | `npm run validate:data`, `npm run build`, 장비 구매 후 route preview 변화 확인 |
| 완료 기준 | 배/수레/개인 장비 카드에서 "이 장비로 좋아지는 루트와 대응 위험"이 보이고, 구매 후 지도와 이벤트 선택지에 보정이 반영된다. |

구현 메모:

| 작업 | 내용 |
|---|---|
| 장비 비교 | 현재 장비와 후보 장비의 화물, 속도, 내구, 전투, 대응 위험을 비교한다. |
| 루트 해금 힌트 | 손수레는 내륙 장사, 어선/상선은 남해/제주, 무장상선은 해적 위험 대응처럼 연결한다. |
| 도구 체감 | 측량도구, 거래 장부, 칼, 통역 노트가 선택지 보정으로 드러나게 한다. |
| 유지비/수리 | 고급 장비의 힘과 비용을 함께 보여 full mode 판단을 만든다. |

## Milestone E: 해전/위험 이벤트 강화

| 항목 | 계획 |
|---|---|
| 목표 | 도적, 해적, 검문, 태풍, 갯벌, 암초가 각각 다른 선택을 요구하게 만들고, 간단 턴제 전투를 full mode 전략 선택으로 정리한다. |
| 수정 파일 | `starter/src/App.tsx`, `starter/src/types.ts`, `starter/src/styles.css` |
| 데이터 파일 | `events.json`, `ships.json`, `carts.json`, `tools.json`, `companions.json`, `quests.json` |
| 테스트 | `npm run validate:data`, `npm run build`, `npm run test:smoke`, 강제 이벤트 디버그 루트 또는 smoke 보강 |
| 완료 기준 | 해적/도적 이벤트에서 회피, 협상, 전투, 보급 사용이 다른 결과를 만들고, 실패해도 회복 루프가 안내된다. |

구현 메모:

| 작업 | 내용 |
|---|---|
| 전투 선택지 | 공격, 방어, 회피, 협상, 보급 사용의 기본 틀을 만든다. |
| 전투 보상 | 승리 시 회수 화물, 호위 명성, 수군 신뢰, 항구 신뢰를 작게 부여한다. |
| 손실 표준화 | 돈, 화물, 내구, 사기, 날짜 손실이 결과 칩으로 표준 표시된다. |
| 수군 의뢰 | 해적 위험을 단순 방해가 아니라 남해 장부와 연결되는 목표로 변환한다. |

## Milestone F: 장기 목표/엔딩 강화

| 항목 | 계획 |
|---|---|
| 목표 | 돈 모으기 이후의 목표를 지역 장부, 허가, 항구 신뢰, 발견 도감, 거상 엔딩으로 연결한다. |
| 수정 파일 | `starter/src/App.tsx`, `starter/src/types.ts`, `starter/src/styles.css` |
| 데이터 파일 | `ledger_seals.json`, `discoveries.json`, `quests.json`, `progression.json`, `ports.json`, `routes.json` |
| 테스트 | `npm run validate:data`, `npm run audit:consistency`, `npm run build`, 장부/도감 UI smoke 확인 |
| 완료 기준 | 남해, 서해, 내륙, 제주, 왜관, 산길, 북방 장부 조건과 다음 할 일이 장부 화면에서 명확히 보인다. |

구현 메모:

| 작업 | 내용 |
|---|---|
| 장부 조각 진행 | 완료 조건, 현재 진행, 다음 추천 행동을 한 화면에서 보여준다. |
| 허가 목표 | 왜관, 청 접경, 두만강 통행 허가를 의뢰와 신뢰 조건으로 연결한다. |
| 발견 도감 | 방문 항구, 만난 NPC, 해결 사건, 거래 상품을 장부 성취로 연결한다. |
| 엔딩 조건 | 팔도 장부 완성, 주요 항구 신뢰, 허가 획득, 거상 명성 달성으로 정의한다. |

## Milestone G: QA/밸런스/시각 보강

| 항목 | 계획 |
|---|---|
| 목표 | 가로형 모바일 viewport에서 텍스트 겹침 없이 플레이 가능하게 하고, 초반 30분 경제와 위험 빈도를 조정한다. |
| 수정 파일 | `starter/src/App.tsx`, `starter/src/styles.css`, `starter/tests/smoke.spec.ts`, `starter/scripts/visual-check.mjs` |
| 데이터 파일 | 모든 `starter/public/data/*.json` 중 밸런스 대상 |
| 테스트 | `npm run validate:data`, `npm run audit:consistency`, `npm run build`, `npm run test:smoke`, `npm run test:visual`, 844x390/932x430 수동 플레이 |
| 완료 기준 | 새 게임, 부산포, 시장 구매, 이동, 이벤트, 판매, 자동 저장, 새로고침 이어하기가 안정적으로 통과하고, 장면 UI가 겹치지 않는다. |

구현 메모:

| 작업 | 내용 |
|---|---|
| 초반 경제 | 첫 거래 이익과 손수레 목표 비용을 맞춘다. |
| 위험 빈도 | 첫 30분에는 1회 이상, 과도한 연속 손실은 피한다. |
| 시각 밀도 | 844x390에서 지도 preview, 시장 간판, 이벤트 결과 칩이 겹치지 않게 한다. |
| 저장 회귀 | 새 필드가 기존 저장을 깨지 않도록 `normalizeState`를 보강한다. |

## 2. 권장 구현 순서

| 순서 | 이유 |
|---|---|
| A 먼저 | 첫 30분이 재미있어져야 이후 시스템이 의미를 가진다. |
| B와 C 병행 가능 | 지도 정보와 장터 정보는 서로 연결되므로 같은 스프린트에서 다루는 것이 좋다. |
| D 다음 | 장비 목표가 보여야 위험과 장기 목표가 힘을 얻는다. |
| E 이후 | 간단 전투와 위험 보상은 장비/루트 정보가 보인 뒤 강화한다. |
| F 후반 | 장부/엔딩은 루프와 보상 리듬이 잡힌 뒤 확장한다. |
| G 반복 | 각 milestone 뒤에 작은 QA를 하고, 마지막에 전체 회귀를 한다. |

## 3. 예상 수정 파일 총괄

| 영역 | 파일 |
|---|---|
| 메인 로직/UI | `starter/src/App.tsx` |
| 타입 | `starter/src/types.ts` |
| 스타일 | `starter/src/styles.css` |
| 데이터 검증 | `starter/scripts/validate-data.mjs`, `starter/scripts/audit-consistency.mjs` |
| 테스트 | `starter/tests/smoke.spec.ts`, `starter/scripts/visual-check.mjs` |
| 항구/시장 | `starter/public/data/ports.json`, `port_flavors.json`, `goods.json`, `monthly_events.json` |
| 지도/이동 | `routes.json`, `map_layers.json`, `events.json` |
| 성장 | `ships.json`, `carts.json`, `tools.json`, `companions.json`, `progression.json` |
| 스토리/목표 | `quests.json`, `tutorial_dialogues.json`, `discoveries.json`, `ledger_seals.json` |

## 4. 데이터 마이그레이션 원칙

| 원칙 | 내용 |
|---|---|
| 기존 저장 호환 | 새 상태 필드는 `normalizeState`에서 기본값을 넣는다. |
| 기존 ID 유지 | 항구, 상품, 루트, 이벤트, 의뢰 ID는 변경하지 않는다. |
| 선택 필드부터 | 새 데이터 필드는 optional로 시작하고, UI가 읽을 수 있을 때 필수화한다. |
| 검증 스크립트 동시 수정 | 새 필드를 추가하는 milestone에서 `validate:data`와 `audit:consistency`를 함께 갱신한다. |
| 데이터로 조정 | 가격, 위험, 추천, 의뢰는 코드 상수보다 JSON에서 조정 가능하게 둔다. |

## 5. 다음 구현 프롬프트 초안

```text
너는 이 저장소의 principal React/TypeScript game systems implementer다.

목표:
docs/FULL_MODE_SWF_REDESIGN.md와 docs/FULL_MODE_IMPLEMENTATION_PLAN_FROM_SWF.md의 Milestone A만 구현하라.

범위:
- 초반 30분 루프 강화만 처리한다.
- SWF 자산, 코드, 문구, UI 그래픽은 복사하지 않는다.
- 기존 full mode 저장키와 데이터 ID를 유지한다.
- junior-game은 수정하지 않는다.

필수 구현:
1. 부산포 시장 첫 구매 안내 강화
2. 대구/전주/목포 초반 목적지 추천
3. 첫 이동 전 위험/소요일/예상 이익 준비표 개선
4. 첫 이동 이벤트가 과도한 손실 없이 발생하도록 초반 pacing 보정
5. 첫 판매/첫 의뢰 완료 후 손수레 목표와 남해/제주/대마도 장기 목표 예고
6. 필요한 JSON 필드는 optional로 추가하고 validate 스크립트를 함께 보강

검증:
cd starter
npm run validate:data
npm run audit:consistency
npm run build
npm run test:smoke
npm run test:visual

브라우저 확인:
844x390 또는 932x430에서 새 게임 → 부산포 → 시장 구매 → 대구/전주/목포 선택 → 이동 이벤트 → 판매 → 첫 의뢰 보상 → 손수레 목표 노출을 확인하라.
```

## 6. 2026-05-13 구현 완료 메모

Milestone A를 중심으로 B, C, D, E의 얕은 골격까지 한 번에 연결했다. 목표는 모든 후반 시스템 완성이 아니라 "첫 거래가 끝난 뒤 다음 장사와 장비 목표가 자연스럽게 보이는 full mode 루프"다.

| Milestone | 이번 반영 |
|---|---|
| A 초반 30분 루프 강화 | 첫 이동 사건 보장, 첫 판매/의뢰 완료 후 소금 장사와 손수레 목표 안내 |
| B 지도/이동 이벤트 강화 | route 위험 카드, 추천 준비물, 추천 상품, 사건 덱, 이동 결과 다음 추천 |
| C 경제/가격/장터 강화 | 평균가, 가격 이유, 유행품/특산품/수요품 칩, 같은 항구 되팔기 손익 표시 |
| D 배/수레 성장 강화 | 손수레/어선/연안 상선 가격 조정, 부족 금액 표시, 해금 루트 힌트 |
| E 해전/위험 이벤트 강화 | 도적/해적/태풍/갯벌/암초/검문 메타데이터, 길손 상인, 표류선 구조 추가 |
| F 장기 목표/엔딩 강화 | 이번 단계에서는 장부 목표 UI 노출 중심, 엔딩 로직은 후속 |
| G QA/밸런스/시각 보강 | data validation, consistency audit, build, smoke, visual, 수동 스크린샷으로 검증 |

수정된 핵심 파일:

- `starter/src/App.tsx`
- `starter/src/types.ts`
- `starter/src/styles.css`
- `starter/public/data/routes.json`
- `starter/public/data/events.json`
- `starter/public/data/goods.json`
- `starter/public/data/ships.json`
- `starter/public/data/carts.json`
- `starter/public/data/tools.json`
- 루트 미러 `data/*.json`

후속 프롬프트 초안:

```text
너는 principal full-mode balance designer다.
2026-05-13 SWF-inspired implementation 이후 실제 플레이 수익 곡선과 위험 손실을 30분/2시간 기준으로 검증하라.
손수레, 어선, 연안 상선까지의 평균 소요 거래 횟수와 각 위험 사건의 기대 손실을 계산하고,
필요하면 JSON 가격/보상/위험도만 조정하라. junior-game은 건드리지 말라.
검증은 validate:data, audit:consistency, build, smoke, visual로 마무리하라.
```

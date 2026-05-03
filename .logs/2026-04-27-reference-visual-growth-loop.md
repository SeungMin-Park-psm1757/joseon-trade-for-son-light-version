# 2026-04-27 Reference Visual And Growth Loop Pass

## Reference Notes

- 직접 확인한 `sailing-sim-rpg.web.app`의 핵심 감성은 풀스크린 항구 배경, 큰 타이틀, 선장/항구/시장/출항 화면을 그림 카드로 나누는 구조였다.
- Threads 글의 데모 설명은 항해, 관청, 술집, 무역, 전투, 선원모집, 월급처럼 항구 안 행동을 짧은 메뉴로 묶는 방향이었다.
- 대항해시대 2/3/4 계열에서 이번 MVP에 맞는 차용점은 장거리 확장보다 초반 추천 루트, 명확한 성장 장비, 발견/방문 기록, 시세 차익을 읽는 재미다.

## Implementation

- `QuestProgress`에 납품, 장비 보유, 수리, 전투 생존 진행도를 추가하고 기존 저장 데이터는 기본값 보정으로 유지한다.
- 의뢰 objective resolver를 `ownCart`, `ownShip`, `visit`, `deliver`, `repairShip`, `surviveCombat`, `resolveEvent`까지 확장했다.
- 장비 화면에 손수레, 어선, 제주 준비 성장 목표를 추가했다.
- 시장/지도에 현재 항구 기준 추천 교역 루트를 표시한다.
- 외부 라이선스 에셋 없이 직접 만든 SVG 배경과 장비 이미지를 추가해 시작, 지도, 시장, 장비, 의뢰 화면의 첫인상을 그림 중심으로 개선했다.

## Verification

- `npm run validate:data`: pass
- Temp copy `npm install`: pass
- Temp copy `npm run build`: pass
- Temp copy `npm run test:smoke`: pass
- 390x844 Playwright visual screenshots: `.logs/mobile-visual/`
- 430x932 market screenshot: `.logs/mobile-visual/market-430.png`
- Manual Playwright flow:
  - first three tutorial quests completed via buy/travel/sell actions.
  - handcart quest completed via equipment purchase.
  - delivery objective completed via `waegwan_pass_intro`, granting `waegwan_pass`.

## Notes

- Original workspace is under Google Drive, so dependency install/build verification was run from a temporary copy to avoid Drive file locking issues.
- No third-party art assets were imported.

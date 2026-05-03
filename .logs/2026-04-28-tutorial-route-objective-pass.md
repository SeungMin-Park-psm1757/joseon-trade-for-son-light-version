# 2026-04-28 Tutorial Route Objective Pass

## 1. 변경 요약

- 초반 핵심 상품 12종 아이콘을 64×64 투명 픽셀 PNG로 보강했다.
- 의뢰 목표 계산을 `ObjectiveStatus` helper로 묶어 완료 여부, 진행량, 아이콘, 다음 행동 탭을 한 곳에서 만든다.
- 추천 매입/판매 카드가 시장 강조 또는 지도 루트 선택으로 실제 조작에 연결되게 했다.
- 첫 10분 튜토리얼을 면포 구매 → 대구 이동 → 면포 판매 → 소금 장사 → 손수레 목표의 가로형 단계 패널로 바꿨다.
- 의뢰 탭을 가로 레이아웃으로 재배치해 목표 아이콘 단계가 먼저 보이게 했다.

## 2. 아이콘 보강 내역

다음 파일을 기존 경로 그대로 덮어썼다. 외부 에셋은 사용하지 않았다.

- `starter/public/assets/goods/cotton_cloth.png`
- `starter/public/assets/goods/salt.png`
- `starter/public/assets/goods/dried_fish.png`
- `starter/public/assets/goods/rice.png`
- `starter/public/assets/goods/barley.png`
- `starter/public/assets/goods/beans.png`
- `starter/public/assets/goods/fresh_fish.png`
- `starter/public/assets/goods/seaweed.png`
- `starter/public/assets/goods/lumber.png`
- `starter/public/assets/goods/paper.png`
- `starter/public/assets/goods/ginseng.png`
- `starter/public/assets/goods/horse.png`

## 3. ObjectiveStatus/resolver 구조

`starter/src/App.tsx`에 `ObjectiveStatus`와 `objectiveStatus()`를 추가했다.

- 지원 목표: `buy`, `sell`, `visit`, `ownCart`, `ownShip`, `deliver`, `repairShip`, `resolveEvent`, `surviveCombat`, `fishingCount`/`fish`, `permit`/`ownPermit`
- 완료 판정은 `questProgress`, 보유 장비, 허가장 상태를 사용한다.
- 의뢰 카드 UI, 힌트, 완료 판정이 같은 계산 결과를 공유한다.

## 4. 추천 루트 연결 방식

- `지금 팔 곳`: 추천 카드를 누르면 지도 탭으로 이동하고 해당 route가 선택된다.
- `다음에 살 것`: 추천 카드를 누르면 시장 탭으로 이동하고 해당 상품 카드가 강조된다.
- 지도 route preview에 추천 상품 아이콘과 예상 이익을 함께 표시한다.
- 튜토리얼의 대구 이동 버튼은 대구로 향하는 현재 인접 route를 직접 선택한다.

## 5. 튜토리얼 패널 개선 방식

- 가로형 5단계 패널로 변경했다.
- 완료/현재/잠김 상태를 각각 밝은 표시, 금색 강조, 반투명 처리로 구분한다.
- 각 단계는 상품 아이콘, 지도 아이콘, 수레 이미지를 재사용한다.
- 현재 단계 버튼은 시장/지도/장비 탭으로 바로 이동한다.

## 6. 시장 UX 개선 방식

- 시장 상품 카드에 `사기 좋음`, `팔 곳 있음`, `돈 부족`, `칸 부족` 상태칩을 추가했다.
- 추천 매입 상품과 포커스 상품은 카드 테두리와 배경으로 강조된다.
- 상품명보다 아이콘을 먼저 보게 하기 위해 핵심 상품 실루엣을 보강했다.

## 7. 테스트 결과

- 원본: `npm run validate:data` 성공
- 임시 검증 복사본: `npm install` 성공
- 임시 검증 복사본: `npm run build` 성공
- 임시 검증 복사본: `npm run test:smoke` 성공, 2 passed
- 수동 Playwright 확인: 면포 2개 구매 → 튜토리얼 대구 이동 → 대구 도착 → 면포 판매 → 첫 장사 완료 모달 확인

## 8. 가로화면 UI 확인 결과

스크린샷 폴더: `.logs/mobile-landscape-tutorial-route-pass/`

- `tutorial-panel.png`
- `market-recommended-goods.png`
- `quest-objective-icons.png`
- `map-recommended-route.png`
- `route-animation.png`
- `equipment-next-goal.png`
- `npc-facilities.png`
- `portrait-rotate-notice.png`

검증 JSON:

```json
{
  "ok844": true,
  "ok932": true,
  "portraitNotice": true
}
```

## 9. 남은 한계

- 추천 루트는 인접 route 중심이며 장거리 자동 탐색은 하지 않는다.
- 추천 판매는 “가장 큰 차익”을 따르기 때문에 튜토리얼 대구 동선과 항상 같지는 않다. 튜토리얼 버튼은 별도로 대구를 선택한다.
- 핵심 12종 외 상품 아이콘은 이전 패스의 기본 품질을 유지한다.

## 10. 다음 추천 작업

1. 초반 의뢰 2~4개를 같은 `ObjectiveStatus` 기반으로 더 그림화하고 reward reveal을 개선한다.
2. 시장에서 “추천 상품만 보기” 또는 “내 화물 팔기” 필터를 추가해 어린 플레이어의 선택지를 줄인다.
3. 지도에서 튜토리얼 목적지와 이익 추천 목적지를 색으로 구분해 혼동을 줄인다.

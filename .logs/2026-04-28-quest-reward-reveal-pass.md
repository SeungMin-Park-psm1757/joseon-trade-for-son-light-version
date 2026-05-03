# 2026-04-28 Quest Reward Reveal Pass

## 변경 요약

- 의뢰 완료 모달을 보상 칩 + 다음 목표 카드 중심으로 개선했다.
- 저장 데이터는 변경하지 않고, `questId`로 현재 quest 데이터를 찾아 보상 아이콘을 다시 그린다.
- 첫 장사 완료 후 다음 목표 `소금 장사`가 시장 탭으로 이어지게 했다.
- smoke test에 첫 장사 완료 보상 모달 검증을 추가했다.

## 구현 방식

- `rewardItemsForQuest()`가 돈, 평판, 허가장, 기술 경험치를 `QuestRewardItem`으로 변환한다.
- `nextGoalForQuest()`가 완료한 의뢰별 다음 목표, 탭, 아이콘을 제공한다.
- `QuestCompleteModal`은 주인공 초상, 보상 칩, 다음 목표 버튼, 닫기 버튼으로 구성된다.
- 다음 목표 버튼은 모달을 닫고 관련 탭으로 이동한다.

## 테스트 결과

- `npm run validate:data`: 성공
- temp copy `npm run build`: 성공
- temp copy `npm run test:smoke`: 성공, 3 passed
- 수동 Playwright: 첫 장사 완료 후 보상 모달과 다음 목표 카드 확인

## 브라우저 확인

스크린샷:

- `.logs/mobile-landscape-reward-pass/quest-reward-modal.png`

검증:

```json
{
  "ok844": true,
  "ok932": true
}
```

## 남은 한계

- 보상 칩 아이콘은 기존 상품/허브 아이콘을 재사용한다.
- 아직 보상 획득 애니메이션은 없고, 모달 내 시각 강조만 적용했다.

## 다음 추천 작업

1. 시장에 `추천만 보기`와 `내 화물 팔기` 필터를 추가한다.
2. 지도에서 튜토리얼 목적지와 이익 추천 목적지를 색으로 구분한다.
3. 의뢰 카드에 완료 보상 미리보기 칩을 추가한다.

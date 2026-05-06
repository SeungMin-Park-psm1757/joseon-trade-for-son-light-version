# 2026-05-05 Junior Light Mode Child Review

## 검수 결과

- 390x844 전체 흐름을 실제 브라우저 스크린샷으로 다시 확인했다.
- 첫 검수에서 `사기` 단계의 짐 싣기 장면이 빈 초록 박스처럼 보여 Fail 후보로 판단했다.
- 수정 후 CSS 기반 수레 아트를 추가해 물건이 수레에 실린 모습이 확실히 보이도록 했다.
- 상품 추천 표시는 `별 추천` 텍스트에서 `★` 표시로 줄였다.
- 상품 고르기와 성공 화면 문구를 줄여 초1 기준 글 밀도를 낮췄다.

## 판정

| 기준 | 판정 | 메모 |
|---|---|---|
| 390x844 세로 화면에서 잘리지 않는가 | Pass | 6단계 모두 화면 안에 들어온다. |
| 시작 후 5초 안에 무엇을 누를지 알 수 있는가 | Pass | 첫 화면 하단에 큰 `좋아!` 버튼 1개만 있다. |
| 한 화면에 글이 2문장 이하인가 | Pass | 대사는 1~2문장, 성공 화면은 1문장 + 배지 중심이다. |
| 버튼은 엄지로 누르기 충분히 큰가 | Pass | 주요 버튼은 66px 이상이다. |
| 상품은 3개 이하인가 | Pass | 면포, 건어물, 소금 3개만 보인다. |
| 가격표나 어려운 숫자가 보이지 않는가 | Pass | 돈 숫자 외 가격/수익/위험 숫자가 없다. |
| 복잡한 지도나 장부가 보이지 않는가 | Pass | 단순 길 그림만 사용한다. |
| 요정이 정우에게 직접 말하는가 | Pass | 모든 단계에서 정우를 부르거나 직접 칭찬한다. |
| 사기 → 가기 → 팔기 → 성공 흐름이 막히지 않는가 | Pass | Playwright smoke에서 전체 흐름 통과. |
| 성공 화면이 충분히 기쁜가 | Pass | 웃는 정우, 요정, 돈주머니, 별 3개, 성공 배지가 보인다. |
| full mode 파일과 저장을 건드리지 않았는가 | Pass | junior import/gameMode 흔적 없음. full build 통과. |
| junior-game 폴더만 독립 실행 가능한가 | Pass | `junior-game` build/test 독립 통과. |

## 스크린샷

- `.logs/junior-light-mode-review-2026-05-05/01-arrive-390x844.png`
- `.logs/junior-light-mode-review-2026-05-05/02-pick-390x844.png`
- `.logs/junior-light-mode-review-2026-05-05/03-buy-390x844.png`
- `.logs/junior-light-mode-review-2026-05-05/04-travel-390x844.png`
- `.logs/junior-light-mode-review-2026-05-05/05-sell-390x844.png`
- `.logs/junior-light-mode-review-2026-05-05/06-success-390x844.png`
- `.logs/junior-light-mode-review-2026-05-05/07-success-844x390.png`

## 검증 명령

- `cd junior-game && npm run build`: 통과.
- `cd junior-game && npm run test`: 12개 통과.
- `cd starter && npm run build`: 통과.

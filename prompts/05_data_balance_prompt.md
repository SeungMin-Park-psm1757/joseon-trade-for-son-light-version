# 데이터 밸런스 조정 프롬프트

기능은 크게 바꾸지 말고 데이터 밸런스를 조정해 주세요.

## 목표

- 첫 10분 안에 최소 1회 이익 거래 성공
- 첫 30분 안에 손수레 또는 어선 구매가 가능해 보일 것
- 어업은 교역보다 수익이 낮을 것
- 제주 항로는 초반 목표로 매력적이지만 위험할 것
- 대마도는 허가장 획득 후 도전하는 후반 목표일 것

## 조정 대상

- `goods.json` basePrice
- `ports.json` produces/demands/marketBias
- `routes.json` days/risk
- `ships.json` price/cargo
- `carts.json` price/cargo
- `monthly_events.json` priceModifiers/hazardModifiers
- `quests.json` rewards

## 수정 금지

- 데이터 ID 변경 금지
- 기존 세이브와 충돌하는 필드 삭제 금지
- 항구를 대량 삭제하지 말 것

## 보고 형식

- 조정한 파일
- 조정 이유
- 예상 플레이 변화
- 추가 테스트 필요 지점

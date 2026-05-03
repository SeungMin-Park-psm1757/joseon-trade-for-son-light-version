# 2026-04-28 Scene First UI Pass

## 변경 요약

- 하단 고정 탭을 상태바 아래 상단 메뉴로 이동했다.
- 항구 화면을 배경 이미지 위 시설 핫스팟 중심으로 바꿨다.
- 시장 화면을 상품 카드 목록에서 장터 배경 + 상품 아이콘 진열대 + 거래 팝업으로 바꿨다.
- 상품 선택 후 거래 팝업에서 사기/팔기를 반복 클릭하는 방식으로 조작한다.
- 기존 교역, 이동, 튜토리얼, 의뢰 완료 루프는 유지했다.

## 구현 방식

- `PortHub`는 카드 그리드 대신 `hub-hotspot` 버튼을 배경 위에 절대 위치로 배치한다.
- 시장은 `visual-market-layout` 단일 장면으로 표시하고 우측 정보 패널은 숨겼다.
- 상품 아이콘은 `good-stall-token`으로 표시되며 추천/판매 가능 상태를 작은 배지로 보여준다.
- 선택한 상품은 `trade-popover`로 표시하고, 기존 `buyGood`/`sellGood` 로직을 그대로 호출한다.
- Playwright 테스트가 새 장면형 시장 UI를 확인하도록 smoke test를 갱신했다.

## 테스트 결과

- `npm run validate:data`: 성공
- temp copy `npm run build`: 성공
- temp copy `npm run test:smoke`: 성공, 3 passed

## 브라우저 확인

스크린샷 폴더:

- `.logs/mobile-landscape-scene-ui-pass/`

스크린샷:

- `port-scene-hotspots.png`
- `market-popup.png`
- `market-good-selected.png`
- `market-click-buy.png`
- `portrait-notice.png`

검증:

```json
{
  "ok844": true,
  "ok932": true,
  "portraitNotice": true
}
```

## 남은 한계

- 항구 우측 패널에는 아직 설명형 텍스트가 남아 있다.
- 시장 팝업은 기능 우선의 CSS 팝업이며, 전용 장터 내부 배경/상인 애니메이션은 없다.
- 화물, 장부, 장비 화면은 아직 카드/리스트 기반이다.

## 다음 추천 작업

1. 화물/장부를 인벤토리 가방과 장부 펼침 그림 UI로 바꾼다.
2. 지도 화면도 패널 비중을 줄이고 지도 위 목적지 팝업 방식으로 바꾼다.
3. 항구 우측 패널을 제거하거나 접어서 전경 장면을 더 크게 쓴다.

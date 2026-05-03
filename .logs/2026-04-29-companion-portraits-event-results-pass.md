# 2026-04-29 Companion Portraits Event Results Pass

## 1. 변경 요약

- 동료 9명 각각의 개별 픽셀풍 SVG 초상을 추가했다.
- `companions.json`에 `portraitAsset` 매핑을 추가하고 root `data/`와 public 데이터를 동기화했다.
- 동료 카드, 가족 도움, 함대 조언, 동료 영입 모달에서 초상 이미지를 사용하도록 바꿨다.
- 사건 해결 결과 모달에 동료별 결과 문구와 초상 strip을 추가했다.
- smoke test가 초상 이미지와 사건 결과 동료 문구를 확인하도록 보강했다.

## 2. 에셋 목록

- `starter/public/assets/companions/naraon.svg`
- `starter/public/assets/companions/jo_yeonseo.svg`
- `starter/public/assets/companions/lee_sihyeong.svg`
- `starter/public/assets/companions/kim_sora.svg`
- `starter/public/assets/companions/lee_doyun.svg`
- `starter/public/assets/companions/park_siwoo.svg`
- `starter/public/assets/companions/park_seyeon.svg`
- `starter/public/assets/companions/dad.svg`
- `starter/public/assets/companions/mom.svg`

## 3. 구현 방식

- `Companion` 타입에 `portraitAsset?: string`을 추가했다.
- `EventResult` 타입에 `companionReaction`을 추가했다.
- `CompanionAvatar`는 `portraitAsset`이 있으면 이미지, 없으면 기존 글자 배지를 표시한다.
- `companionEventResult` helper가 사건 유형과 동료 ID에 맞는 결과 문구를 반환한다.
- `resolveEvent`가 `lastEventResult.companionReaction`에 해당 값을 넣는다.
- `EventResultModal`은 companion reaction strip을 결과 chip 위에 표시한다.

## 4. 테스트 결과

- 원본 경로:
  - `npm run validate:data` 성공
  - `npm run audit:consistency` 성공. Git checkout 아님 경고는 기존 환경 경고다.
- 임시 영문 경로:
  - `C:\Users\QuIC\AppData\Local\Temp\joseon-trade-companion-portraits-pass\starter`
  - `npm install` 성공
  - `npm run build` 성공
  - `npm run test:smoke` 성공, 5 passed
  - `npm run test:visual` 성공

## 5. 브라우저 확인

- 844x390에서 동료 영입 초상, 함대 초상, 사건 결과 동료 문구를 확인했다.
- 932x430에서 동료 영입 초상 모달과 가로 스크롤 없음 확인.
- 저장 스크린샷:
  - `.logs/companion-portraits-event-pass/companion-portrait-recruit-844x390.png`
  - `.logs/companion-portraits-event-pass/companion-portraits-fleet-844x390.png`
  - `.logs/companion-portraits-event-pass/event-companion-result-844x390.png`
  - `.logs/companion-portraits-event-pass/companion-portrait-recruit-932x430.png`

## 6. 남은 한계

- 초상은 직접 만든 경량 SVG 픽셀 아이콘이다. 더 풍부한 반신 픽셀아트는 후속 보강 대상이다.
- 사건 결과 문구는 helper 기반이다. 데이터가 더 늘어나면 JSON화가 필요하다.
- 동료별 실제 선택지 변화는 기존 능력치 보정 수준으로 유지했다.

## 7. 다음 추천 작업

1. 동료별 대사/사건 결과 문구 JSON화.
2. 동료별 픽셀 반신 초상 고품질화.
3. 장비 구매 후 새로 유리해진 루트 지도 강조.

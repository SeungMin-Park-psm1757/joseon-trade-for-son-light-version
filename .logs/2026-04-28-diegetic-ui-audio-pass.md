# 2026-04-28 Diegetic UI Audio Pass

## 1. 변경 요약

- 우측 정보 패널을 간판, 말풍선, 장부형 표면으로 정리했다.
- 시장 거래를 상품 클릭 후 팝업에서 사기/팔기 1개씩 반복 클릭하는 방식으로 단순화했다.
- 배 정박/호출 안내를 항구 사공 NPC 장면으로 바꿨다.
- 화물과 출발 준비 상태를 수레/배 슬롯 UI로 표시했다.
- 주요 이벤트 모달을 픽셀풍 장면 카드와 결과 칩으로 개선했다.
- Web Audio API 기반 BGM/SFX 1차 시스템을 추가했다.

## 2. UI 구조 변경 내역

- `signboard`: 월간 소식, 항구 정보용 간판형 카드
- `speech-bubble`: NPC와 사건 설명용 말풍선
- `ledger-popover`: 장부/추천 정보용 펼친 장부형 카드
- `route-prep-board`: 이동 전 준비 체크
- `cargo-slot-strip`: 현재 화물과 경로별 적재 한계

## 3. 시장 클릭 거래 구현 방식

시장 화면은 장터 배경 위 상품 진열대를 먼저 보여준다. 상품 아이콘을 누르면 `trade-popover`가 열리고, `사기` 또는 `팔기`를 누를 때마다 1개씩 거래한다. 기존 `buyGood`/`sellGood`, 장부 기록, 의뢰 진행도, 저장 루프는 유지했다.

## 4. 배 호출 NPC 구현 방식

`ShipBerthPanel`을 `ship-caller-panel`로 확장했다. 배가 현재 항구에 있으면 정박 상태와 해로 적재 한계를 보여주고, 다른 항구에 있으면 비용과 소요 일수를 사공 말풍선으로 보여준다. 내륙 도시는 호출 버튼이 막힌다.

## 5. 화물/적재 시각화 방식

`CargoSlotStrip`은 현재 화물을 상품 아이콘 슬롯으로 보여준다. 지도 이동 준비에서는 육로일 때 수레, 해로일 때 배 창고 기준으로 적재 한계를 표시한다. 한계를 넘으면 출발 버튼은 기존 차단 로직을 따르고 UI에는 짧은 안내를 표시한다.

## 6. 이벤트 장면 카드 구현 방식

`EventSceneArt`는 이벤트 이름/설명을 기준으로 도적, 해적, 갯벌, 태풍, 검문, 순풍, 수리 장면 클래스를 선택한다. 별도 이미지 파일 없이 CSS 픽셀풍 장면을 만들었다.

## 7. 사운드 시스템 구현 방식

`starter/src/audio.ts`에 Web Audio API 기반 오디오 매니저를 추가했다.

- BGM: 항구/시장 루프, 지도/이동 루프
- SFX: 클릭, 구매, 판매, 보상, 출발, 도착, 위험, 의뢰 완료, 배 호출, 수리
- 첫 사용자 입력 후 `AudioContext`를 resume한다.
- BGM/SFX/볼륨 설정은 `joseon_trade_audio_v1`에 저장한다.

## 8. 사용/생성한 오디오 에셋과 라이선스

외부 오디오 파일을 사용하지 않았다. 모든 소리는 Web Audio API로 절차 생성한다. 추가 라이선스 기록 대상은 없다.

## 9. 테스트 결과

- `npm run validate:data`: 성공
- `npm run build`: 성공
- `npm run test:smoke`: 성공, 3 passed

원본 Google Drive 경로에는 `node_modules`가 없어 빌드/스모크는 temp copy에서 검증했다.

## 10. 가로화면 UI 확인 결과

스크린샷 저장 경로: `.logs/mobile-landscape-diegetic-audio-pass/`

- `port-signboard-ui.png`
- `market-stall-click-ui.png`
- `market-trade-popover.png`
- `ship-caller-npc.png`
- `cargo-slots-route-prep.png`
- `event-scene-card.png`
- `audio-controls.png`
- `portrait-rotate-notice.png`

844×390, 932×430에서 가로 스크롤이 없음을 확인했다. 390×844에서는 가로 플레이 안내가 보인다.

## 11. 남은 한계

- 사운드는 절차 생성이라 실제 국악풍 녹음 음원은 아니다.
- 이벤트 장면은 CSS 기반 픽셀풍 placeholder이며 개별 고해상도 이벤트 일러스트는 아직 없다.
- 장부/의뢰/장비 화면에는 아직 일부 텍스트 카드 느낌이 남아 있다.

## 12. 다음 추천 작업

1. 항구별 고유 생활감 강화: 부산포, 대구, 전주, 목포, 제주, 대마도부터 NPC 반응과 시장 진열을 다르게 만든다.
2. 첫 30분 성장선 정리: 첫 장사, 소금, 손수레, 어업, 어선, 제주 준비를 하나의 그림 의뢰선으로 묶는다.
3. 이벤트별 선택지 확장: “수리한다 / 숨는다 / 돈을 준다”를 그림 버튼 2~3개로 표현한다.

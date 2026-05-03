# 2026-04-29 Port Companion Equipment Moments Pass

## 1. 변경 요약

- 합류한 동료가 시설 화면에서 짧게 조언하는 보조 줄을 추가했다.
- 사건 모달에 동료의 상황별 조언을 표시했다.
- 개인 장비 구매와 동료 영입에도 축하/안내 모달을 연결했다.
- 장비/동료 구매 모달에 능력치 detail chip과 다음 행동 버튼을 추가했다.
- 함대 패널에 현재 동료 한마디를 띠 형태로 표시했다.

## 2. 세부 작업

1. `joinedCompanions` helper 추가.
2. `strongestCompanionFor` helper 추가.
3. 시설별 적합 동료를 고르는 `companionFacilityLine` 추가.
4. 사건 종류와 skillCheck를 보는 `companionEventLine` 추가.
5. 개인 장비 구매 문구를 만드는 `toolNoticeText` 추가.
6. 배/수레/개인 장비 detail chip을 만드는 `equipmentNoticeDetails` 추가.
7. `FacilityPanel`에 동료 조언 strip 추가.
8. `EventChoiceModal`에 동료 조언 strip 추가.
9. `buyTool`에 장비 구매 notice 연결.
10. `recruitCompanion`에 동료 영입 notice 연결.
11. `EquipmentNoticeModal`이 tool icon, companion avatar, vehicle image를 모두 처리하도록 개선.
12. smoke test에 개인 장비 구매, 동료 영입, 시설 조언, 사건 조언 검증 추가.

## 3. 테스트 결과

- 원본 경로:
  - `npm run validate:data` 성공
  - `npm run audit:consistency` 성공. 로컬 Git checkout 없음 경고는 기존 환경 경고다.
- 임시 영문 경로:
  - `C:\Users\QuIC\AppData\Local\Temp\joseon-trade-companion-port-pass\starter`
  - `npm install` 성공
  - `npm run build` 성공
  - `npm run test:smoke` 성공, 5 passed
  - `npm run test:visual` 성공

## 4. 브라우저 확인

- 844x390에서 장비 구매 notice, 동료 영입 notice, 이벤트 조언 modal을 확인했다.
- 932x430에서 구매 notice와 가로 스크롤 없음 확인.
- 저장 스크린샷:
  - `.logs/companion-port-equipment-pass/tool-purchase-notice-844x390.png`
  - `.logs/companion-port-equipment-pass/companion-recruit-notice-844x390.png`
  - `.logs/companion-port-equipment-pass/facility-companion-line-844x390.png`
  - `.logs/companion-port-equipment-pass/event-companion-line-844x390.png`
  - `.logs/companion-port-equipment-pass/tool-purchase-notice-932x430.png`

## 5. 남은 한계

- 동료 대사는 아직 App.tsx helper 기반이다. 항구별/동료별 대사가 늘어나면 JSON 데이터로 분리하는 것이 좋다.
- 동료 초상은 아직 CSS 픽셀 아바타다. 후속 패스에서 개별 픽셀 초상을 넣을 수 있다.
- 장비 구매 후 새 루트 강조는 detail chip 수준이다. 지도에서 더 강하게 보여주는 작업이 남아 있다.

## 6. 다음 추천 작업

1. 항구별 고유 동료/NPC 반응 JSON화.
2. 장비 구매 후 새로 유리해진 루트 지도 강조.
3. 동료별 이벤트 결과 문구와 개별 픽셀 초상 보강.

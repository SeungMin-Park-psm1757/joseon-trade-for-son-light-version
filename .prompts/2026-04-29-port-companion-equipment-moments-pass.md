너는 이 저장소의 principal engineer + pixel art game UX designer + browser game playtester다.

현재 프로젝트는 모바일 가로형 조선 무역 RPG 「팔도상단: 조선의 바람」이다.

이번 작업은 "항구별 고유 반응 + 동료 존재감 + 구매 보상 연출" 패스다.

목표:
1. 시설 화면에서 합류한 동료가 상황에 맞는 짧은 조언을 한다.
2. 이벤트 모달에서 전투/항해/교역 상황에 맞는 동료 조언을 선택지 위에 보여준다.
3. 개인 장비 구매도 배/수레처럼 축하 모달을 띄운다.
4. 동료 영입도 축하 모달을 띄우고 역할/능력치를 보여준다.
5. 장비/동료 구매 모달에는 다음 행동 버튼을 제공한다.
6. 함대 패널에 현재 동료 한마디를 띠 형태로 보여준다.
7. smoke test가 개인 장비 구매, 동료 영입, 시설 조언, 이벤트 조언을 검증한다.

검증:
- npm run validate:data
- npm run audit:consistency
- npm run build
- npm run test:smoke
- npm run test:visual

Google Drive/한글 경로에서 build가 실패하면 temp copy에서 검증한다.

후속 추천:
1. 항구별 고유 동료/NPC 반응을 JSON 데이터로 분리한다.
2. 장비 구매 후 실제 유리해진 루트를 지도에서 더 강하게 강조한다.
3. 동료별 이벤트 결과 문구와 작은 픽셀 초상 에셋을 보강한다.

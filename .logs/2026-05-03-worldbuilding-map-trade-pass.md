# 2026-05-03 Worldbuilding Map Trade Pass

## 1. 변경 요약

- 게임 시대를 19세기 조선 후기 기준으로 고정했다.
- 신의주/청진 표시를 시대에 맞게 의주/경흥으로 바꿨다. 데이터 ID는 저장 호환성을 위해 유지했다.
- 청 방면은 책문 장시, 러시아/북방 방면은 두만강 북방장으로 제한 국경 장시화했다.
- 압록강/두만강 라벨과 국경 장시 루트 시각 스타일을 지도에 추가했다.
- 지역 특산품과 북방 허가 의뢰/장부 목표를 정리했다.

## 2. 시대 설정 판단

- 기준 시대: 조선 후기, 개항 이전부터 초기 개항기 직전의 분위기.
- 중국 상대: 청.
- 러시아 방면: 러시아 제국/북방 상인이 두만강 너머에서 접촉하는 제한 장시 정도로만 표현.
- 본토 확장은 하지 않고 국경 접촉면만 장기 목표로 사용한다.

## 3. 지명/거점 보정

| ID | 표시명 | 처리 |
|---|---|---|
| `sinuiju` | 의주 | 압록강 청 교역 준비 거점 |
| `chongjin` | 경흥 | 두만강 북방 장시 준비 거점 |
| `qing_yalu_market` | 책문 장시 | 청 방면 제한 국경 장시 |
| `tumen_north_market` | 두만강 북방장 | 러시아 방면/북방 제한 장시 |

## 4. 특산품 감사

- 의주: 인삼, 약초, 목재.
- 경흥: 말, 철, 목재.
- 책문 장시: 비단, 차, 도자기, 명주실.
- 두만강 북방장: 말, 철, 목재, 은.
- 기존 남부/내륙/제주/대마도 특산품 구조는 유지하되, 문서에서 핵심 특산품 1-2개와 보조 품목으로 정리했다.

## 5. 북방/해외 교역 구조

- `uiju-qing_yalu_market`: 의주에서 책문 장시로 가는 국경 장시길. `qing_border_pass` 필요.
- `gyeongheung-tumen_north_market`: 경흥에서 두만강 북방장으로 가는 국경 장시길. `tumen_trade_pass` 필요.
- 신규 허가 의뢰:
  - `qing_border_pass_intro`
  - `tumen_trade_pass_intro`
- 북방 장부는 의주/경흥 방문과 두 허가장을 장기 목표로 포함한다.

## 6. 지도 수정

- 압록강/두만강 라벨을 지도 위에 별도 overlay로 추가해 실제 화면에서 읽히게 했다.
- 국경 장시 루트는 `terrain: ["border_trade"]` 태그를 사용한다.
- 기존 route `mode`는 `land | sea`를 유지해 이동/짐칸/이벤트 로직을 깨지 않게 했다.
- 국경 장시 루트는 보라색 점선으로 일반 땅길과 구분된다.

## 7. 문서화

- 새 문서: `docs/WORLDBUILDING_TRADE_AUDIT.md`
- 업데이트:
  - `docs/GAME_OVERVIEW_CURRENT.md`
  - `docs/SYSTEM_SPEC.md`
  - `docs/UI_SPEC.md`
  - `tests/ACCEPTANCE_CHECKLIST.md`

## 8. 테스트 결과

- `npm run validate:data`: 성공.
- `npm run audit:consistency`: 성공. Git checkout 경고만 있음.
- `npm run build`: 성공.
- `npm run test:smoke`: 성공, 6/6.
- `npm run test:visual`: 성공.

## 9. 화면 확인

- 저장 위치: `.logs/worldbuilding-map-trade-pass/`
- 확인 화면:
  - `map-1366x768.png`
  - `map-1920x1080.png`
  - `map-1366x768-after-labels.png`
- 1366x768 캡처 기준 가로 오버플로 없음.
- 압록강/두만강 라벨 DOM 및 화면 표시 확인.

## 10. 남은 한계

- 책문 장시와 두만강 북방장 전용 배경 에셋은 아직 기존 내륙 도시 배경을 재사용한다.
- 청/북방 허가 의뢰는 기본 deliver objective로 연결했으며, 별도 관청 NPC 연출은 후속 작업이다.
- 북방 전용 이벤트와 가격 밸런스는 장기 플레이테스트가 더 필요하다.

## 11. 다음 추천 작업

1. 북방 장시 전용 NPC/배경/시장 진열대 에셋 보강.
2. 청 교역 허가와 두만강 통행 허가를 관청 대화형 의뢰로 연출.
3. 북방 전용 위험 이벤트와 겨울/검문 월별 소식 강화.

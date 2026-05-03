# 2026-04-29 Daikoukai Progression Pixel Polish

## 1. 변경 요약

- 3대 명성(`상인 신용`, `탐방 명성`, `호위 명성`)을 GameState와 UI에 추가했다.
- 18개 항구/도시 첫 방문 발견 카드와 `팔도 탐방 도감`을 추가했다.
- 항구 신뢰도, 월별 유행품/관청 수요품, 추천 교역 보정을 연결했다.
- `상단 장부 조각` 장기 목표와 장비 구매 후 새 루트 강조 UI를 추가했다.
- asset manifest, 발견/장부 조각 placeholder 에셋, smoke/visual 테스트 보정을 추가했다.

## 2. 대항해시대식 구조의 조선식 변환

원작 고유 명칭, 캐릭터, 그래픽, 스토리는 사용하지 않았다. 대신 장기 플레이 구조만 조선 후기 무역 RPG에 맞춰 재해석했다.

- 명성: 모험/교역/전투식 구조를 `상인 신용`, `탐방 명성`, `호위 명성`으로 변환.
- 발견: 세계 발견물 대신 항구 첫 방문에서 얻는 `왜관 길`, `갯벌 나루`, `약령시` 같은 지역 카드로 변환.
- 점유율: 항구 투자/점유율 대신 거래와 의뢰로 오르는 `항구 신뢰도`로 축소.
- 유행품: 글로벌 유행 대신 월별 장터 유행품과 관청 수요품으로 변환.
- 장기 증표: 패권/증표류 명칭 대신 `팔도상단 장부 조각`으로 변환.

## 3. 3대 명성 구현 방식

- `GameState.fame`에 `{ merchant, exploration, guard }`를 추가했다.
- 기존 저장 데이터는 `normalizeState`에서 기본값을 보정한다.
- 기존 `reputation` reward는 `applyEffects`/`applyQuestRewards`에서 새 명성으로 매핑된다.
- 이익 판매는 상인 신용, 첫 발견은 탐방 명성, 위험 사건 해결은 호위 명성을 올린다.
- 상태바에는 `fame-merchant`, `fame-exploration`, `fame-guard` test id가 있는 칩으로 표시한다.

## 4. 발견 카드와 도감 구현 방식

- `starter/public/data/discoveries.json`을 추가했다.
- 모든 18개 항구/도시에 최소 1개 발견 카드를 배치했다.
- 새 게임 시작 시 부산포 발견이 등록되고, 새 항구 도착 시 `withPortDiscovery`가 중복 보상 없이 처리한다.
- 발견 모달은 `discovery-modal`, 도감 섹션은 `discovery-log`로 검증 가능하다.

## 5. 항구 신뢰도 구현 방식

- `GameState.portTrust`를 추가하고 load 시 `{}` 기본값을 보정한다.
- 첫 발견, 이익 판매, 의뢰/사건 보상에서 신뢰도를 올릴 수 있게 했다.
- 항구 패널에는 `port-trust-chip`으로 짧게 표시한다.
- 투자나 점유율 시스템은 추가하지 않았다.

## 6. 월별 유행품/관청 수요품 구현 방식

- `monthly_events.json`에 `trendGoods`, `officialDemandGoods`, `riskTags`를 추가했다.
- 항구 뉴스와 시장에는 유행/관청 수요 칩을 표시한다.
- 추천 루트는 현재 화물, 인접 루트, 월별 유행/수요, 위험도, 장비/동료 보정을 함께 본다.
- 가격 계산 구조 자체는 월 단위 단순 구조를 유지했다.

## 7. 장비 구매 후 루트 강조 구현 방식

- 장비 화면에 `equipment-unlocked-routes` 섹션을 추가했다.
- 현재 장비/상태 기준으로 새로 유리해진 길과 다음 준비 목표를 짧게 보여준다.
- 제주/대마도처럼 준비가 필요한 루트는 부족 조건을 유지한다.

## 8. 장부 조각 구현 방식

- `starter/public/data/ledger_seals.json`을 추가했다.
- 남해, 서해, 내륙, 제주, 왜관, 산길 장부 조각 6개를 넣었다.
- 방문, 판매, 어업, 장비, 허가장, 사건 해결 조건을 기존 objective/progress 구조와 맞게 계산한다.
- 완료 보상은 명성/돈 중심이며 복잡한 엔딩은 넣지 않았다.

## 9. 픽셀아트 asset manifest 및 품질 보강

- `starter/public/data/asset_manifest.json`을 추가했다.
- 상품, 배경, NPC, 동료, 배/수레, 발견, 장부 조각, 지도, 결과 아이콘을 관리 대상으로 기록했다.
- 발견/장부 조각 아이콘은 내부 placeholder SVG로 만들고 후속 교체 대상으로 명시했다.
- 외부 라이선스 불명 에셋은 추가하지 않았다.

## 10. 이벤트 장면 카드 보강

- 루트 위험 칩에 `route-danger-chip` test id를 추가했다.
- 사건 결과에는 명성/항구 신뢰도 변화가 효과 라인과 결과 칩으로 드러나도록 했다.
- 기존 사건 종류나 전투 시스템을 확장하지 않고 표시/보상 연결을 강화했다.

## 11. 테스트 결과

검증은 Google Drive/한글 경로의 npm bin 문제가 있어 temp 영문 경로에서 실행했다. 원본 소스 변경은 저장소에 남겼다.

- `npm run validate:data`: 성공
- `npm run audit:consistency`: 성공, temp copy가 git checkout이 아니라는 경고만 있음
- `npm run build`: 성공
- `npm run test:smoke`: 성공, 5 passed
- `npm run test:visual`: 성공

## 12. 가로화면 확인 결과

- `844x390`: 발견 모달, 명성/신뢰 칩, 시장 유행품, 장비 루트, 도감/장부 조각 확인
- `932x430`: 같은 흐름 확인
- 가로 스크롤: visual check에서 없음
- 스크린샷: `.logs/daikoukai-progression-pixel-polish-pass/`

## 13. 남은 한계

- 발견 카드와 장부 조각 이미지는 placeholder라 최종 픽셀아트 품질은 더 올릴 수 있다.
- 항구 신뢰도 효과는 아직 안내/추천 중심이며, 항구별 고유 반응은 더 세분화할 여지가 있다.
- 장부 조각 완료 연출은 간결한 보상 모달 수준이다.
- `dialogue_flavors.json`은 구조 준비 단계이며 전체 대사 이전은 아직 하지 않았다.

## 14. 다음 추천 작업

1. 발견 카드/장부 조각 placeholder를 실제 픽셀아트 카드로 교체.
2. 항구 신뢰도 2/4/6 단계별 고유 NPC 대사와 시장 진열 차이를 확대.
3. 장부 조각 완료 시 지역별 축하 장면과 다음 항로 안내를 추가.

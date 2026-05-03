# 2026-04-28 Map Hotspot Berth Pass

## 1. 변경 요약

- 항구 허브 핫스팟을 지역 배경별로 재배치했다.
- 전체 지도 배경을 한국 전경 기반 픽셀아트 PNG로 교체했다.
- 허브 시설 아이콘을 SVG 느낌의 평면 도형에서 작은 픽셀 PNG로 교체했다.
- 육로 이동에서 선박 피해가 발생하지 않도록 선박 정박지와 수레 피해 처리를 분리했다.
- 선박이 다른 항구에 있을 때 현재 항구로 부르는 항구 서비스를 추가했다.

## 2. 생성/반영한 에셋 목록

- `starter/public/assets/maps/korea-route-map.png`
- `starter/public/assets/hub-market.png`
- `starter/public/assets/hub-office.png`
- `starter/public/assets/hub-tavern.png`
- `starter/public/assets/hub-shipyard.png`
- `starter/public/assets/hub-map.png`

외부 무료 에셋은 가져오지 않았다.

## 3. 항구 핫스팟 배치 방식

`App.tsx`에 `HOTSPOT_LAYOUTS`를 두고 `visualType`별로 시장, 관청, 술집, 조선소/수레방, 출항/길목 위치를 다르게 잡았다.

- 남해 항구: 시장은 부두/마을 하단, 관청은 산기슭 건물, 조선소는 해안가
- 서해 갯벌: 시장은 갯벌 마을, 관청은 육지 쪽, 출항은 물길 쪽
- 내륙 도시: 조선소 대신 수레방, 출항 대신 길목
- 동해/제주/대마도: 항구 배경에 맞춰 해안과 건물 위주로 재배치

## 4. 한국 지도 구현 방식

`starter/public/assets/maps/korea-route-map.png`를 만들고 `.map-board` 배경으로 적용했다. 기존 포트 노드, 루트 선, 이동 애니메이션은 유지했다.

정밀 지도 구현이 아니라 게임용 픽셀아트 전경이다. 남해, 서해, 동해, 제주, 대마도 위치감을 전달하는 것을 우선했다.

## 5. 선박 정박지와 육로/해로 분리

저장 상태에 `shipPortId`를 추가했다. 기존 저장 데이터는 `normalizeState`에서 현재 항구 또는 시작 항구로 보정한다.

- 해로 이동 완료: 선박 정박지가 도착 항구로 이동
- 육로 이동 완료: 선박 정박지는 이전 항구에 유지
- 육로 산적/도적 사건: 수레 내구도 피해
- 해로 위험 사건: 선박 내구도 피해
- 이벤트 결과에 “배는 정박지에 있어 손상되지 않았습니다.” 문구 표시

현재 항구가 해로와 연결된 항구라면 비용과 날짜를 들여 다른 항구에 있는 배를 불러올 수 있다. 내륙 도시는 배 호출이 막힌다.

## 6. 적재 한계

현재 보관 한계는 `현재 위치의 배 + 수레`로 계산한다. 단 이동할 때는 경로별 한계를 적용한다.

- 육로: 수레 적재량만 사용
- 해로: 배 적재량 + 배에 실을 수 있는 수레 짐 일부

지도 미리보기에는 경로별 적재 한계를 짧은 칩으로 표시한다.

## 7. 테스트 결과

- `npm run validate:data`: 성공
- `npm run build`: 성공
- `npm run test:smoke`: 성공

Google Drive 경로의 `node_modules` 문제를 피하기 위해 빌드/스모크는 temp copy에서 검증했다. 원본 소스 변경사항은 저장소에 남겼다.

## 8. 가로화면 UI 확인 결과

스크린샷 저장 경로: `.logs/mobile-landscape-map-berth-pass/`

- `south-port-hotspots.png`
- `west-mudflat-hotspots.png`
- `inland-hotspots.png`
- `east-port-hotspots.png`
- `jeju-hotspots.png`
- `tsushima-hotspots.png`
- `korea-map.png`
- `land-event-cart-damage.png`

확인 결과 844×390, 932×430에서 가로 스크롤 없이 표시되었다. 390×844 세로 화면에서는 가로 플레이 안내가 표시된다.

## 9. 남은 한계

- 항구별 완전 개별 좌표가 아니라 6개 지역 배경 유형별 좌표를 사용한다.
- 한국 지도는 픽셀아트 게임 지도이며 실제 해안선 정확도는 낮다.
- 배 호출 서비스는 단순 비용/날짜 처리이며, 별도 나룻배 NPC 연출은 아직 없다.
- 우측 정보 패널은 아직 일부 카드/텍스트형 UI가 남아 있다.

## 10. 다음 추천 작업

1. 우측 패널을 장면 안 팝업/간판/장부 UI로 줄여 텍스트 박스 느낌을 더 제거한다.
2. 항구별 고유 scene asset이 추가되면 핫스팟 좌표도 항구 단위로 세분화한다.
3. 배 호출 서비스를 항구 사공/나룻배 NPC 시설로 연출한다.

# 2026-05-07 Light Phase 5 Release QA

## 1. 최종 수정 요약

- `junior-game` 독립 라이트버전의 모바일 세로 UX, 지도, 장터, 이동, 이벤트, 탈것, 엔딩 흐름을 통합 검수했다.
- 장터 판매 카드의 하단 보조 문구가 잘리는 문제를 수정했다.
- 사용하지 않는 저용량/구형 잔여 에셋을 제거했다.
- `*.tsbuildinfo`를 `.gitignore`에 추가해 빌드 부산물이 커밋에 섞이지 않게 했다.

## 2. 남은 이슈

- 이동 배경은 현재 CSS 2D 레이어 기반이다. 주요 장거리 루트 전용 PNG/WEBP 컷신을 추가하면 더 고급스럽다.
- 일부 상품 아이콘은 충분히 읽히지만, 도시 배경 수준의 고급 일러스트와 비교하면 이후 교체 여지가 있다.
- GitHub CLI `gh`는 설치되어 있지 않아 PR 생성 자동화는 수행하지 않았다.

## 3. Viewport별 검수 결과

- 360x800: city/map/market/travel/event/shop/endingChoice visibility 및 horizontal overflow 통과
- 390x844: 통과
- 393x873: 통과
- 412x915: 통과
- 430x932: 통과
- 844x390: 통과

총 42개 화면/viewport 조합에서 `bad: []` 확인.

## 4. 주요 플레이 흐름 검수 결과

- 시작 화면 진입: 통과
- 튜토리얼 시작/도시 진입: 통과
- 장터 구매와 짐칸 반영: 통과
- 지도 도시 선택과 이동 씬: 통과
- 이벤트/맞춤법 퀴즈: 통과
- 첫 방문 대화: 통과
- 장터 판매와 돈 증가: 통과
- 탈것 장만 화면: 통과
- 해상 이동/제주 이동 가능 상태: 통과
- 엔딩 선택 화면: 통과

## 5. 그래픽 품질 점검 결과

- 지도 배경: `korea-light-map.svg` 사용, 한국 전도 느낌 유지.
- 도시/이벤트 배경: WebP 2D 일러스트 톤 유지.
- 수레: junior 전용 PNG 4종 사용.
- 배: UI 선박 PNG 사용, 해상 이동 모션 적용.
- 요정/정우: 전용 스프라이트 사용.
- 제거: `junior-game/public/assets/scenes/cities/`, `vehicles/handcart.png`, 미사용 지도 이미지 2종.

## 6. 테스트 결과

- `cd junior-game && npm run build`: 통과
- `cd junior-game && npm run test`: 44 passed
- 저장 복구 스팟체크: 이동 중 새로고침 통과, 이벤트 중 새로고침 통과

## 7. 배포 가능 여부

배포 가능. 라이트버전은 모바일 세로 기준으로 시작, 지도, 장터, 이동, 이벤트, 탈것 성장, 저장, 엔딩까지 이어진다.

## 8. 스크린샷 경로

- `.logs/2026-05-07-light-phase5-release-qa/home.png`
- `.logs/2026-05-07-light-phase5-release-qa/city.png`
- `.logs/2026-05-07-light-phase5-release-qa/map.png`
- `.logs/2026-05-07-light-phase5-release-qa/market.png`
- `.logs/2026-05-07-light-phase5-release-qa/travel.png`
- `.logs/2026-05-07-light-phase5-release-qa/event.png`
- `.logs/2026-05-07-light-phase5-release-qa/shop.png`
- `.logs/2026-05-07-light-phase5-release-qa/ending.png`
- `.logs/2026-05-07-light-phase5-release-qa/mobile-390x844.png`
- `.logs/2026-05-07-light-phase5-release-qa/mobile-412x915.png`
- `.logs/2026-05-07-light-phase5-release-qa/mobile-430x932.png`

## 9. Git 상태 요약

- 현재 브랜치: `main`
- 기존 원격: `https://github.com/SeungMin-Park-psm1757/joseon-trade-for-son.git`
- 요청 원격: `https://github.com/SeungMin-Park-psm1757/joseon-trade-for-son-light-version`
- 커밋 전 의도한 스테이징 범위: `.gitignore`, `junior-game/`, `docs/JUNIOR_MODE_DESIGN.md`, `.logs/*.md`
- 제외 범위: 기존 `starter/` 변경, full mode 문서 변경, 스크린샷 PNG, 빌드/테스트 부산물

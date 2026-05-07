# 2026-05-08 Junior PWA Release Polish

## 1. 변경 요약

- `junior-game`에 PWA 기본 구성을 추가했다.
- 첫 로딩 화면을 추가해 빈 화면 노출을 줄였다.
- 저장 데이터에 `saveVersion`, `lastSavedAt`을 추가했다.
- 저장 데이터 손상, `localStorage` 실패 상황에서 기본값 또는 메모리 저장으로 복구하도록 보강했다.
- 이어하기 카드에 현재 도시, 돈, 별, 짐칸, 마지막 저장 시각을 표시했다.
- 네트워크 끊김 안내 배너와 이미지 로딩 실패 fallback을 추가했다.

## 2. PWA 구성

- manifest: `junior-game/public/manifest.json`
- service worker: `junior-game/public/service-worker.js`
- offline fallback: `junior-game/public/offline.html`
- icons:
  - `junior-game/public/icons/icon-192.png`
  - `junior-game/public/icons/icon-512.png`
  - 실제 파일 크기 확인: `192x192`, `512x512`

Manifest 주요 값:

- name: `정우의 꼬마 거상 모험`
- short_name: `꼬마 거상`
- display: `standalone`
- orientation: `portrait`
- theme_color: `#8bd6d0`
- background_color: `#dff5cf`

## 3. 저장 안정성

- 저장 키는 기존 `joseon_trade_junior_save_v1` 유지.
- 저장 버전은 `2`.
- `normalizeJuniorSave`에서 오래된 저장이나 누락 필드를 보정한다.
- JSON 파싱 실패 시 저장 키를 지우고 새 기본값으로 복구한다.
- `localStorage`가 막힌 환경에서는 세션 중 메모리 저장으로 버틴다.

## 4. 오프라인/네트워크

- 핵심 HTML, manifest, icon, offline page, 정우/요정 기본 이미지를 service worker가 캐시한다.
- 네트워크 끊김 시 앱 안에 “인터넷이 잠깐 끊겼어...” 배너를 표시한다.
- 이미지 로딩 실패 시 장부 fallback 이미지로 대체한다.

## 5. 성능 점검

- 빌드 결과:
  - JS bundle: `269.02 kB`, gzip `81.80 kB`
  - CSS: `37.43 kB`, gzip `8.73 kB`
- 상품/도시/이동/이벤트 이미지에는 주요 위치에 lazy loading과 fallback을 적용했다.

## 6. 테스트 결과

실행 위치: `junior-game`

```text
npm run build
통과

npm run test
60 passed
```

추가 preview 검수:

- `npx vite preview --host 127.0.0.1 --port 4390`
- 390x844: manifest, service worker, 손상 저장 복구, 이어하기, 오프라인 배너, console error 0
- 412x915: manifest, service worker, 손상 저장 복구, 이어하기, 오프라인 배너, console error 0
- 430x932: manifest, service worker, 손상 저장 복구, 이어하기, 오프라인 배너, console error 0
- 엔딩 후 다시 하기 정상

## 7. 스크린샷

- `.logs/2026-05-08-junior-pwa-release-polish/mobile-390x844.png`
- `.logs/2026-05-08-junior-pwa-release-polish/mobile-412x915.png`
- `.logs/2026-05-08-junior-pwa-release-polish/mobile-430x932.png`
- `.logs/2026-05-08-junior-pwa-release-polish/ending-restart.png`
- `.logs/2026-05-08-junior-pwa-release-polish/preview-summary.json`

## 8. 남은 한계

- 완전한 오프라인 신규 플레이 보장은 아니다. 핵심 셸과 일부 필수 에셋 위주로 캐시한다.
- 대형 도시/이동 아트 전체를 사전 캐시하지 않아 첫 방문 시 네트워크가 필요할 수 있다.
- 홈 화면 설치 가능 여부는 브라우저별 정책에 따라 설치 UI 노출 방식이 다를 수 있다.

## 9. 배포 가능 여부

- PWA 기본 요건, 저장 복구, 모바일 preview 검수가 통과했다.
- full mode 파일은 건드리지 않고 `junior-game` 중심으로 유지했다.

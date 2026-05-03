# 2026-04-29 New BGM Compression Integration

## 변경 요약

- `bgm/new`의 신규 8개 MP3를 앱용 오디오 에셋으로 압축 복사했다.
- 7개 BGM은 모두 1MB 이하로 맞췄고, 8번째 `Arrival_at_Dawn`은 의뢰/발견 완료 팬페어 SFX로 반영했다.
- 오디오 장면을 `port`, `market`, `map`에서 `office`, `shipyard`, `tavern`, `danger`까지 확장했다.
- 탭과 이벤트 상태에 따라 더 알맞은 배경음이 재생되도록 `App.tsx` 씬 선택 로직을 수정했다.
- smoke test의 오디오 기대값을 새 시장 BGM으로 갱신했다.

## 반영한 오디오 매핑

| 원본 파일 | 앱 에셋 파일 | 사용처 | 크기 |
| --- | --- | --- | --- |
| `Harbor_at_First_Light.mp3` | `bgm-port-harbor-first-light.mp3` | 항구 | 888,345 bytes |
| `Morning_at_the_Wooden_Port.mp3` | `bgm-market-wooden-port.mp3` | 시장 | 870,165 bytes |
| `Beyond_the_Village_Gate.mp3` | `bgm-map-village-gate.mp3` | 지도/이동 | 890,865 bytes |
| `Crossing_the_Morning_Tide.mp3` | `bgm-office-morning-tide.mp3` | 관청/의뢰 | 876,825 bytes |
| `Morning_at_the_Dockyard.mp3` | `bgm-shipyard-dockyard.mp3` | 조선소/장비 | 864,585 bytes |
| `Tea_and_Market_Rumors.mp3` | `bgm-tavern-rumors.mp3` | 술집/장부/화물 | 893,385 bytes |
| `Mist_on_the_Mountain_Pass.mp3` | `bgm-danger-mountain-pass.mp3` | 위험 이벤트 | 884,925 bytes |
| `Arrival_at_Dawn.mp3` | `sfx-discovery-arrival-fanfare.mp3` | 의뢰/발견 팬페어 | 238,725 bytes |

## 압축 방식

- 임시 도구 폴더에 `ffmpeg-static`을 설치해 저장소 의존성은 변경하지 않았다.
- BGM: MP3, mono, 32kHz, 40kbps.
- 팬페어 SFX: MP3, mono, 32kHz, 80kbps.
- 원본 MP3는 `bgm/new`에 그대로 보존했다.

## 코드 변경

- `starter/src/audio.ts`
  - `AudioScene`에 `office`, `shipyard`, `tavern`, `danger` 추가.
  - 신규 BGM 파일들을 `MUSIC_TRACKS`에 연결.
  - 파일 재생 실패 시 쓰는 절차적 fallback 패턴도 신규 장면까지 보강.
  - 의뢰 완료 SFX를 신규 팬페어로 교체.
- `starter/src/App.tsx`
  - 이벤트 중에는 `danger` BGM.
  - 시장/지도/의뢰/장비/장부 계열 탭별 BGM 매핑.
- `starter/tests/smoke.spec.ts`
  - 오디오 smoke test가 `bgm-market-wooden-port.mp3`를 확인하도록 갱신.

## 테스트 결과

- `npm run validate:data`: 성공.
- `npm run audit:consistency`: 성공. Git checkout이 아니라는 기존 환경 경고만 있음.
- `npm run build`: 성공.
- `npm run test:smoke`: 성공, 6 passed.
- `npm run test:visual`: 성공.

## 남은 한계

- 3분대 BGM을 1MB 이하로 맞추기 위해 40kbps mono로 압축했다. 모바일 배경음으로는 충분히 가볍지만, 고음질 감상용은 아니다.
- 현재는 탭 단위 장면 매핑이다. 시설 내부 세부 상태별 음악 전환은 다음 패스에서 더 섬세하게 나눌 수 있다.
- 위험 이벤트 BGM은 pending/result 상태 기준으로 전환되며, 이벤트 종류별 개별 BGM까지는 아직 나누지 않았다.

## 다음 추천 작업

1. 시설별 BGM 전환을 실제 NPC 시설 상태와 더 정밀하게 연결한다.
2. 효과음을 사용자 제작/생성 에셋으로 2차 교체해 구매, 판매, 출항, 도착의 차이를 더 크게 만든다.
3. 오디오 프리로드/캐시 정책을 정리해 첫 진입 시 끊김을 줄인다.

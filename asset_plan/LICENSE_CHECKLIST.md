# 에셋 라이선스 체크리스트

외부 에셋을 실제 게임에 넣기 전에 아래 항목을 확인한다.

## 1. 기본 정보

| 항목 | 기록 |
|---|---|
| 에셋 이름 |  |
| 제작자 |  |
| 다운로드 URL |  |
| 다운로드 날짜 |  |
| 라이선스 |  |
| 상업적 사용 가능 여부 |  |
| 저작자 표시 필요 여부 |  |
| 수정 가능 여부 |  |
| 재배포 가능 여부 |  |
| 포함된 폰트 여부 |  |

## 2. 라이선스 판단

- CC0: 사용 우선순위 높음
- MIT/Apache: 코드·일부 에셋 가능, 조건 확인
- CC BY: 저작자 표시 필요
- CC BY-SA: 동일조건 공유 가능성 주의
- GPL/LGPL: 프로젝트 적용 전 별도 판단 필요
- 라이선스 없음: 사용 금지
- 개인용 무료만 허용: 사용 금지 또는 프로토타입 내부용만

## 3. 프로젝트 반영 전 확인

- [ ] 라이선스 파일을 `public/assets/licenses/`에 보관했다.
- [ ] 출처와 제작자를 문서화했다.
- [ ] 저작자 표시 필요 여부를 확인했다.
- [ ] 폰트 파일이 포함되어 있지 않은지 확인했다.
- [ ] 상업적 사용 가능 여부를 확인했다.
- [ ] 수정/리컬러가 허용되는지 확인했다.
- [ ] 에셋이 특정 IP/게임을 모방하지 않는지 확인했다.

## 4. MVP 권장

초기에는 에셋을 넣지 않아도 된다. CSS, SVG, 텍스트, 이모지로 구현하고 게임 루프를 먼저 완성한다.

## 2026-04-28 User Generated Audio Note

The 21 MP3 files copied into `starter/public/assets/audio/` were provided by the user after generating them from project-specific prompts. Codex did not download third-party audio in this pass.

- Asset set: Joseon trade RPG BGM/SFX MP3 files
- Source folder: `bgm/`
- Runtime folder: `starter/public/assets/audio/`
- Source type: user-provided generated assets
- External download URL: none used by Codex
- Follow-up: if the final publishing target requires formal provenance, record the generator/service terms used by the user.

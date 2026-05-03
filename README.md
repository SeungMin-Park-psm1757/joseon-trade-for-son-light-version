# 팔도상단: 조선의 바람

[![CI](https://github.com/SeungMin-Park-psm1757/joseon-trade-for-son/actions/workflows/ci.yml/badge.svg)](https://github.com/SeungMin-Park-psm1757/joseon-trade-for-son/actions/workflows/ci.yml)

조선 후기의 항구와 장터를 오가며 물건을 사고팔고, 길 위의 사건을 해결하고, 배와 수레를 키워 더 먼 교역로를 여는 모바일 웹 RPG입니다.

## 바로 플레이

- 배포 주소: https://joseon-trade-for-son.vercel.app/
- 권장 화면: 모바일 또는 데스크톱 브라우저의 가로 화면
- 핵심 검증 크기: `844x390`, `932x430`, `1366x768`, `1600x900`, `1920x1080`

## 현재 상태

- Vite + React + TypeScript 기반의 정적 웹앱입니다.
- 서버, 로그인, 결제, 멀티플레이는 없습니다.
- 저장은 브라우저 `localStorage`에 자동으로 남습니다.
- 데이터는 `starter/public/data/*.json`에서 로드합니다.
- GitHub Actions CI와 Vercel 배포가 연결되어 있습니다.
- Vercel 프로젝트의 Root Directory는 반드시 `starter`입니다.

## 게임 특징

- 현대의 정우가 갑자기 조선 후기 부산(부산포)에 도착해 요정의 안내를 받으며 첫 장사를 배웁니다.
- 튜토리얼에서는 현대인 정우가 이해하기 쉽도록 지명을 `현대 지명(조선 시대 지명)` 형식으로 설명합니다.
- 예: `부산(부산포)`, `서울(한양)`, `쓰시마(대마도)`, `신의주(의주)`, `청진(경흥)`.
- 지도와 교역 설정은 조선 후기 기준을 따르며, 국경 교역은 중국/러시아 본토 확장이 아니라 압록강과 두만강 인근의 제한된 장시/북방 교역로로 다룹니다.
- 요정은 단순 도움말이 아니라 다음 행동을 알려주는 대화형 동반자로 작동합니다.
- 배, 지게, 수레, 장비, 동료, 허가증은 장기 성장 목표로 설계되어 있습니다.

## 주요 플레이 루프

```text
새 게임 시작
-> 부산(부산포)에서 물건 구매
-> 지도에서 이동할 항구 선택
-> 이동 중 사건 해결
-> 도착지 시장에서 판매
-> 이익으로 배/수레/장비 성장
-> 허가증과 준비를 갖춰 먼 교역로 도전
```

## 로컬 실행

```bash
cd starter
npm install
npm run dev
```

Vite 개발 서버가 뜨면 브라우저에서 안내된 로컬 주소를 열면 됩니다.

## 검증 명령

```bash
cd starter
npm run validate:data
npm run audit:consistency
npm run build
npm run test:smoke
npm run test:visual
```

GitHub Actions에서도 같은 흐름으로 데이터 검증, 일관성 감사, 빌드, Playwright 스모크 테스트, 비주얼 검사를 실행합니다.

## Vercel 배포 설정

Vercel에서 이 저장소를 새 프로젝트로 가져올 때 아래처럼 설정합니다.

```text
Framework Preset: Vite
Root Directory: starter
Install Command: npm ci
Build Command: npm run build
Output Directory: dist
Environment Variables: 없음
```

가장 중요한 항목은 `Root Directory: starter`입니다. 앱의 실제 `package.json`과 Vite 설정이 저장소 루트가 아니라 `starter/` 안에 있습니다.

## 저장소 구조

```text
.
├─ starter/                  # 실제 Vite + React 게임 앱
│  ├─ public/data/           # 항구, 상품, 루트, 사건, 퀘스트 JSON 데이터
│  ├─ public/assets/         # 지도, 2D 자산, 오디오, UI 이미지
│  ├─ src/                   # React/TypeScript 앱 코드
│  ├─ tests/                 # Playwright 스모크 테스트
│  └─ scripts/               # 데이터 검증, 일관성 감사, 비주얼 검사
├─ docs/                     # 시스템/UI/범위 문서
├─ tests/                    # 인수 검증 체크리스트
├─ prompts/                  # Codex 작업 프롬프트
├─ asset_plan/               # 외부 에셋 라이선스 점검 계획
└─ .github/workflows/ci.yml  # GitHub Actions CI
```

## QA 기준

현재 MVP는 “텍스트 앱”이 아니라 가로형 모바일 웹게임을 목표로 합니다. 수정 시 아래 기준을 특히 봅니다.

- 2D 자산이 임시 그림처럼 보이지 않는지
- 캐릭터와 장비가 잘리거나 찌그러지지 않는지
- 우측 패널과 하단 패널이 서로 겹치지 않는지
- 다음 행동이 항상 분명한지
- 어린이가 읽기 어려운 UI 용어가 남아 있지 않은지
- 지도, 지명, 교역 세계관이 조선 후기 기준에서 어색하지 않은지

사용자가 다시 스크린샷을 보았을 때 “아직도 임시 게임 같다”는 느낌이 남아 있으면 통과로 보지 않습니다.

## 개발 메모

- 구현 작업은 `starter/` 안에서 진행합니다.
- 데이터 ID와 JSON 구조는 저장 호환성 때문에 함부로 바꾸지 않습니다.
- 항구, 상품, 루트, 사건 데이터는 코드에 대량 하드코딩하지 않습니다.
- 새 에셋을 실제 포함할 때는 라이선스를 확인합니다.
- UI 수정 후 가능하면 브라우저 또는 Playwright로 실제 화면을 확인합니다.

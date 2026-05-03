# 구현 계획

## 1. 추천 기술 스택

- Vite
- React
- TypeScript
- CSS Modules 또는 일반 CSS
- LocalStorage
- SVG/HTML 기반 추상 지도

## 2. 구현 단계

### 1단계: 프로젝트 정리

- `starter/`에서 `npm install`
- React 앱 기본 실행 확인
- `public/data` JSON 로딩 유틸 작성
- TypeScript 타입 정리

### 2단계: 게임 상태

- `createNewGame()` 구현
- `loadGame()` 구현
- `saveGame()` 구현
- 상태 reducer 또는 Zustand 없이 React reducer로 구현 가능

권장 파일:

```text
src/
├─ main.tsx
├─ App.tsx
├─ types.ts
├─ dataLoader.ts
├─ gameState.ts
├─ economy.ts
├─ travel.ts
├─ events.ts
├─ storage.ts
├─ components/
│  ├─ StatusBar.tsx
│  ├─ MapView.tsx
│  ├─ PortPanel.tsx
│  ├─ MarketView.tsx
│  ├─ CargoView.tsx
│  ├─ VehicleView.tsx
│  ├─ EventModal.tsx
│  └─ QuestView.tsx
└─ styles.css
```

### 3단계: 지도와 이동

- SVG 지도 배경을 단순하게 만든다.
- `ports.json`의 x/y 좌표로 항구 버튼을 표시한다.
- 현재 위치에서 연결된 routes만 표시한다.
- 출발 전 이동 정보 카드 표시.

### 4단계: 시장

- 현재 항구 가격표 표시
- 구매/판매 버튼
- 화물칸 제한
- 돈 부족 처리
- 상품 부패 정보 표시

### 5단계: 월별 경제

- 새 게임 생성 시 전체 항구 가격표 생성
- 월 변경 시 가격표 재생성
- 가격표는 저장 데이터에 포함

### 6단계: 이벤트

- 이동 완료 전후로 위험 이벤트 판정
- 이벤트 선택지 처리
- 이벤트 결과 로그 표시

### 7단계: 어업

- 어업 가능한 항구에서 버튼 표시
- 하루 소모
- 보상 상품 추가
- 어업 결과 카드 표시

### 8단계: 전투

- 해적/도적 이벤트에서 간단 전투 호출
- MVP에서는 자동 전투도 허용
- 가능하면 4선택지 전투로 구현

### 9단계: 퀘스트

- 튜토리얼 퀘스트 3개 먼저 구현
- 목표 달성 시 보상 지급
- 진행 상황 표시

### 10단계: 모바일 polish

- 작은 화면 스크롤 안정화
- 버튼 크기 조정
- 상태바 고정
- 하단 탭 고정
- 색상/아이콘 개선

## 3. 테스트 순서

1. 새 게임 시작
2. 부산포 시장에서 면포 구매
3. 대구로 이동
4. 면포 판매
5. 돈 증가 확인
6. 월 넘기기 또는 이동 반복 후 가격 변경 확인
7. 목포/제주 항로 위험 이벤트 확인
8. 손수레 구매 확인
9. 저장 후 새로고침 → 이어하기 확인
10. 대마도 허가장 조건 확인

## 4. 확장 준비

1차 MVP 이후 다음 기능을 추가하기 쉽게 구조화한다.

- 중국 본토 항구 추가
- 일본 본토 항구 추가
- 항구 투자 시스템
- Phaser 지도/애니메이션 전환
- 이미지 생성 에셋 적용
- 더 복잡한 해전

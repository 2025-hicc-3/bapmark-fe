# 🍽️ BapMark - 맛집 지도 공유 서비스

모바일 웹 기반의 맛집 지도 공유 서비스입니다. 카카오 지도 API를 활용하여 맛집을 저장하고, 스탬프 시스템으로 방문 기록을 관리하며, 다른 사용자와 맛집 정보를 공유할 수 있습니다.

## ✨ 주요 기능

### 🗺️ 지도 기능

- 카카오 지도 API 연동
- 맛집 검색 및 저장
- 스탬프북 위치 표시
- 다른 사용자 게시물을 통한 맛집 저장

### 📝 게시판 기능

- 위치 정보가 포함된 게시물 작성
- 다른 사용자 게시물 조회
- 게시물을 통한 맛집 저장

### 🏷️ 스탬프 시스템

- 다녀온 맛집에 스탬프 찍기
- 최대 10개 장소까지 스탬프북 저장
- 스탬프북 목록 관리
- 스탬프북 공유 기능

### 👤 사용자 인증

- 구글 로그인 연동

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**

   ```bash
   npm install
   ```

2. **개발 서버 실행**

   ```bash
   npm run dev
   ```

## 🛠️ 기술 스택

### Frontend

- **React 18** - UI 라이브러리
- **TypeScript** - 정적 타입 지원
- **Vite** - 빌드 도구 및 개발 서버
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **React Router DOM** - 클라이언트 사이드 라우팅

### 상태 관리 & 데이터 페칭

- **Zustand** - 클라이언트 상태 관리
- **TanStack Query (React Query)** - 서버 상태 및 비동기 데이터 관리

### 코드 품질

- **ESLint** - 코드 린팅
- **Prettier** - 코드 포맷팅

### 외부 API

- **카카오 지도 API** - 지도 서비스
- **Google OAuth** - 사용자 인증

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트 (Header, Navigation)
│   └── map/           # 지도 관련 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── MapPage/       # 지도 페이지
│   ├── BoardPage/     # 게시판 페이지
│   ├── StampBookPage/ # 스탬프북 페이지
│   ├── MyPage/        # 마이페이지
│   └── LoginPage/     # 로그인 페이지
├── store/              # Zustand 스토어
├── services/           # API 서비스 및 설정
├── hooks/              # 커스텀 훅
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── assets/             # 정적 자산 (이미지, 아이콘 등)
├── App.tsx            # 메인 앱 컴포넌트
├── main.tsx           # 앱 진입점
└── index.css          # 글로벌 스타일
```

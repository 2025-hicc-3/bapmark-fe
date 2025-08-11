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

### 환경 변수 설정

`front/fe` 디렉토리에 `.env` 파일을 생성하세요:

```env
# API 설정
VITE_API_BASE_URL=http://localhost:8080

# Google OAuth 설정
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# 개발 환경 설정
VITE_APP_ENV=development
```

## 🛠️ 기술 스택

### Frontend

- **React 18** - UI 라이브러리
- **TypeScript** - 정적 타입 지원
- **Vite** - 빌드 도구 및 개발 서버
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **React Router DOM** - 클라이언트 사이드 라우팅

### 상태 관리 & 데이터 페칭

- **React Context API** - 전역 상태 관리
- **Custom Hooks** - 인증 및 API 통신

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
│   ├── auth/           # 인증 관련 컴포넌트
│   ├── map/           # 지도 관련 컴포넌트
│   └── stampbook/     # 스탬프북 관련 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── MapPage/       # 지도 페이지
│   ├── BoardPage/     # 게시판 페이지
│   └── BoardDetailPage/ # 게시물 상세 페이지
├── store/              # React Context 스토어
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── assets/             # 정적 자산 (이미지, 아이콘 등)
├── App.tsx            # 메인 앱 컴포넌트
├── main.tsx           # 앱 진입점
└── index.css          # 글로벌 스타일
```

## 🔧 API 통신

### 테스트 로그인 구현

프로젝트에는 실제 API 응답을 시뮬레이션하는 테스트 로그인 시스템이 포함되어 있습니다:

1. **테스트 로그인 버튼**: 개발 중 빠른 테스트를 위해 로그인 모달에서 사용 가능
2. **API 시뮬레이션**: 실제 API 응답 구조와 동일한 테스트 데이터 생성
3. **쉬운 교체**: 나중에 실제 API 호출로 쉽게 교체 가능

### API 엔드포인트

모든 API 엔드포인트는 API 명세서에 따라 정의되어 있습니다:

- **인증**: `/api/auth/*`
- **사용자**: `/api/user/*`
- **게시물**: `/api/posts/*`
- **북마크**: `/users/me/bookmarks`
- **스탬프보드**: `/api/stampboards/*`
- **공유 링크**: `/api/share/*`

### 타입 안전성

모든 API 응답은 백엔드 API 명세서와 일치하는 TypeScript 인터페이스로 완전히 타입이 지정되어 있습니다.

## 🧪 테스트

### 테스트 로그인

개발 중 테스트 로그인 버튼을 사용하여:

- 백엔드 없이도 인증 플로우 테스트
- UI 컴포넌트가 올바르게 작동하는지 확인
- 실제 사용자 경험 시뮬레이션

### API 테스트

백엔드가 준비되면:

1. 테스트 로그인을 실제 API 호출로 교체
2. 응답 데이터 구조가 TypeScript 인터페이스와 일치하는지 확인
3. 에러 처리 및 엣지 케이스 테스트

## 📚 문서

- **API 명세서**: `../history/api-specification.md` 참조
- **커서 룰**: `.cursor/rules/` 개발 가이드라인 참조
- **타입 정의**: `src/types/` API 인터페이스 참조

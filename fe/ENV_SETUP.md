# 환경 변수 설정 가이드

## 카카오맵 API 키 설정

1. **카카오 개발자 센터에서 API 키 발급**
   - https://developers.kakao.com 접속
   - 애플리케이션 생성
   - JavaScript 키 복사

2. **환경 변수 파일 생성**
   프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

   ```
   VITE_KAKAO_MAP_API_KEY=your_kakao_map_javascript_key_here
   VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key_here
   ```

3. **API 키 적용**
   - `your_kakao_map_javascript_key_here` 부분을 실제 발급받은 JavaScript 키로 교체
   - `your_kakao_rest_api_key_here` 부분을 실제 발급받은 REST API 키로 교체
   - 개발 서버 재시작

4. **카카오 REST API 활성화**
   - 카카오 개발자 센터에서 "플랫폼" > "Web" 설정
   - "카카오 로그인" > "활성화 설정" > "REST API 키" 확인
   - "카카오 로그인" > "동의항목" 설정

## Google OAuth 클라이언트 ID 설정

1. **Google Cloud Console에서 OAuth 클라이언트 ID 발급**
   - https://console.cloud.google.com 접속
   - 프로젝트 생성 또는 선택
   - "API 및 서비스" > "사용자 인증 정보" 메뉴로 이동
   - "사용자 인증 정보 만들기" > "OAuth 2.0 클라이언트 ID" 선택
   - 애플리케이션 유형을 "웹 애플리케이션"으로 설정
   - 승인된 JavaScript 원본에 `http://localhost:5173` (개발 환경) 추가
   - 승인된 리디렉션 URI에 `http://localhost:5173` 추가

2. **환경 변수에 추가**
   `.env` 파일에 다음 내용을 추가하세요:

   ```
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
   ```

3. **Google OAuth 라이브러리 추가**
   `index.html` 파일의 `<head>` 섹션에 다음 스크립트를 추가하세요:

   ```html
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   ```

## 테스트 페이지 접근

- URL: `/maptest`
- 카카오맵 테스트 기능 확인

## 주의사항

- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다
- 프로덕션 환경에서는 별도로 환경 변수를 설정해야 합니다
- API 키는 절대 공개 저장소에 커밋하지 마세요
- Google OAuth 클라이언트 ID도 보안을 위해 공개하지 마세요

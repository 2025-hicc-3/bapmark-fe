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
   ```

3. **API 키 적용**
   - `your_kakao_map_javascript_key_here` 부분을 실제 발급받은 JavaScript 키로 교체
   - 개발 서버 재시작

## 테스트 페이지 접근

- URL: `/maptest`
- 카카오맵 테스트 기능 확인

## 주의사항

- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다
- 프로덕션 환경에서는 별도로 환경 변수를 설정해야 합니다
- API 키는 절대 공개 저장소에 커밋하지 마세요

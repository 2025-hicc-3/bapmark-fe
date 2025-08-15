import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { userAPI, postAPI } from '../../utils/api';
import HeaderWithoutSearch from '../../components/layout/HeaderWithoutSearch';
import Navigation from '../../components/layout/Navigation';

const ApiTestPage = () => {
  const { getToken, isLoggedIn } = useAuth();
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentToken, setCurrentToken] = useState<string>('');

  useEffect(() => {
    const token = getToken();
    if (token) {
      setCurrentToken(token);
    }
  }, [getToken]);

  const testUsersMe = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      const token = getToken();
      if (!token) {
        setTestResult('❌ 토큰이 없습니다. 먼저 로그인해주세요.');
        return;
      }

      setTestResult('🔄 GET /api/user/me API 호출 중...\n');
      setTestResult((prev) => prev + `토큰: ${token.substring(0, 20)}...\n`);

      const response = await userAPI.getMe();

      if (response.data) {
        setTestResult(
          (prev) =>
            prev +
            `✅ 성공!\n\n응답 데이터:\n${JSON.stringify(response.data, null, 2)}`
        );
      } else {
        setTestResult(
          (prev) =>
            prev +
            `❌ 응답 데이터가 없습니다.\n\n응답:\n${JSON.stringify(response, null, 2)}`
        );
      }
    } catch (error: any) {
      console.error('API 테스트 오류:', error);

      let errorMessage = '❌ API 호출 실패\n\n';

      if (error.response) {
        // 서버 응답이 있는 경우
        errorMessage += `상태 코드: ${error.response.status}\n`;
        errorMessage += `응답 데이터: ${JSON.stringify(error.response.data, null, 2)}\n`;
      } else if (error.request) {
        // 요청은 보냈지만 응답이 없는 경우
        errorMessage += '서버에 연결할 수 없습니다.\n';
        errorMessage += `요청: ${JSON.stringify(error.request, null, 2)}\n`;
      } else {
        // 요청 자체에 문제가 있는 경우
        errorMessage += `요청 오류: ${error.message}\n`;
      }

      setTestResult(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const testPostsAllPosts = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      const token = getToken();
      if (!token) {
        setTestResult('❌ 토큰이 없습니다. 먼저 로그인해주세요.');
        return;
      }

      setTestResult('🔄 GET /posts/allPosts API 호출 중...\n');

      const response = await postAPI.getAllPosts();

      if (response.data) {
        setTestResult(
          (prev) =>
            prev +
            `✅ 성공!\n\n응답 데이터:\n${JSON.stringify(response.data, null, 2)}`
        );
      } else if (response.error) {
        setTestResult(
          (prev) =>
            prev +
            `❌ API 에러: ${response.error}\n\n응답:\n${JSON.stringify(response, null, 2)}`
        );
      } else {
        setTestResult(
          (prev) =>
            prev +
            `❌ 응답 데이터가 없습니다.\n\n응답:\n${JSON.stringify(response, null, 2)}`
        );
      }
    } catch (error: any) {
      console.error('게시글 API 테스트 오류:', error);

      let errorMessage = '❌ 게시글 API 호출 실패\n\n';

      if (error.response) {
        // 서버 응답이 있는 경우
        errorMessage += `상태 코드: ${error.response.status}\n`;
        errorMessage += `응답 데이터: ${JSON.stringify(error.response.data, null, 2)}\n`;
      } else if (error.request) {
        // 요청은 보냈지만 응답이 없는 경우
        errorMessage += '서버에 연결할 수 없습니다.\n';
        errorMessage += `요청: ${JSON.stringify(error.request, null, 2)}\n`;
      } else {
        // 요청 자체에 문제가 있는 경우
        errorMessage += `요청 오류: ${error.message}\n`;
      }

      setTestResult(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 홍익대학교를 북마크에 저장하는 테스트
  const testAddBookmark = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      const token = getToken();
      if (!token) {
        setTestResult('❌ 토큰이 없습니다. 먼저 로그인해주세요.');
        return;
      }

      setTestResult('🔄 POST /users/search API 호출 중...\n');
      setTestResult((prev) => prev + '홍익대학교를 북마크에 저장합니다.\n\n');

      // 환경변수에서 /api 제거 (북마크 API는 /api 접두사 없음)
      const baseURL =
        import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';

      const response = await fetch(
        `${baseURL}/users/search?placeName=홍익대학교&address=서울 마포구 상수동 72-1&latitude=37.5519&longitude=126.9255`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.text();
        setTestResult(
          (prev) =>
            prev +
            `✅ 성공!\n\n응답 데이터:\n${data}\n\n상태 코드: ${response.status}`
        );
      } else {
        const errorData = await response.text();
        setTestResult(
          (prev) => prev + `❌ 실패 (${response.status})\n\n응답:\n${errorData}`
        );
      }
    } catch (error: any) {
      console.error('북마크 추가 API 테스트 오류:', error);
      setTestResult((prev) => prev + `❌ 오류: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자의 북마크를 조회하는 테스트
  const testGetBookmarks = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      const token = getToken();
      if (!token) {
        setTestResult('❌ 토큰이 없습니다. 먼저 로그인해주세요.');
        return;
      }

      setTestResult('🔄 GET /users/me/bookmarks API 호출 중...\n');
      setTestResult((prev) => prev + `토큰: ${token.substring(0, 20)}...\n`);

      // 환경변수에서 /api 제거 (북마크 API는 /api 접두사 없음)
      const baseURL =
        import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';

      setTestResult(
        (prev) => prev + `호출 URL: ${baseURL}/users/me/bookmarks\n\n`
      );

      const response = await fetch(`${baseURL}/users/me/bookmarks`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(
          (prev) =>
            prev +
            `✅ 성공!\n\n응답 데이터:\n${JSON.stringify(data, null, 2)}\n\n상태 코드: ${response.status}`
        );
      } else {
        const errorData = await response.text();
        setTestResult(
          (prev) =>
            prev +
            `❌ 실패 (${response.status})\n\n응답:\n${errorData}\n\n요청 헤더:\nAuthorization: Bearer ${token.substring(0, 20)}...`
        );
      }
    } catch (error: any) {
      console.error('북마크 조회 API 테스트 오류:', error);
      setTestResult((prev) => prev + `❌ 오류: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 방문한 북마크만 조회하는 테스트
  const testGetVisitedBookmarks = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      const token = getToken();
      if (!token) {
        setTestResult('❌ 토큰이 없습니다. 먼저 로그인해주세요.');
        return;
      }

      setTestResult('🔄 GET /users/me/bookmarks?visited=true API 호출 중...\n');

      // 환경변수에서 /api 제거 (북마크 API는 /api 접두사 없음)
      const baseURL =
        import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';

      const response = await fetch(
        `${baseURL}/users/me/bookmarks?visited=true`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTestResult(
          (prev) =>
            prev +
            `✅ 성공!\n\n응답 데이터:\n${JSON.stringify(data, null, 2)}\n\n상태 코드: ${response.status}`
        );
      } else {
        const errorData = await response.text();
        setTestResult(
          (prev) => prev + `❌ 실패 (${response.status})\n\n응답:\n${errorData}`
        );
      }
    } catch (error: any) {
      console.error('방문한 북마크 조회 API 테스트 오류:', error);
      setTestResult((prev) => prev + `❌ 오류: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 토큰 유효성 직접 확인 테스트
  const testTokenValidity = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      const token = getToken();
      if (!token) {
        setTestResult('❌ 토큰이 없습니다. 먼저 로그인해주세요.');
        return;
      }

      setTestResult('🔄 토큰 유효성 확인 중...\n');
      setTestResult((prev) => prev + `토큰: ${token.substring(0, 20)}...\n\n`);

      // 먼저 /api/user/me로 토큰 유효성 확인
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/me`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setTestResult(
          (prev) =>
            prev +
            `✅ 토큰 유효성 확인 성공!\n\n사용자 정보:\n${JSON.stringify(userData, null, 2)}\n\n상태 코드: ${userResponse.status}\n\n`
        );
      } else {
        const errorData = await userResponse.text();
        setTestResult(
          (prev) =>
            prev +
            `❌ 토큰 유효성 확인 실패 (${userResponse.status})\n\n응답:\n${errorData}\n\n`
        );
        setIsLoading(false);
        return;
      }

      // 토큰이 유효하면 북마크 API 테스트
      setTestResult((prev) => prev + '🔄 이제 북마크 API 테스트...\n');

      const baseURL =
        import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
      const bookmarkResponse = await fetch(`${baseURL}/users/me/bookmarks`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (bookmarkResponse.ok) {
        const bookmarkData = await bookmarkResponse.json();
        setTestResult(
          (prev) =>
            prev +
            `✅ 북마크 API 성공!\n\n응답 데이터:\n${JSON.stringify(bookmarkData, null, 2)}\n\n상태 코드: ${bookmarkResponse.status}`
        );
      } else {
        const errorData = await bookmarkResponse.text();
        setTestResult(
          (prev) =>
            prev +
            `❌ 북마크 API 실패 (${bookmarkResponse.status})\n\n응답:\n${errorData}\n\n요청 URL: ${baseURL}/users/me/bookmarks`
        );
      }
    } catch (error: any) {
      console.error('토큰 유효성 테스트 오류:', error);
      setTestResult((prev) => prev + `❌ 오류: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testWithCustomToken = async () => {
    if (!currentToken.trim()) {
      setTestResult('❌ 커스텀 토큰을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setTestResult('');

    try {
      setTestResult('🔄 커스텀 토큰으로 API 호출 중...\n');

      // 커스텀 토큰으로 API 호출
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/me`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTestResult(
          (prev) =>
            prev + `✅ 성공!\n\n응답 데이터:\n${JSON.stringify(data, null, 2)}`
        );
      } else {
        const errorData = await response.text();
        setTestResult(
          (prev) => prev + `❌ 실패 (${response.status})\n\n응답:\n${errorData}`
        );
      }
    } catch (error: any) {
      console.error('커스텀 토큰 API 테스트 오류:', error);
      setTestResult((prev) => prev + `❌ 오류: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setTestResult('');
  };

  const copyToken = () => {
    const token = getToken();
    if (token) {
      navigator.clipboard.writeText(token);
      alert('토큰이 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 헤더 (검색창 없음) */}
      <HeaderWithoutSearch />

      {/* 메인 콘텐츠 */}
      <main className="main-content-no-search flex-1 pt-15 pb-16">
        <div className="p-4 space-y-6">
          {/* 페이지 제목 */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              API 테스트 페이지
            </h1>
            <p className="text-gray-600 mt-2">
              백엔드 API 엔드포인트를 테스트할 수 있습니다.
            </p>
          </div>

          {/* 현재 토큰 정보 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              현재 토큰 정보
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  로그인 상태:
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isLoggedIn
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isLoggedIn ? '로그인됨' : '로그아웃됨'}
                </span>
              </div>

              {isLoggedIn && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      토큰:
                    </span>
                    <button
                      onClick={copyToken}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                    >
                      복사
                    </button>
                  </div>
                  <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                    {getToken()?.substring(0, 50)}...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* API 테스트 섹션 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              API 테스트
            </h2>

            <div className="space-y-4">
              {/* 기본 테스트 버튼들 */}
              <div className="space-y-3">
                <div>
                  <button
                    onClick={testUsersMe}
                    disabled={isLoading || !isLoggedIn}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isLoading || !isLoggedIn
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isLoading
                      ? '테스트 중...'
                      : 'GET /api/user/me 테스트 (현재 토큰)'}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    현재 로그인된 사용자의 토큰으로 사용자 정보 API를
                    테스트합니다.
                  </p>
                </div>

                <div>
                  <button
                    onClick={testPostsAllPosts}
                    disabled={isLoading || !isLoggedIn}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isLoading || !isLoggedIn
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isLoading
                      ? '테스트 중...'
                      : 'GET /api/posts/allPosts 테스트 (현재 토큰)'}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    현재 로그인된 사용자의 토큰으로 전체 게시글 목록 API를
                    테스트합니다.
                  </p>
                </div>

                {/* 토큰 유효성 및 북마크 API 통합 테스트 */}
                <div>
                  <button
                    onClick={testTokenValidity}
                    disabled={isLoading || !isLoggedIn}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isLoading || !isLoggedIn
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {isLoading
                      ? '테스트 중...'
                      : '🔍 토큰 유효성 + 북마크 API 통합 테스트'}
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    먼저 토큰 유효성을 확인한 후 북마크 API를 테스트합니다.
                  </p>
                </div>

                {/* 북마크 관련 테스트 버튼들 */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <h3 className="text-md font-semibold text-gray-800">
                    북마크 API 테스트
                  </h3>

                  <div>
                    <button
                      onClick={testAddBookmark}
                      disabled={isLoading || !isLoggedIn}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        isLoading || !isLoggedIn
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      {isLoading
                        ? '테스트 중...'
                        : 'POST /users/search - 홍익대학교 북마크 추가'}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      홍익대학교를 북마크에 저장하는 API를 테스트합니다.
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={testGetBookmarks}
                      disabled={isLoading || !isLoggedIn}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        isLoading || !isLoggedIn
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {isLoading
                        ? '테스트 중...'
                        : 'GET /users/me/bookmarks - 전체 북마크 조회'}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      사용자의 모든 북마크를 조회하는 API를 테스트합니다.
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={testGetVisitedBookmarks}
                      disabled={isLoading || !isLoggedIn}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        isLoading || !isLoggedIn
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-teal-500 text-white hover:bg-teal-600'
                      }`}
                    >
                      {isLoading
                        ? '테스트 중...'
                        : 'GET /users/me/bookmarks?visited=true - 방문한 북마크만 조회'}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      방문한 북마크만 필터링하여 조회하는 API를 테스트합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 커스텀 토큰 테스트 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  커스텀 토큰으로 테스트
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentToken}
                    onChange={(e) => setCurrentToken(e.target.value)}
                    placeholder="Bearer 토큰을 입력하세요"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={testWithCustomToken}
                    disabled={isLoading || !currentToken.trim()}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isLoading || !currentToken.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    테스트
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  다른 토큰으로 API를 테스트할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 결과 표시 */}
          {testResult && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  테스트 결과
                </h2>
                <button
                  onClick={clearResult}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  지우기
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                {testResult}
              </pre>
            </div>
          )}

          {/* API 정보 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              테스트 가능한 API
            </h2>
            <div className="space-y-2 text-sm text-blue-800">
              <div>
                <strong>GET /users/me</strong> - 현재 사용자 정보 조회
              </div>
              <div>
                <strong>GET /posts/allPosts</strong> - 전체 게시글 목록 조회
              </div>
              <div>
                <strong>POST /users/search</strong> - 장소 정보로 북마크 추가
              </div>
              <div>
                <strong>GET /users/me/bookmarks</strong> - 사용자 북마크 조회
              </div>
              <div>
                <strong>GET /users/me/bookmarks?visited=true</strong> - 방문한
                북마크만 조회
              </div>
              <div>
                <strong>Headers:</strong> Authorization: Bearer [토큰]
              </div>
              <div>
                <strong>Base URL:</strong>{' '}
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}
              </div>
              <div className="text-xs text-blue-600 mt-2">
                <strong>참고:</strong> 북마크 관련 API는 /api 접두사 없이
                /users/... 경로로 호출됩니다.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <Navigation />
    </div>
  );
};

export default ApiTestPage;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { userAPI } from '../../utils/api';
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

      setTestResult('🔄 API 호출 중...\n');

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
        `${import.meta.env.VITE_API_BASE_URL}/users/me`,
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
              {/* 기본 테스트 버튼 */}
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
                    : 'GET /users/me 테스트 (현재 토큰)'}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  현재 로그인된 사용자의 토큰으로 API를 테스트합니다.
                </p>
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
                <strong>Headers:</strong> Authorization: Bearer [토큰]
              </div>
              <div>
                <strong>Base URL:</strong>{' '}
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}
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

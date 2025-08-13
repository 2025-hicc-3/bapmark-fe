import React, { useState, useEffect } from 'react';
import { authAPI, userAPI } from '../../utils/api';
import { useAuth } from '../../store/AuthContext';
import type { User } from '../../types/auth';
import loginIcon from '../../assets/icons/login.svg';
import NicknameChangeModal from './NicknameChangeModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { isLoggedIn, login, logout, user } = useAuth();

  // 사용자 정보 새로고침
  const refreshUserInfo = async () => {
    if (!isLoggedIn) return;

    try {
      // userAPI.getMe()를 사용하여 현재 사용자 정보 가져오기
      const { data, error } = await userAPI.getMe();

      if (error || !data) {
        console.error('사용자 정보 조회 실패:', error);

        // 에러 타입에 따른 대응
        if (error?.includes('서버 연결에 문제가 있습니다')) {
          console.warn('서버 연결 문제로 사용자 정보를 가져올 수 없습니다.');
          // 기존 user 정보를 유지하고 에러 메시지만 표시
          return;
        }

        if (error?.includes('인증이 필요합니다')) {
          console.warn('JWT 토큰이 만료되었거나 유효하지 않습니다.');
          // 로그아웃 처리
          logout();
          onClose();
          return;
        }

        return;
      }

      console.log('최신 사용자 정보 받아옴:', data);
      setCurrentUser(data);
    } catch (error) {
      console.error('사용자 정보 새로고침 중 오류:', error);

      // 네트워크 오류나 기타 예외 상황
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('네트워크 연결에 문제가 있습니다.');
      }
    }
  };

  // 모달이 열릴 때마다 사용자 정보 새로고침
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      refreshUserInfo();
    }
  }, [isOpen, isLoggedIn]);

  // 현재 표시할 사용자 정보 (API에서 받아온 최신 정보 우선)
  const displayUser = currentUser || user;

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGoogleLogin = async () => {
    // 이미 로딩 중이면 중복 실행 방지
    if (isLoading) return;

    setIsLoading(true);

    try {
      // 환경 변수 체크
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error(
          'Google OAuth 클라이언트 ID가 설정되지 않았습니다. 환경 변수를 확인해주세요.'
        );
      }

      console.log('Google OAuth 초기화 시작:', {
        clientId: clientId ? '설정됨' : '설정되지 않음',
      });

      // Google OAuth 라이브러리 로드 상태 확인
      if (typeof window === 'undefined') {
        throw new Error('브라우저 환경이 아닙니다.');
      }

      // Google OAuth 라이브러리가 로드될 때까지 대기
      let retryCount = 0;
      const maxRetries = 10;

      while (!(window as any).google?.accounts?.id && retryCount < maxRetries) {
        console.log(
          `Google OAuth 라이브러리 로드 대기 중... (${retryCount + 1}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
        retryCount++;
      }

      if (!(window as any).google?.accounts?.id) {
        throw new Error(
          'Google OAuth 라이브러리를 로드할 수 없습니다. 페이지를 새로고침해주세요.'
        );
      }

      console.log('Google OAuth 라이브러리 로드 완료');

      const googleObj = (window as any).google;

      // Google OAuth 초기화
      googleObj.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: any) => {
          try {
            console.log('Google OAuth 콜백 호출됨:', response);
            const idToken = response.credential; // ID 토큰 (JWT)

            const { data, error } = await authAPI.googleLogin(idToken);
            if (error || !data) {
              throw new Error('인증 실패');
            }

            // 실제 API 응답에서 사용자 정보를 받아와서 로그인
            login(data.accessToken, data.user);
            setIsLoading(false);
            onClose();
          } catch (error) {
            console.error('Google 로그인 콜백 에러:', error);
            setIsLoading(false);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
          }
        },
        cancel_callback: () => {
          // 사용자가 로그인을 취소한 경우
          console.log('Google 로그인 취소됨');
          setIsLoading(false);
        },
      });

      console.log('Google OAuth 초기화 완료, 프롬프트 표시 시작');

      // 원탭 프롬프트 표시
      googleObj.accounts.id.prompt();

      console.log('Google OAuth 프롬프트 표시 완료');
    } catch (error) {
      console.error('Google 로그인 초기화 에러:', error);
      setIsLoading(false);
      alert(
        `Google 로그인 초기화 실패: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`
      );
    }
  };

  // 테스트용 로그인 함수 - API 시뮬레이션
  const handleTestLogin = async () => {
    setIsLoading(true);

    try {
      // API 호출을 시뮬레이션 (실제로는 네트워크 요청 없음)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 실제 API 응답과 동일한 구조의 테스트 데이터
      const testResponse = {
        accessToken: 'test-access-token-' + Date.now(),
        user: {
          id: 'test-user-' + Date.now(),
          email: 'test@example.com',
          name: '테스트 사용자',
          nickname: '테스터',
          picture: undefined,
          createdAt: new Date().toISOString(),
        } as User,
      };

      // AuthContext를 통해 로그인 (실제 로그인과 동일한 방식)
      login(testResponse.accessToken, testResponse.user);

      setIsLoading(false);
      alert('테스트 로그인 완료!');
      onClose();
    } catch {
      setIsLoading(false);
      alert('테스트 로그인에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleSettingsClick = () => {
    setShowNicknameModal(true);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-end"
      onClick={handleBackdropClick}
    >
      <div className="w-full bg-white rounded-t-3xl h-[80vh] animate-slide-up">
        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto max-h-[calc(80vh-80px)]">
          {!isLoggedIn ? (
            // 로그아웃 상태 - 로고와 로그인 버튼들
            <div className="flex flex-col items-center justify-center h-full px-6 space-y-8">
              {/* 로고 */}
              <div className="text-center space-y-4 m-5">
                <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-2xl">B</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">BapMark</h1>
              </div>

              {/* 구글 로그인 버튼 */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={`w-full max-w-sm bg-white border-2 border-gray-300 rounded-lg py-4 px-6 flex items-center justify-center space-x-3 transition-colors shadow-sm ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-50'
                }`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="text-gray-700 font-medium">
                  {isLoading ? '로그인 중...' : 'Google로 로그인'}
                </span>
              </button>

              {/* 구분선 */}
              <div className="w-full max-w-sm flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">또는</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* 테스트용 로그인 버튼 */}
              <button
                onClick={handleTestLogin}
                disabled={isLoading}
                className={`w-full max-w-sm bg-green-500 text-white rounded-lg py-4 px-6 flex items-center justify-center space-x-3 transition-colors shadow-sm hover:bg-green-600 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="개발용 테스트 로그인"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                )}
                <span className="font-medium">
                  {isLoading ? '테스트 로그인 중...' : '테스트 로그인'}
                </span>
              </button>

              {/* 테스트 로그인 안내 */}
              <div className="text-center text-xs text-gray-500 max-w-sm">
                <p>💡 개발 중 빠른 테스트를 위한 버튼입니다.</p>
                <p>실제 API 응답을 시뮬레이션하여 로그인 상태를 만듭니다.</p>
              </div>
            </div>
          ) : (
            // 로그인 상태 - 사용자 정보
            <div className="p-6 space-y-6">
              {/* 사용자 프로필 */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                  {displayUser?.picture ? (
                    <img
                      src={displayUser.picture}
                      alt="사용자"
                      className="w-20 h-20 rounded-full"
                    />
                  ) : (
                    <img src={loginIcon} alt="사용자" className="w-10 h-10" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {displayUser?.nickname || displayUser?.name || '사용자'}
                  </h2>
                  <p className="text-gray-600">
                    {displayUser?.email || '이메일 없음'}
                  </p>
                  {displayUser?.nickname && (
                    <p className="text-sm text-gray-500">
                      ({displayUser.name})
                    </p>
                  )}
                </div>

                {/* 사용자 정보 새로고침 버튼 */}
                <button
                  onClick={refreshUserInfo}
                  className="inline-flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="최신 사용자 정보 가져오기"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {isLoading ? '새로고침 중...' : '정보 새로고침'}
                </button>
              </div>

              {/* 메뉴 옵션들 */}
              <div className="space-y-3">
                <button
                  onClick={handleSettingsClick}
                  className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">설정</span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
      <NicknameChangeModal
        isOpen={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
        currentNickname={displayUser?.nickname || '사용자'}
      />
    </div>
  );
};

export default LoginModal;

import React, { useState } from 'react';
import loginIcon from '../../assets/icons/login.svg';
import stampIcon from '../../assets/icons/stamp.svg';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Google OAuth 클라이언트 초기화 (실제 구현 시 Google OAuth 라이브러리 필요)
      // @ts-expect-error - Google OAuth 타입 정의가 없어서 임시로 사용
      if (typeof google !== 'undefined' && google.accounts) {
        // @ts-expect-error - Google OAuth 클라이언트 타입이 정의되지 않음
        const client = google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'openid email profile',
          callback: async (response: any) => {
            try {
              // Google에서 받은 ID Token을 백엔드로 전송
              const jwtResponse = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  idToken: response.access_token,
                }),
              });

              if (!jwtResponse.ok) {
                throw new Error('인증 실패');
              }

              const { jwt } = await jwtResponse.json();

              // JWT를 로컬스토리지에 저장
              localStorage.setItem('accessToken', jwt);

              // 로그인 상태 업데이트
              setIsLoggedIn(true);
              setIsLoading(false);

              // 모달 닫기
              onClose();
            } catch (error) {
              console.error('로그인 실패:', error);
              setIsLoading(false);
              alert('로그인에 실패했습니다. 다시 시도해주세요.');
            }
          },
        });

        client.requestAccessToken();
      } else {
        // Google OAuth 라이브러리가 로드되지 않은 경우
        throw new Error('Google OAuth 라이브러리를 로드할 수 없습니다.');
      }
    } catch (error) {
      console.error('Google 로그인 초기화 실패:', error);
      setIsLoading(false);
      alert('Google 로그인을 초기화할 수 없습니다.');
    }
  };

  const handleLogout = () => {
    // 로컬스토리지에서 토큰 제거
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    onClose();
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
            // 로그아웃 상태 - 로고와 구글 로그인만
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
            </div>
          ) : (
            // 로그인 상태 - 사용자 정보
            <div className="p-6 space-y-6">
              {/* 사용자 프로필 */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                  <img src={loginIcon} alt="사용자" className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">김철수님</h2>
                  <p className="text-gray-600">kim@example.com</p>
                </div>
              </div>

              {/* 스탬프 정보 */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">내 스탬프</span>
                  <div className="flex items-center space-x-2">
                    <img src={stampIcon} alt="스탬프" className="w-5 h-5" />
                    <span className="font-bold text-lg">5/10</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: '50%' }}
                  ></div>
                </div>
              </div>

              {/* 메뉴 옵션들 */}
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">내 스탬프북</span>
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

                <button className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">설정</span>
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

                <button className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">도움말</span>
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
    </div>
  );
};

export default LoginModal;

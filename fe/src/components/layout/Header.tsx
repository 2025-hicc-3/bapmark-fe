import React, { useState } from 'react';
import loginIcon from '../../assets/icons/login.svg';
import stampIcon from '../../assets/icons/stamp.svg';
import { useAuth } from '../../store/AuthContext';
import LoginModal from '../auth/LoginModal';
import StampModal from '../stampbook/StampModal';

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStampModalOpen, setIsStampModalOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleStampClick = () => {
    setIsStampModalOpen(true);
  };

  const handleCloseStampModal = () => {
    setIsStampModalOpen(false);
  };

  return (
    <>
      <header
        className="fixed-header bg-white border-b border-gray-200 px-4 py-3"
        style={{ minHeight: '100px' }}
      >
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">BapMark</span>
          </div>

          {/* 우측 아이콘들 */}
          <div className="flex items-center space-x-3">
            {/* 로그인 아이콘 */}
            <button
              onClick={handleLoginClick}
              className="hover:bg-gray-100 rounded-full p-1 transition-colors"
            >
              <img src={loginIcon} alt="로그인" className="w-5 h-5" />
            </button>

            {/* 스탬프 아이콘 */}
            <button
              onClick={handleStampClick}
              className="hover:bg-gray-100 rounded-full p-1 transition-colors"
            >
              <img src={stampIcon} alt="스탬프" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 검색바 */}
        <div className="mt-3">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 pl-10 bg-gray-50 border-[3px] border-black rounded-full text-sm "
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
          </div>
        </div>

        {/* 로그인 상태 및 사용자 정보 표시 */}
        {isLoggedIn && user && (
          <div className="mt-2 space-y-1">
            <div className="text-center">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                🟢 {user.nickname || user.name}님 로그인됨
              </span>
            </div>
            <div className="text-center">
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                {user.email}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* 로그인 모달 */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />

      {/* 스탬프 모달 */}
      <StampModal isOpen={isStampModalOpen} onClose={handleCloseStampModal} />
    </>
  );
};

export default Header;

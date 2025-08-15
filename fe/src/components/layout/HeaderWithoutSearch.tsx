import React, { useState } from 'react';
import loginIcon from '../../assets/icons/login.svg';
import stampIcon from '../../assets/icons/stamp.svg';
import LoginModal from '../auth/LoginModal';
import StampModal from '../stampbook/StampModal';

const HeaderWithoutSearch = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStampModalOpen, setIsStampModalOpen] = useState(false);

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
        style={{ height: '60px' }}
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
      </header>

      {/* 로그인 모달 */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />

      {/* 스탬프 모달 */}
      <StampModal isOpen={isStampModalOpen} onClose={handleCloseStampModal} />
    </>
  );
};

export default HeaderWithoutSearch;

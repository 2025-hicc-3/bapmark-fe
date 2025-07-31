import React, { useState } from 'react';
import loginIcon from '../../assets/icons/login.svg';
import stampIcon from '../../assets/icons/stamp.svg';
import LoginModal from '../auth/LoginModal';

const HeaderWithoutSearch = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <header className="fixed-header h-15 bg-white border-b border-gray-200 px-4 py-3">
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
            <button className="hover:bg-gray-100 rounded-full p-1 transition-colors">
              <img src={stampIcon} alt="스탬프" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 로그인 모달 */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
    </>
  );
};

export default HeaderWithoutSearch;

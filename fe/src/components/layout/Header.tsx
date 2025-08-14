import React, { useState, useEffect, useRef } from 'react';
import loginIcon from '../../assets/icons/login.svg';
import stampIcon from '../../assets/icons/stamp.svg';
import { useAuth } from '../../store/AuthContext';
import LoginModal from '../auth/LoginModal';
import StampModal from '../stampbook/StampModal';
import SearchResults from '../map/SearchResults';
import type { SearchResult } from '../../types/search';
import { searchPlaces } from '../../services/kakaoSearch';

interface HeaderProps {
  onPlaceSelect?: (place: SearchResult) => void;
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onPlaceSelect,
  showSearch = false,
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStampModalOpen, setIsStampModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(true);

    // 디바운싱: 500ms 후에 검색 실행
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchPlaces(query);
        setSearchResults(results);
      } catch (error) {
        console.error('검색 오류:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const handlePlaceSelect = (place: SearchResult) => {
    setSearchQuery(place.name);
    setSearchResults([]);
    setShowResults(false);

    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  };

  const handleSearchBlur = () => {
    // 검색 결과를 클릭할 시간을 주기 위해 약간의 지연
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <header
        className="fixed-header bg-white border-b border-gray-200 px-4 py-3"
        style={{ minHeight: '100px' }}
      >
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center">
            <div className="w-24 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="/bapmark.png"
                alt="BapMark"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* 우측 아이콘들 */}
          <div className="flex items-center space-x-3">
            {/* 로그인 상태 표시 */}
            {isLoggedIn && user && (
              <div className="flex flex-col items-center space-y-1">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                  {user.nickname || user.name}님
                </span>
              </div>
            )}

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

        {/* 검색바 - 맵 페이지에서만 표시 */}
        {showSearch && (
          <div className="mt-3 relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={handleSearchBlur}
                placeholder="장소를 검색하세요..."
                className="w-full px-4 py-2 pl-10 bg-gray-50 border-[3px] border-black rounded-full text-sm focus:outline-none focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* 검색 결과 */}
            {showResults && (
              <SearchResults
                results={searchResults}
                onPlaceSelect={handlePlaceSelect}
                isLoading={isSearching}
              />
            )}
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

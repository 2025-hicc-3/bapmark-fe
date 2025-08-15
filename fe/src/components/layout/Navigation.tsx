import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import mapIcon from '../../assets/icons/map.svg';
import mapFillIcon from '../../assets/icons/map_fill.svg';
import postIcon from '../../assets/icons/post.svg';
import postFillIcon from '../../assets/icons/post_fill.svg';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed-navigation  bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex items-center justify-around">
        {/* 게시물 탭 */}
        <button
          onClick={() => navigate('/board')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors 
          }`}
        >
          <img
            src={isActive('/board') ? postFillIcon : postIcon}
            alt="게시물"
            className="w-6 h-6"
          />
          <span className="text-xs font-medium">게시물</span>
        </button>

        {/* 지도 탭 */}
        <button
          onClick={() => navigate('/map')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors`}
        >
          <img
            src={isActive('/map') ? mapFillIcon : mapIcon}
            alt="지도"
            className="w-6 h-6"
          />
          <span className="text-xs font-medium">지도</span>
        </button>

        {/* API 테스트 탭 */}
        <button
          onClick={() => navigate('/apitest')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors ${
            isActive('/apitest') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-medium">API 테스트</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;

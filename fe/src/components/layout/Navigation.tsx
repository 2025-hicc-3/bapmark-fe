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
      </div>
    </nav>
  );
};

export default Navigation;

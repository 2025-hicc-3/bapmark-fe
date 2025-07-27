import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className='fixed-navigation bg-white border-t border-gray-200 px-4 py-2'>
      <div className='flex items-center justify-around'>
        {/* 게시물 탭 */}
        <button
          onClick={() => navigate('/board')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors ${
            isActive('/board')
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
            />
          </svg>
          <span className='text-xs font-medium'>게시물</span>
        </button>

        {/* 지도 탭 */}
        <button
          onClick={() => navigate('/map')}
          className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors ${
            isActive('/map')
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3'
            />
          </svg>
          <span className='text-xs font-medium'>지도</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;

import React from 'react';

const Header = () => {
  return (
    <header className='fixed-header h-15 bg-white border-b border-gray-200 px-4 py-3'>
      <div className='flex items-center justify-between'>
        {/* 로고 */}
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>B</span>
          </div>
          <span className='text-lg font-semibold text-gray-900'>BapMark</span>
        </div>

        {/* 우측 아이콘들 */}
        <div className='flex items-center space-x-3'>
          {/* 사용자 아이콘 */}
          <button className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
          </button>

          {/* 지도 아이콘 */}
          <button className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-gray-600'
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
          </button>
        </div>
      </div>

      {/* 검색바 */}
      <div className='mt-3'>
        <div className='relative'>
          <input
            type='text'
            placeholder='맛집을 검색해보세요'
            className='w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg
              className='h-4 w-4 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

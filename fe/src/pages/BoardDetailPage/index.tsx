import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderWithoutSearch from '../../components/layout/HeaderWithoutSearch';
import Navigation from '../../components/layout/Navigation';
import saveIcon from '../../assets/icons/save.svg';
import saveFillIcon from '../../assets/icons/save_fill.svg';

const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // 임시 게시물 데이터
  const post = {
    id: id || '1',
    title: '제목은',
    content: '내용은',
    location: '서울특별시 마포구 와우산로 11번길 11',
    createdAt: '2025.00.00.',
    author: {
      name: '작성자',
      avatar: null,
    },
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    // 실제 저장 로직 구현
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 헤더 (검색창 없음) */}
      <HeaderWithoutSearch />

      {/* 메인 콘텐츠 */}
      <main className="main-content flex-1 pt-15 pb-16">
        <div className="p-4 space-y-4">
          {/* 뒤로가기 버튼과 제목 */}
          <div className="flex items-center space-x-3">
            <button onClick={handleBackClick}>
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h1 className="text-xl font-semibold text-gray-900 flex-1">
              {post.title}
            </h1>

            <button onClick={handleSaveClick}>
              <img
                src={isSaved ? saveFillIcon : saveIcon}
                alt="저장"
                className="w-5 h-5"
              />
            </button>
          </div>

          {/* 날짜 */}
          <div className="text-right">
            <span className="text-xs text-gray-500">{post.createdAt}</span>
          </div>

          {/* 위치 정보 */}
          <div className="text-sm text-gray-700">{post.location}</div>

          {/* 지도 이미지 영역 */}
          <div className="w-full h-32 bg-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 font-medium">지도사진</span>
          </div>

          {/* 게시물 내용 */}
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-base text-gray-900 leading-relaxed">
              {post.content}
            </p>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <Navigation />
    </div>
  );
};

export default BoardDetailPage;

import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Navigation from '../../components/layout/Navigation';
import PostCard from '../../components/board/PostCard';
import FloatingWriteButton from '../../components/board/FloatingWriteButton';
import WriteModal from '../../components/board/WriteModal';
import { usePost } from '../../store/PostContext';
import type { SearchResult } from '../../types/search';

// mockPosts 데이터는 이제 PostContext에서 관리됩니다

const BoardPage = () => {
  const { posts, isLoading, error, refreshPostData } = usePost();
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWriteButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // posts가 변경될 때 filteredPosts 업데이트
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  // 로그인 성공 이벤트 리스너 추가
  useEffect(() => {
    const handleLoginSuccess = () => {
      console.log('BoardPage: 로그인 성공 이벤트 감지, 게시글 데이터 새로고침');
      refreshPostData();
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, [refreshPostData]);

  // 장소 검색 결과 처리
  const handlePlaceSelect = (place: SearchResult) => {
    // 검색된 장소와 관련된 게시물 필터링
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(place.name.toLowerCase()) ||
        post.content.toLowerCase().includes(place.name.toLowerCase()) ||
        post.address.toLowerCase().includes(place.name.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <Header showSearch={true} onPlaceSelect={handlePlaceSelect} />
        <main className="main-content bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">게시글을 불러오는 중...</p>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="h-screen flex flex-col">
        <Header showSearch={true} onPlaceSelect={handlePlaceSelect} />
        <main className="main-content bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              데이터 로드 실패
            </h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => refreshPostData()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <Header showSearch={true} onPlaceSelect={handlePlaceSelect} />

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content bg-gray-50">
        <div className="px-4 py-3">
          {/* 게시물 목록 */}
          <div className="space-y-3">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                게시글이 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 플로팅 글쓰기 버튼 */}
      <FloatingWriteButton onClick={handleWriteButtonClick} />

      {/* 글쓰기 모달 */}
      <WriteModal isOpen={isModalOpen} onClose={handleModalClose} />

      {/* 하단 네비게이션 */}
      <Navigation />
    </div>
  );
};

export default BoardPage;

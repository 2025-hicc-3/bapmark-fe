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
  const [searchKeyword, setSearchKeyword] = useState('');

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

  // 게시글 검색 처리
  const handlePostSearch = async (keyword: string) => {
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      // 빈 검색어일 때는 모든 게시글 표시
      setFilteredPosts(posts);
      return;
    }

    try {
      // API를 통한 게시글 검색
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/search?keyword=${encodeURIComponent(keyword)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const searchResults = await response.json();
        setFilteredPosts(searchResults);
      } else {
        console.error('게시글 검색 실패:', response.status);
        // API 검색 실패 시 로컬 필터링으로 대체
        const filtered = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(keyword.toLowerCase()) ||
            post.content.toLowerCase().includes(keyword.toLowerCase()) ||
            post.address.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredPosts(filtered);
      }
    } catch (error) {
      console.error('게시글 검색 오류:', error);
      // 오류 발생 시 로컬 필터링으로 대체
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(keyword.toLowerCase()) ||
          post.content.toLowerCase().includes(keyword.toLowerCase()) ||
          post.address.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <Header
          showSearch={true}
          searchType="both"
          onPlaceSelect={handlePlaceSelect}
          onPostSearch={handlePostSearch}
        />
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
        <Header
          showSearch={true}
          searchType="both"
          onPlaceSelect={handlePlaceSelect}
          onPostSearch={handlePostSearch}
        />
        <main className="main-content bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
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
      <Header
        showSearch={true}
        searchType="both"
        onPlaceSelect={handlePlaceSelect}
        onPostSearch={handlePostSearch}
      />

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
                {searchKeyword ? (
                  <>
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="font-medium mb-1">검색 결과가 없습니다</p>
                    <p className="text-sm">
                      "{searchKeyword}"에 대한 검색 결과가 없습니다.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2">📝</div>
                    <p className="font-medium mb-1">게시글이 없습니다</p>
                    <p className="text-sm">첫 번째 게시글을 작성해보세요!</p>
                  </>
                )}
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

import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Navigation from '../../components/layout/Navigation';
import PostCard from '../../components/board/PostCard';
import FloatingWriteButton from '../../components/board/FloatingWriteButton';
import WriteModal from '../../components/board/WriteModal';

// 임시 게시물 데이터
const mockPosts = [
  {
    id: 1,
    title: '카미야가 어쩌구저쩌구',
    content: '내용은 이렇고 저렇고',
    location: '카미야',
    author: '사용자1',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: '한신포차 맛있어요',
    content: '정말 맛있는 포차였어요',
    location: '한신포차',
    author: '사용자2',
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    title: '가미우동 추천',
    content: '우동이 정말 맛있어요',
    location: '가미우동',
    author: '사용자3',
    createdAt: '2024-01-13'
  },
  {
    id: 4,
    title: '맛집 발견했어요',
    content: '이곳 꼭 가보세요',
    location: '맛집',
    author: '사용자4',
    createdAt: '2024-01-12'
  },
  {
    id: 5,
    title: '오늘 점심 메뉴',
    content: '오늘 점심 뭐 먹을까요',
    location: '점심',
    author: '사용자5',
    createdAt: '2024-01-11'
  },
  {
    id: 6,
    title: '저녁 맛집 추천',
    content: '저녁에 먹기 좋은 곳',
    location: '저녁',
    author: '사용자6',
    createdAt: '2024-01-10'
  },
  {
    id: 7,
    title: '주말 맛집 탐방',
    content: '주말에 가볼만한 곳',
    location: '주말',
    author: '사용자7',
    createdAt: '2024-01-09'
  },
  {
    id: 8,
    title: '디저트 맛집',
    content: '달콤한 디저트 맛집',
    location: '디저트',
    author: '사용자8',
    createdAt: '2024-01-08'
  }
];

const BoardPage = () => {
  const [posts] = useState(mockPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWriteButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content bg-gray-50">
        <div className="px-4 py-3">
          {/* 게시물 목록 */}
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                content={post.content}
                location={post.location}
              />
            ))}
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
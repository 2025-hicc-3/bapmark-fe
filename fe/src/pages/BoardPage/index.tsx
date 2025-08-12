import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Navigation from '../../components/layout/Navigation';
import PostCard from '../../components/board/PostCard';
import FloatingWriteButton from '../../components/board/FloatingWriteButton';
import WriteModal from '../../components/board/WriteModal';
import type { Post } from '../../types/api';

// 임시 게시물 데이터 (API 명세서에 맞게 수정)
const mockPosts: Post[] = [
  {
    id: '1',
    title: '카미야가 어쩌구저쩌구',
    content: '내용은 이렇고 저렇고',
    address: '카미야',
    latitude: 37.5665,
    longitude: 126.978,
    user: {
      id: '1',
      email: 'user1@example.com',
    },
  },
  {
    id: '2',
    title: '한신포차 맛있어요',
    content: '정말 맛있는 포차였어요',
    address: '한신포차',
    latitude: 37.5665,
    longitude: 126.978,
    user: {
      id: '2',
      email: 'user2@example.com',
    },
  },
  {
    id: '3',
    title: '가미우동 추천',
    content: '우동이 정말 맛있어요',
    address: '가미우동',
    latitude: 37.5665,
    longitude: 126.978,
    user: {
      id: '3',
      email: 'user3@example.com',
    },
  },
  {
    id: '4',
    title: '맛집 발견했어요',
    content: '이곳 꼭 가보세요',
    address: '맛집',
    latitude: 37.5665,
    longitude: 126.978,
    user: {
      id: '4',
      email: 'user4@example.com',
    },
  },
  {
    id: '5',
    title: '오늘 점심 메뉴',
    content: '오늘 점심 뭐 먹을까요',
    address: '점심',
    latitude: 37.5665,
    longitude: 126.978,
    user: {
      id: '5',
      email: 'user5@example.com',
    },
  },
  {
    id: '6',
    title: '저녁 맛집 추천',
    content: '저녁에 먹기 좋은 곳',
    address: '저녁',
    latitude: 37.5665,
    longitude: 126.978,
    user: {
      id: '6',
      email: 'user6@example.com',
    },
  },
  {
    id: '7',
    title: '주말 맛집 탐방',
    content: '주말에 가볼만한 곳',
    address: '주말',
    latitude: 37.5665,
    longitude: 126.978,
    user: {
      id: '7',
      email: 'user7@example.com',
    },
  },
  {
    id: '8',
    title: '디저트 맛집',
    content: '달콤한 디저트 맛집',
    address: '디저트',
    latitude: 37.5665,
    longitude: 126.978,
    user: {
      id: '8',
      email: 'user8@example.com',
    },
  },
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
              <PostCard key={post.id} post={post} />
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

import React, { useState, useRef } from 'react';
import PostCard from './PostCard';
import type { Post } from '../../types/api';

interface MyPostCardProps {
  post: Post;
}

const MyPostCard: React.FC<MyPostCardProps> = ({ post }) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - startX;
    setCurrentX(deltaX);

    // 좌측으로 스와이프할 때만 동작
    if (deltaX < 0) {
      setIsSwiped(true);
    }
  };

  const handleTouchEnd = () => {
    // 스와이프 거리에 따라 상태 결정
    if (currentX < -50) {
      setIsSwiped(true);
    } else {
      setIsSwiped(false);
    }
    setCurrentX(0);
  };

  const handleEdit = () => {
    console.log('수정:', post.id);
    setIsSwiped(false);
  };

  const handleDelete = () => {
    console.log('삭제:', post.id);
    setIsSwiped(false);
  };

  return (
    <div className="relative overflow-hidden">
      {/* PostCard 재사용 */}
      <div
        ref={cardRef}
        className={`transition-transform duration-300 ${
          isSwiped ? 'transform -translate-x-[120px]' : ''
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <PostCard post={post} />
      </div>

      {/* 스와이프 액션 버튼들 */}
      <div
        className={`absolute right-0 top-0 h-full flex items-center transition-transform duration-300 ${
          isSwiped
            ? 'transform -translate-x-[0px]'
            : 'transform translate-x-[120px]'
        }`}
      >
        {/* 수정 버튼 */}
        <button
          onClick={handleEdit}
          className="bg-gray-600 text-gray-300 font-bold text-sm px-4 flex items-center justify-center min-w-[60px] rounded-none h-[90%]"
        >
          수정
        </button>

        {/* 삭제 버튼 */}
        <button
          onClick={handleDelete}
          className="bg-red-600 text-gray-300 font-bold text-sm px-4 flex items-center justify-center min-w-[60px] rounded-l-none h-[90%]"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default MyPostCard;

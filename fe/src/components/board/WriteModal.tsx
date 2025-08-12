import React, { useState } from 'react';
import WriteForm from './WriteForm';
import MyPostCard from './MyPostCard';
import type { Post, CreatePostRequest } from '../../types/api';

interface WriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 임시 내가 쓴 글 데이터 (API 명세서에 맞게 수정)
const mockMyPosts: Post[] = [
  {
    id: '1',
    title: '내가 쓴 글 1',
    content: '내가 쓴 글 내용입니다',
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
    title: '내가 쓴 글 2',
    content: '내가 쓴 글 내용입니다',
    address: '한신포차',
    latitude: 37.5665,
    longitude: 126.978,
    user: {
      id: '1',
      email: 'user1@example.com',
    },
  },
];

const WriteModal: React.FC<WriteModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'myPosts'>('write');
  const [myPosts] = useState(mockMyPosts);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmitPost = (postData: CreatePostRequest) => {
    // TODO: API 호출하여 게시글 등록
    console.log('게시글 등록:', postData);
    // 성공 시 모달 닫기
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-end"
      onClick={handleBackdropClick}
    >
      <div className="w-full bg-white rounded-t-3xl h-[80vh] animate-slide-up">
        {/* 헤더 */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('write')}
              className={`font-bold text-sm ${
                activeTab === 'write' ? 'text-black' : 'text-gray-400'
              }`}
            >
              글쓰기
            </button>
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <button
              onClick={() => setActiveTab('myPosts')}
              className={`font-bold text-sm ${
                activeTab === 'myPosts' ? 'text-black' : 'text-gray-400'
              }`}
            >
              내가 쓴 글
            </button>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto max-h-[calc(80vh-80px)]">
          {activeTab === 'write' ? (
            <div className="h-full">
              <WriteForm onClose={onClose} onSubmit={handleSubmitPost} />
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {myPosts.map((post) => (
                <MyPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteModal;

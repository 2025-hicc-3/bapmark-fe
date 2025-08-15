import React, { useState, useEffect } from 'react';
import WriteForm from './WriteForm';
import MyPostCard from './MyPostCard';
import { usePost } from '../../store/PostContext';
import type { CreatePostRequest, Post } from '../../types/api';

interface WriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WriteModal: React.FC<WriteModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'myPosts'>('write');
  const { createPost, getMyPosts, refreshPostData } = usePost();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [isLoadingMyPosts, setIsLoadingMyPosts] = useState(false);

  // 본인 글 조회
  const loadMyPosts = async () => {
    try {
      setIsLoadingMyPosts(true);
      const posts = await getMyPosts();
      setMyPosts(posts);
    } catch (error) {
      console.error('본인 글 조회 오류:', error);
      setMyPosts([]);
    } finally {
      setIsLoadingMyPosts(false);
    }
  };

  // 탭 변경 시 본인 글 로드
  useEffect(() => {
    if (activeTab === 'myPosts') {
      loadMyPosts();
    }
  }, [activeTab]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmitPost = async (postData: CreatePostRequest) => {
    try {
      setIsSubmitting(true);
      setSubmitMessage('게시글을 등록하는 중...');

      // PostContext의 createPost 함수 사용
      const success = await createPost(postData);

      if (success) {
        setSubmitMessage('게시글이 성공적으로 등록되었습니다!');
        // 게시글 목록 새로고침
        await refreshPostData();
        // 본인 글 목록도 새로고침
        if (activeTab === 'myPosts') {
          await loadMyPosts();
        }
        // 1초 후 모달 닫기
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setSubmitMessage('게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 등록 오류:', error);
      setSubmitMessage('게시글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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

        {/* 제출 상태 메시지 */}
        {submitMessage && (
          <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
            <div className="text-sm text-blue-800 text-center">
              {submitMessage}
            </div>
          </div>
        )}

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto max-h-[calc(80vh-80px)]">
          {activeTab === 'write' ? (
            <div className="h-full">
              <WriteForm onClose={onClose} onSubmit={handleSubmitPost} />
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {isLoadingMyPosts ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">본인 글을 불러오는 중...</p>
                </div>
              ) : myPosts.length > 0 ? (
                myPosts.map((post) => <MyPostCard key={post.id} post={post} />)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  작성한 게시글이 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteModal;

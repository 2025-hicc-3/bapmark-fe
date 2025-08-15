import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../../types/api';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/board/${post.id}`);
  };

  return (
    <div
      className="bg-gray-50 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-100"
      onClick={handleClick}
    >
      <div className="flex flex-col space-y-2">
        {/* 제목 */}
        <h3 className="text-black font-semibold text-sm leading-7">
          {post.title}
        </h3>

        {/* 내용 */}
        <p 
          className="text-black font-medium text-xs leading-7 overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4',
            maxHeight: '2.8em', // 2줄 높이 제한 (1.4 * 2)
          }}
        >
          {post.content}
        </p>

        {/* 주소 정보 */}
        <div className="flex justify-end">
          <span className="text-gray-600 font-bold text-xs leading-5 text-center">
            {post.address}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

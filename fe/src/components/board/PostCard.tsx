import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  location: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  content,
  location,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/board/${id}`);
  };

  return (
    <div
      className="bg-gray-50 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-gray-100"
      onClick={handleClick}
    >
      <div className="flex flex-col space-y-2">
        {/* 제목 */}
        <h3 className="text-black font-semibold text-sm leading-7">{title}</h3>

        {/* 내용 */}
        <p className="text-black font-medium text-xs leading-7">{content}</p>

        {/* 위치 정보 */}
        <div className="flex justify-end">
          <span className="text-gray-600 font-bold text-xs leading-5 text-center">
            {location}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

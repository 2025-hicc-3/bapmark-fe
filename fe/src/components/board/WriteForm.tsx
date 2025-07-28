import React, { useState } from 'react';

interface WriteFormProps {
  onClose: () => void;
}

const WriteForm: React.FC<WriteFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 글쓰기 API 호출
    console.log('글쓰기:', { title, content, location });
    onClose();
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* 제목 */}
      <div className="space-y-2 mb-4">
        <label className="text-gray-600 text-xs font-normal">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
        />
      </div>

      {/* 위치 등록 */}
      <div className="space-y-2 mb-4">
        <label className="text-gray-600 text-xs font-normal">위치등록</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="위치를 입력하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 내용 */}
      <div className="space-y-2 flex-1 mb-4">
        <label className="text-gray-600 text-xs font-normal">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          className="w-full h-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* 등록하기 버튼 */}
      <div className="flex justify-end mt-auto">
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-gray-800 transition-colors duration-200"
        >
          등록하기
        </button>
      </div>
    </div>
  );
};

export default WriteForm; 
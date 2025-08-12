import React, { useState } from 'react';
import type { CreatePostRequest } from '../../types/api';

interface WriteFormProps {
  onClose: () => void;
  onSubmit: (postData: CreatePostRequest) => void;
}

const WriteForm: React.FC<WriteFormProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !address.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const postData: CreatePostRequest = {
      title: title.trim(),
      content: content.trim(),
      address: address.trim(),
      latitude,
      longitude,
    };

    onSubmit(postData);
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

      {/* 주소 등록 */}
      <div className="space-y-2 mb-4">
        <label className="text-gray-600 text-xs font-normal">주소등록</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="주소를 입력하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 위도/경도 입력 (개발용, 실제로는 지도에서 선택하도록 수정 필요) */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="space-y-2">
          <label className="text-gray-600 text-xs font-normal">위도</label>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
            placeholder="위도"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-gray-600 text-xs font-normal">경도</label>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
            placeholder="경도"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
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

import React, { useState, useEffect, useRef } from 'react';
import type { CreatePostRequest } from '../../types/api';
import type { SearchResult } from '../../types/search';
import { searchPlaces } from '../../services/kakaoSearch';

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

  // 장소검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // 장소검색 함수
  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(true);

    // 디바운싱: 입력이 멈춘 후 500ms 뒤에 검색 실행
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim()) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSearching(true);
          const results = await searchPlaces(query);
          setSearchResults(results);
        } catch (error) {
          console.error('장소 검색 오류:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  // 장소 선택 함수
  const handlePlaceSelect = (place: SearchResult) => {
    setAddress(place.name); // 장소명을 address에 저장
    setLatitude(place.lat);
    setLongitude(place.lng);
    setSearchQuery(place.name);
    setShowSearchResults(false);
  };

  // 검색 결과 외부 클릭 시 숨기기
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSearchResults(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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

      {/* 장소검색 */}
      <div className="space-y-2 mb-4 relative">
        <label className="text-gray-600 text-xs font-normal">장소검색</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          placeholder="장소명을 검색하세요"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* 검색 결과 */}
        {showSearchResults && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">검색 중...</p>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((place) => (
                <div
                  key={place.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handlePlaceSelect(place)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {place.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {place.roadAddress || place.address}
                      </p>
                      {place.category && (
                        <p className="text-xs text-blue-600 mt-1">
                          {place.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : searchQuery.trim() && !isSearching ? (
              <div className="p-4 text-center text-gray-500">
                검색 결과가 없습니다.
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* 선택된 장소 정보 */}
      {address && (
        <div className="space-y-2 mb-4">
          <label className="text-gray-600 text-xs font-normal">
            선택된 장소
          </label>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-900">{address}</div>
            <div className="text-xs text-gray-600 mt-1">
              위도: {latitude.toFixed(6)}, 경도: {longitude.toFixed(6)}
            </div>
          </div>
        </div>
      )}

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

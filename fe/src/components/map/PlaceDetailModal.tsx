import React from 'react';
import saveFillIcon from '../../assets/icons/save_fill.svg';
import fillMarkIcon from '../../assets/icons/fill_mark.svg';
import emptyMarkIcon from '../../assets/icons/empty_mark.svg';
import modifyIcon from '../../assets/icons/modify.svg';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isVisited: boolean;
  address?: string;
  sourceTitle?: string;
  sourceContent?: string;
}

interface PlaceDetailModalProps {
  isOpen: boolean;
  place: Place | null;
  onClose: () => void;
  onKakaoMap?: () => void;
  onNaverMap?: () => void;
}

const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  isOpen,
  place,
  onClose,
  onKakaoMap,
  onNaverMap,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !place) return null;

  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-[10000]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-t-3xl w-full h-[40%] overflow-hidden flex flex-col animate-slide-up">
        {/* 헤더 */}
        <div className="h-28 bg-white flex items-center justify-between px-6 flex-shrink-0 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="text-black font-semibold text-2xl mb-2">
              {place.name}
            </span>
            {place.address && (
              <span className="text-sm text-gray-600">{place.address}</span>
            )}
          </div>
          <div className="flex flex-col items-center space-y-1">
            {/* save_fill 아이콘 - 맵에 마커가 있다는 것은 북마크된 상태 */}
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <img src={saveFillIcon} alt="북마크됨" className="w-4 h-4" />
            </button>
            {/* fill_mark/empty_mark 아이콘 - 방문 완료 여부에 따라 표시 */}
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <img
                src={place.isVisited ? fillMarkIcon : emptyMarkIcon}
                alt={place.isVisited ? '방문 완료' : '미방문'}
                className="w-4 h-4"
              />
            </button>
            {/* modify 아이콘 */}
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <img src={modifyIcon} alt="수정" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 장소 정보 */}
        <div className="flex-1 px-6 overflow-y-auto">
          {/* 출처 정보 */}
          {(place.sourceTitle || place.sourceContent) && (
            <div className="mb-6 mt-4">
              {place.sourceTitle && (
                <div className="text-sm font-semibold text-black mb-2">
                  {place.sourceTitle}
                </div>
              )}
              {place.sourceContent && (
                <div className="text-sm text-gray-600">
                  {place.sourceContent}
                </div>
              )}
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={onKakaoMap}
              className="flex-1 bg-yellow-400 text-black h-12 rounded-2xl font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="currentColor"
                />
              </svg>
              카카오맵
            </button>
            <button
              onClick={onNaverMap}
              className="flex-1 bg-green-500 text-white h-12 rounded-2xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="currentColor"
                />
              </svg>
              네이버 지도
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailModal;

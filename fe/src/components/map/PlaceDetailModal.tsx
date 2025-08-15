import React, { useState } from 'react';
import saveFillIcon from '../../assets/icons/save_fill.svg';
import saveIcon from '../../assets/icons/save.svg';
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
  isBookmarked?: boolean; // 북마크 여부 추가
  currentStampBoards?: string[]; // 현재 들어가있는 스탬프북 ID 목록
}

interface StampBoard {
  id: string;
  title: string;
  color: string;
  bookmarks?: Array<{
    postId: number;
    title: string;
    address: string;
    latitude: number;
    longitude: number;
    visited: boolean;
  }>;
}

interface PlaceDetailModalProps {
  isOpen: boolean;
  place: Place | null;
  onClose: () => void;
  onKakaoMap?: () => void;
  onNaverMap?: () => void;
  onBookmarkSave?: (place: Place) => void; // 북마크 저장 콜백 추가
  onBookmarkToggle?: (place: Place) => void; // 북마크 토글 콜백 추가
  onVisitToggle?: (place: Place) => void; // 방문 상태 토글 콜백 추가
  onAddToStampBoard?: (place: Place, stampBoardId: string) => void; // 스탬프북에 추가 콜백
  onRemoveFromStampBoard?: (place: Place, stampBoardId: string) => void; // 스탬프북에서 제거 콜백
  stampBoards?: StampBoard[]; // 사용자의 스탬프북 목록
}

const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  isOpen,
  place,
  onClose,
  onKakaoMap,
  onNaverMap,
  onBookmarkSave,
  onBookmarkToggle,
  onVisitToggle,
  onAddToStampBoard,
  onRemoveFromStampBoard,
  stampBoards = [],
}) => {
  const [showStampBoardSelect, setShowStampBoardSelect] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBookmarkClick = () => {
    if (!place) return;

    if (place.isBookmarked) {
      // 이미 북마크된 경우 토글 (제거)
      if (onBookmarkToggle) {
        onBookmarkToggle(place);
      }
    } else {
      // 북마크되지 않은 경우 저장
      if (onBookmarkSave) {
        onBookmarkSave(place);
      }
    }
  };

  const handleVisitClick = () => {
    if (onVisitToggle && place) {
      onVisitToggle(place);
    }
  };

  const handleModifyClick = () => {
    setShowStampBoardSelect(true);
  };

  const handleStampBoardSelect = (stampBoardId: string) => {
    if (!place) return;

    const isCurrentlyIn = place.currentStampBoards?.includes(stampBoardId);

    if (isCurrentlyIn) {
      // 이미 들어가있는 경우 제거
      if (onRemoveFromStampBoard) {
        onRemoveFromStampBoard(place, stampBoardId);
      }
    } else {
      // 들어가있지 않은 경우 추가
      if (onAddToStampBoard) {
        onAddToStampBoard(place, stampBoardId);
      }
    }
  };

  const handleCloseStampBoardSelect = () => {
    setShowStampBoardSelect(false);
  };

  // 현재 장소가 들어가있는 스탬프북 목록
  const currentStampBoards = stampBoards.filter((board) => {
    // place.currentStampBoards에 board.id가 포함되어 있는지 확인
    const isInCurrentStampBoards = place?.currentStampBoards?.includes(board.id);
    
    // 또는 board.bookmarks에 해당 장소가 포함되어 있는지 확인
    const isInBookmarks = board.bookmarks?.some((bookmark) => {
      const nameMatch = bookmark.title === place?.name;
      const latMatch = Math.abs(bookmark.latitude - (place?.lat || 0)) < 0.0001;
      const lngMatch = Math.abs(bookmark.longitude - (place?.lng || 0)) < 0.0001;
      return nameMatch && latMatch && lngMatch;
    });
    
    return isInCurrentStampBoards || isInBookmarks;
  });

  if (!isOpen || !place) return null;

  return (
    <>
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
              {/* 북마크 아이콘 - 북마크 여부에 따라 다르게 표시 */}
              <button
                onClick={handleBookmarkClick}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title={place.isBookmarked ? '북마크 해제' : '북마크에 저장'}
              >
                <img
                  src={place.isBookmarked ? saveFillIcon : saveIcon}
                  alt={place.isBookmarked ? '북마크됨' : '북마크에 저장'}
                  className="w-4 h-4"
                />
              </button>
              {/* fill_mark/empty_mark 아이콘 - 방문 완료 여부에 따라 표시 */}
              <button
                onClick={handleVisitClick}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title={place.isVisited ? '방문 완료' : '미방문'}
              >
                <img
                  src={place.isVisited ? fillMarkIcon : emptyMarkIcon}
                  alt={place.isVisited ? '방문 완료' : '미방문'}
                  className="w-4 h-4"
                />
              </button>
              {/* modify 아이콘 - 스탬프북에 추가 */}
              <button
                onClick={handleModifyClick}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="스탬프북 관리"
              >
                <img src={modifyIcon} alt="스탬프북 관리" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 장소 정보 */}
          <div className="flex-1 px-6 overflow-y-auto">
            {/* 현재 들어가있는 스탬프북 표시 */}
            {currentStampBoards.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {currentStampBoards.map((board) => (
                    <div
                      key={board.id}
                      className="flex items-center space-x-2 px-3 py-2 mt-2 bg-gray-100 rounded-full text-sm"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: board.color }}
                      />
                      <span className="text-gray-700">{board.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="flex space-x-4 mb-6 mt-4">
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

      {/* 스탬프북 선택 모달 */}
      {showStampBoardSelect && (
        <div className="fixed inset-0 flex items-center justify-center z-[10001] bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-80 max-h-96 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                스탬프북 관리
              </h3>
              <button
                onClick={handleCloseStampBoardSelect}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {stampBoards.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">생성된 스탬프북이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stampBoards.map((stampBoard) => {
                    const isCurrentlyIn = place?.currentStampBoards?.includes(
                      stampBoard.id
                    );
                    return (
                      <button
                        key={stampBoard.id}
                        onClick={() => handleStampBoardSelect(stampBoard.id)}
                        className={`w-full p-3 text-left rounded-lg border transition-colors ${
                          isCurrentlyIn
                            ? 'border-red-300 bg-red-50 hover:bg-red-100'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: stampBoard.color }}
                            />
                            <span className="font-medium text-gray-900">
                              {stampBoard.title}
                            </span>
                          </div>
                          <div className="text-sm">
                            {isCurrentlyIn ? (
                              <span className="text-red-600 font-medium">
                                제거
                              </span>
                            ) : (
                              <span className="text-blue-600 font-medium">
                                추가
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceDetailModal;

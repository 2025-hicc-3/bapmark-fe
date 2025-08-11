import React, { useState } from 'react';
import modifyIcon from '../../assets/icons/modify.svg';
import makeNewIcon from '../../assets/icons/make_new.svg';
import StampBook from './StampBook';
import StampMap from './StampMap';
import StampModifyModal from './StampModifyModal';
import { useStamp } from '../../store/StampContext';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isVisited: boolean;
}

interface Stamp {
  id: string;
  name: string;
  color: string;
  locations: Place[];
}

interface StampModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StampModal: React.FC<StampModalProps> = ({ isOpen, onClose }) => {
  const [isLinkMode, setIsLinkMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedStampBook, setSelectedStampBook] = useState<Stamp | null>(
    null
  );
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedStampForModify, setSelectedStampForModify] =
    useState<Stamp | null>(null);

  // StampContext에서 데이터 가져오기
  const { stampData, createStampBoard, updateStampBoard, deleteStampBoard } = useStamp();

  // StampContext 데이터를 기존 Stamp 형식으로 변환
  const stamps: Stamp[] = stampData.stampBoards.map(board => ({
    id: board.id,
    name: board.title,
    color: board.color,
    locations: (board.bookmarks || []).map(bookmark => ({
      id: bookmark.id,
      name: bookmark.placeName,
      lat: bookmark.latitude,
      lng: bookmark.longitude,
      isVisited: bookmark.visited
    }))
  }));

  const handleStampClick = (stamp: Stamp) => {
    setSelectedStampBook(stamp);
    setShowMap(true);
  };

  const handleStampLongPress = (stamp: Stamp) => {
    setSelectedStampForModify(stamp);
    setShowModifyModal(true);
  };

  const handleModify = () => {
    setShowModifyModal(true);
  };

  const handleMakeNew = () => {
    // TODO: 새 스탬프 만들기 기능
    console.log('새 스탬프 만들기');
  };

  const handleLinkPaste = () => {
    setIsLinkMode(true);
  };

  const handleBackToMain = () => {
    setIsLinkMode(false);
    setLinkUrl('');
  };

  const handleConfirmLink = () => {
    // TODO: 링크 처리 로직
    console.log('링크 확인:', linkUrl);
    setIsLinkMode(false);
    setLinkUrl('');
  };

  const handleBackFromMap = () => {
    setShowMap(false);
    setSelectedStampBook(null);
  };

  const handleStampBookChange = (stampBookId: string) => {
    const stampBook = stamps.find((stamp) => stamp.id === stampBookId);
    if (stampBook) {
      setSelectedStampBook(stampBook);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseModifyModal = () => {
    setShowModifyModal(false);
    setSelectedStampForModify(null);
  };

  const handleSaveModify = (stampName: string, stampColor: string) => {
    if (selectedStampForModify) {
      // 스탬프 데이터 업데이트
      updateStampBoard(selectedStampForModify.id, {
        title: stampName,
        color: stampColor
      });

      // 선택된 스탬프도 업데이트
      setSelectedStampForModify((prev) =>
        prev ? { ...prev, name: stampName, color: stampColor } : null
      );
    }
    setShowModifyModal(false);
  };

  if (!isOpen) return null;

  // 지도 화면이 표시되는 경우
  if (showMap && selectedStampBook) {
    // Stamp를 StampBook으로 변환
    const stampBookForMap = {
      id: selectedStampBook.id,
      name: selectedStampBook.name,
      color: selectedStampBook.color,
      places: selectedStampBook.locations || [],
    };

    const availableStampBooksForMap = stamps.map((stamp) => ({
      id: stamp.id,
      name: stamp.name,
      color: stamp.color,
      places: stamp.locations || [],
    }));

    return (
      <StampMap
        stampBook={stampBookForMap}
        onBack={handleBackFromMap}
        onStampBookChange={handleStampBookChange}
        availableStampBooks={availableStampBooksForMap}
      />
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
        onClick={handleBackdropClick}
      >
        <div
          className={`bg-white rounded-3xl w-[90%] max-w-[387px] overflow-hidden transition-all duration-300 ${
            isLinkMode ? 'h-[40vh]' : 'h-[60vh]'
          }`}
        >
          {!isLinkMode ? (
            <>
              {/* 상단 영역 - 버튼들이 차지 */}
              <div className="flex justify-end p-4">
                <div className="flex flex-col items-end space-y-0">
                  <div className="flex space-x-2">
                    <button onClick={handleModify} className="p-2">
                      <img src={modifyIcon} alt="수정" />
                    </button>
                    <button onClick={handleMakeNew}>
                      <img src={makeNewIcon} alt="새로 만들기" />
                    </button>
                  </div>
                  <button
                    onClick={handleLinkPaste}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    링크 붙여넣기
                  </button>
                </div>
              </div>

              {/* 스탬프북 컴포넌트 */}
              <StampBook
                stamps={stamps}
                onStampClick={handleStampClick}
                onStampLongPress={handleStampLongPress}
              />
            </>
          ) : (
            <>
              {/* 링크 입력 모드 */}
              <div className="p-6 h-full flex flex-col">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-center">
                    링크 붙여넣기
                  </h3>
                </div>

                <div className="flex-1 flex-col space-y-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="링크를 붙여넣어주세요..."
                        className="w-full h-12 px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleBackToMain}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleConfirmLink}
                      disabled={!linkUrl.trim()}
                      className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 수정 모달 */}
        <StampModifyModal
          isOpen={showModifyModal}
          stamp={selectedStampForModify}
          onClose={handleCloseModifyModal}
          onSave={handleSaveModify}
        />
      </div>
    </>
  );
};

export default StampModal;

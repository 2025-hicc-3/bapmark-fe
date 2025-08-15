import React, { useState } from 'react';
import makeNewIcon from '../../assets/icons/make_new.svg';
import colorIcon from '../../assets/icons/color.svg';
import StampBook from './StampBook';
import StampMap from './StampMap';
import StampModifyModal from './StampModifyModal';
import { useStamp } from '../../store/StampContext';
import { colorPalette } from './colorPalette';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isVisited: boolean;
  address?: string;
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

  // 새로운 상태들
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedColorForCreate, setSelectedColorForCreate] =
    useState<string>('');

  // StampContext에서 데이터 가져오기
  const { stampData, createStampBoard, updateStampBoard, deleteStampBoard } =
    useStamp();

  // StampContext 데이터를 기존 Stamp 형식으로 변환
  const stamps: Stamp[] = stampData.stampBoards.map((board) => {
    console.log(`스탬프보드 ${board.id} (${board.title}) 변환:`, board.bookmarks);
    
    return {
      id: board.id.toString(), // number를 string으로 변환
      name: board.title,
      color: board.color,
      locations: (board.bookmarks || []).map((bookmark) => ({
        id: bookmark.postId.toString(), // number를 string으로 변환
        name: bookmark.title, // bookmark.placeName 대신 title 사용
        lat: bookmark.latitude,
        lng: bookmark.longitude,
        isVisited: bookmark.visited,
        address: bookmark.address,
      })),
    };
  });

  const handleStampClick = (stamp: Stamp) => {
    setSelectedStampBook(stamp);
    setShowMap(true);
  };

  const handleStampLongPress = (stamp: Stamp) => {
    setSelectedStampForModify(stamp);
    setShowModifyModal(true);
  };

  // make_new 아이콘 클릭 시 새 스탬프북 만들기 모달 표시
  const handleMakeNew = () => {
    setShowCreateModal(true);
    setSelectedColorForCreate(''); // 색상 선택 초기화
  };

  // 새 스탬프북 생성
  const handleCreateStampBoard = async (title: string, color: string) => {
    try {
      const success = await createStampBoard(title, color);
      if (success) {
        setShowCreateModal(false);
        setSelectedColorForCreate(''); // 색상 선택 초기화
        console.log('스탬프북이 성공적으로 생성되었습니다.');
      } else {
        console.error('스탬프북 생성에 실패했습니다.');
        // 에러 메시지는 StampContext에서 이미 설정됨
      }
    } catch (error) {
      console.error('스탬프북 생성 중 오류 발생:', error);
    }
  };

  // 색상 선택 처리
  const handleColorSelect = (color: string) => {
    setSelectedColorForCreate(color);
  };

  // 생성 버튼 클릭 처리
  const handleCreateClick = () => {
    const titleInput = document.getElementById(
      'stampTitle'
    ) as HTMLInputElement;
    if (titleInput && titleInput.value.trim() && selectedColorForCreate) {
      handleCreateStampBoard(titleInput.value.trim(), selectedColorForCreate);
    } else {
      alert('스탬프북 이름과 색상을 모두 선택해주세요.');
    }
  };

  // 스탬프북 삭제
  const handleDeleteStampBoard = async (stampId: number) => {
    try {
      const success = await deleteStampBoard(stampId);
      if (success) {
        setShowModifyModal(false);
        setSelectedStampForModify(null);
        console.log('스탬프북이 성공적으로 삭제되었습니다.');
      } else {
        console.error('스탬프북 삭제에 실패했습니다.');
        // 에러 메시지는 StampContext에서 이미 설정됨
      }
    } catch (error) {
      console.error('스탬프북 삭제 중 오류 발생:', error);
    }
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

  const handleSaveModify = async (stampName: string, stampColor: string) => {
    if (selectedStampForModify) {
      try {
        const success = await updateStampBoard(selectedStampForModify.id, {
          title: stampName,
          color: stampColor,
        });

        if (success) {
          // 선택된 스탬프도 업데이트
          setSelectedStampForModify((prev) =>
            prev ? { ...prev, name: stampName, color: stampColor } : null
          );
          setShowModifyModal(false);
          console.log('스탬프북이 성공적으로 수정되었습니다.');
        } else {
          console.error('스탬프북 수정에 실패했습니다.');
          // 에러 메시지는 StampContext에서 이미 설정됨
        }
      } catch (error) {
        console.error('스탬프북 수정 중 오류 발생:', error);
      }
    }
  };

  if (!isOpen) return null;

  // 지도 화면이 표시되는 경우
  if (showMap && selectedStampBook) {
    // Stamp를 StampBook으로 변환 (Place 객체의 id를 string으로 변환)
    const stampBookForMap = {
      id: selectedStampBook.id,
      name: selectedStampBook.name,
      color: selectedStampBook.color,
      places: (selectedStampBook.locations || []).map(location => ({
        ...location,
        id: location.id.toString(), // string으로 변환
      })),
    };

    const availableStampBooksForMap = stamps.map((stamp) => ({
      id: stamp.id,
      name: stamp.name,
      color: stamp.color,
      places: (stamp.locations || []).map(location => ({
        ...location,
        id: location.id.toString(), // string으로 변환
      })),
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
                        className="w-full h-12 px-4 py-2 border border-gray-300 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
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
          stampBoard={stampData.stampBoards.find(
            (board) => board.id === selectedStampForModify?.id
          )}
          onClose={handleCloseModifyModal}
          onSave={handleSaveModify}
          onDelete={handleDeleteStampBoard}
        />

        {/* 새 스탬프북 만들기 모달 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-3xl w-[90%] max-w-[387px] p-6">
              <h3 className="text-lg font-semibold text-center mb-4">
                새 스탬프북 만들기
              </h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    스탬프북 이름
                  </label>
                  <input
                    type="text"
                    id="stampTitle"
                    placeholder="스탬프북 이름을 입력하세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    색상 선택
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          selectedColorForCreate === color
                            ? 'border-blue-500 ring-2 ring-blue-300'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                        title={color}
                      >
                        {selectedColorForCreate === color && (
                          <img
                            src={colorIcon}
                            alt="선택됨"
                            className="w-6 h-6 mx-auto"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={handleCreateClick}
                  disabled={!selectedColorForCreate}
                  className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  생성
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StampModal;

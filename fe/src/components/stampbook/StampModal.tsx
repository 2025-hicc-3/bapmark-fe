import React, { useState } from 'react';
import modifyIcon from '../../assets/icons/modify.svg';
import makeNewIcon from '../../assets/icons/make_new.svg';
import StampBook from './StampBook';
import StampMap from './StampMap';
import StampModifyModal from './StampModifyModal';
import { colorPalette } from './colorPalette';

interface StampModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  // Mock 스탬프 데이터를 상태로 관리
  const [stamps, setStamps] = useState<Stamp[]>([
    {
      id: '1',
      name: '카페 스탬프',
      color: colorPalette[0], // 첫 번째 색상 사용
      locations: [
        {
          id: '1',
          name: '스타벅스 강남점',
          lat: 37.5665,
          lng: 126.978,
          isVisited: true,
        },
        {
          id: '2',
          name: '투썸플레이스 홍대점',
          lat: 37.5575,
          lng: 126.925,
          isVisited: false,
        },
        {
          id: '3',
          name: '할리스 커피 신촌점',
          lat: 37.5595,
          lng: 126.943,
          isVisited: false,
        },
      ],
    },
    {
      id: '2',
      name: '맛집 스탬프',
      color: colorPalette[1], // 두 번째 색상 사용
      locations: [
        {
          id: '6',
          name: '맛있는 치킨집',
          lat: 37.5725,
          lng: 126.985,
          isVisited: true,
        },
        {
          id: '7',
          name: '피자나라',
          lat: 37.5535,
          lng: 126.935,
          isVisited: false,
        },
        {
          id: '8',
          name: '스시로',
          lat: 37.5685,
          lng: 126.988,
          isVisited: true,
        },
      ],
    },
    {
      id: '3',
      name: '일식집 스탬프',
      color: colorPalette[2], // 세 번째 색상 사용
      locations: [
        {
          id: '9',
          name: '스시로',
          lat: 37.5515,
          lng: 126.988,
          isVisited: true,
        },
        {
          id: '10',
          name: '우동집',
          lat: 37.5475,
          lng: 126.915,
          isVisited: false,
        },
        {
          id: '11',
          name: '라멘집',
          lat: 37.5795,
          lng: 126.991,
          isVisited: true,
        },
      ],
    },
  ]);

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
      setStamps((prevStamps) =>
        prevStamps.map((stamp) =>
          stamp.id === selectedStampForModify.id
            ? { ...stamp, name: stampName, color: stampColor }
            : stamp
        )
      );

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
      </div>

      {/* 수정 모달 */}
      <StampModifyModal
        isOpen={showModifyModal}
        stamp={selectedStampForModify}
        onClose={handleCloseModifyModal}
        onSave={handleSaveModify}
      />
    </>
  );
};

export default StampModal;

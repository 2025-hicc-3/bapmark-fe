import React, { useState } from 'react';
import modifyIcon from '../../assets/icons/modify.svg';
import makeNewIcon from '../../assets/icons/make_new.svg';
import StampBook from './StampBook';
import StampMap from './StampMap';

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
  locationCount: number;
  places?: Place[];
}

const StampModal: React.FC<StampModalProps> = ({ isOpen, onClose }) => {
  const [isLinkMode, setIsLinkMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedStampBook, setSelectedStampBook] = useState<Stamp | null>(
    null
  );

  // Mock 스탬프 데이터
  const stamps: Stamp[] = [
    {
      id: '1',
      name: '카페 스탬프',
      color: '#b9375e',
      locationCount: 3,
      places: [
        {
          id: '1',
          name: '스타벅스 강남점',
          lat: 37.5665,
          lng: 126.978,
          isVisited: false,
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
      color: '#be9a60',
      locationCount: 10,
      places: [
        {
          id: '6',
          name: '맛있는 치킨집',
          lat: 37.5665,
          lng: 126.978,
          isVisited: true,
        },
        {
          id: '7',
          name: '피자나라',
          lat: 37.5575,
          lng: 126.925,
          isVisited: false,
        },
        {
          id: '8',
          name: '스시로',
          lat: 37.5665,
          lng: 126.978,
          isVisited: true,
        },
      ],
    },
    {
      id: '3',
      name: '관광지 스탬프',
      color: '#434343',
      locationCount: 3,
      places: [
        {
          id: '9',
          name: '남산타워',
          lat: 37.5665,
          lng: 126.978,
          isVisited: true,
        },
        {
          id: '10',
          name: '경복궁',
          lat: 37.5575,
          lng: 126.925,
          isVisited: false,
        },
        {
          id: '11',
          name: '창덕궁',
          lat: 37.5665,
          lng: 126.978,
          isVisited: true,
        },
      ],
    },
  ];

  const handleStampClick = (stamp: Stamp) => {
    setSelectedStampBook(stamp);
    setShowMap(true);
  };

  const handleModify = () => {
    console.log('Modify clicked');
    // TODO: 수정 기능
  };

  const handleMakeNew = () => {
    console.log('Make new clicked');
    // TODO: 새로 만들기 기능
  };

  const handleLinkPaste = () => {
    setIsLinkMode(true);
  };

  const handleBackToMain = () => {
    setIsLinkMode(false);
    setLinkUrl('');
  };

  const handleConfirmLink = () => {
    console.log('Link confirmed:', linkUrl);
    // TODO: 링크 처리 로직
    setIsLinkMode(false);
    setLinkUrl('');
  };

  const handleBackFromMap = () => {
    setShowMap(false);
    setSelectedStampBook(null);
  };

  const handleStampBookChange = (stampBookId: string) => {
    const newStampBook = stamps.find((stamp) => stamp.id === stampBookId);
    if (newStampBook) {
      setSelectedStampBook(newStampBook);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // 지도 화면이 표시되는 경우
  if (showMap && selectedStampBook) {
    // Stamp를 StampBook으로 변환
    const stampBookForMap = {
      id: selectedStampBook.id,
      name: selectedStampBook.name,
      color: selectedStampBook.color,
      places: selectedStampBook.places || [],
    };

    const availableStampBooksForMap = stamps.map((stamp) => ({
      id: stamp.id,
      name: stamp.name,
      color: stamp.color,
      places: stamp.places || [],
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
            <StampBook stamps={stamps} onStampClick={handleStampClick} />
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
  );
};

export default StampModal;

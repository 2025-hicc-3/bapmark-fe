import React from 'react';
import modifyIcon from '../../assets/icons/modify.svg';
import makeNewIcon from '../../assets/icons/make_new.svg';
import StampBook from './StampBook';

interface StampModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Stamp {
  id: string;
  name: string;
  color: string;
  locationCount: number;
}

const StampModal: React.FC<StampModalProps> = ({ isOpen, onClose }) => {
  // Mock 스탬프 데이터
  const stamps: Stamp[] = [
    {
      id: '1',
      name: '카페 스탬프',
      color: '#b9375e',
      locationCount: 7,
    },
    {
      id: '2',
      name: '맛집 스탬프',
      color: '#be9a60',
      locationCount: 10,
    },
    {
      id: '3',
      name: '관광지 스탬프',
      color: '#434343',
      locationCount: 3,
    },
  ];

  const handleStampClick = (stamp: Stamp) => {
    console.log('Stamp clicked:', stamp.name);
    // TODO: 지도 뷰로 전환
  };

  const handleModify = () => {
    console.log('Modify clicked');
    // TODO: 수정 기능
  };

  const handleMakeNew = () => {
    console.log('Make new clicked');
    // TODO: 새로 만들기 기능
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl w-[90%] max-w-[387px] h-[60vh] overflow-hidden">
        {/* 상단 영역 - 버튼들이 차지 */}
        <div className="flex justify-end p-4">
          <div className="flex space-x-2">
            <button onClick={handleModify}>
              <img src={modifyIcon} alt="수정" />
            </button>
            <button onClick={handleMakeNew}>
              <img src={makeNewIcon} alt="새로 만들기" />
            </button>
          </div>
        </div>

        {/* 스탬프북 컴포넌트 */}
        <StampBook stamps={stamps} onStampClick={handleStampClick} />
      </div>
    </div>
  );
};

export default StampModal;

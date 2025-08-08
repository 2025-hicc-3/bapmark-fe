import React, { useState } from 'react';
import colorIcon from '../../assets/icons/color.svg';
import ColorSelectModal from './ColorSelectModal';

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

interface StampModifyModalProps {
  isOpen: boolean;
  stamp: Stamp | null;
  onClose: () => void;
  onSave: (stampName: string, stampColor: string) => void;
}

const StampModifyModal: React.FC<StampModifyModalProps> = ({
  isOpen,
  stamp,
  onClose,
  onSave,
}) => {
  const [stampName, setStampName] = useState('');
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');

  // 모달이 열릴 때 스탬프명 초기화
  React.useEffect(() => {
    if (stamp) {
      setStampName(stamp.name);
      setSelectedColor(stamp.color);
    }
  }, [stamp]);

  const handleSave = () => {
    onSave(stampName, selectedColor);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  if (!isOpen || !stamp) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-3xl w-[90%] max-w-[360px] h-[80%] overflow-hidden flex flex-col">
          {/* 헤더 */}
          <div className="h-16 bg-white flex items-center justify-between px-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className="rounded-2xl min-w-48 h-14 flex items-center justify-center relative"
              style={{ backgroundColor: selectedColor || stamp.color }}
            >
              <span className="text-white font-bold text-xl">{stamp.name}</span>
              <img
                src={colorIcon}
                alt="Color"
                className="absolute -bottom-1 -right-1 w-5 h-5 mb-2 mr-2 cursor-pointer"
                onClick={() => setShowColorModal(true)}
              />
            </div>
            <div className="w-10"></div> {/* 균형을 위한 빈 공간 */}
          </div>

          {/* 스탬프 정보 */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* 스탬프명 입력 */}
            <div className="mb-6">
              <label className="block text-xs text-gray-500 mb-2">
                스탬프명
              </label>
              <input
                type="text"
                value={stampName}
                onChange={(e) => setStampName(e.target.value)}
                className="w-full h-12 px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="스탬프명을 입력하세요"
              />
            </div>

            {/* 장소 선택하기 */}
            <div className="mb-6">
              <label className="block text-xs text-gray-500 mb-3">
                장소 선택하기
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 10 }, (_, index) => {
                  const location = stamp.locations[index];
                  const isVisited = location?.isVisited || false;
                  const hasLocation = !!location;

                  return (
                    <div
                      key={index}
                      className={`h-6 rounded-md flex items-center justify-center text-xs font-semibold transition-colors ${
                        hasLocation
                          ? isVisited
                            ? 'bg-[#153641] text-white'
                            : 'bg-[#acacac] text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {hasLocation ? location.name : `장소 ${index + 1}`}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 저장 버튼 - 하단 고정 */}
          <div className="p-4 flex-shrink-0 flex justify-center">
            <button
              onClick={handleSave}
              className="w-32 bg-[#434343] text-white px-8 py-3 rounded-2xl font-semibold hover:bg-gray-700 transition-colors"
            >
              저장하기
            </button>
          </div>
        </div>
      </div>

      {/* 색상 선택 모달 */}
      <ColorSelectModal
        isOpen={showColorModal}
        stampName={stamp.name}
        currentColor={stamp.color}
        selectedColor={selectedColor}
        onClose={() => setShowColorModal(false)}
        onColorSelect={handleColorSelect}
      />
    </>
  );
};

export default StampModifyModal;

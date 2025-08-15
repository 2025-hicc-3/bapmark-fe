import React, { useState, useEffect } from 'react';
import { colorPalette } from './colorPalette';
import colorIcon from '../../assets/icons/color.svg';

interface ColorSelectModalProps {
  isOpen: boolean;
  stampName: string;
  currentColor: string;
  selectedColor: string;
  onClose: () => void;
  onColorSelect: (color: string) => void;
}

const ColorSelectModal: React.FC<ColorSelectModalProps> = ({
  isOpen,
  stampName,
  currentColor,
  selectedColor,
  onClose,
  onColorSelect,
}) => {
  const [tempSelectedColor, setTempSelectedColor] = useState(selectedColor);

  // 모달이 열릴 때 임시 선택 색상을 현재 선택된 색상으로 초기화
  useEffect(() => {
    if (isOpen) {
      setTempSelectedColor(selectedColor);
    }
  }, [isOpen, selectedColor]);

  const handleColorClick = (color: string) => {
    setTempSelectedColor(color);
  };

  const handleSave = () => {
    onColorSelect(tempSelectedColor);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[10000]"
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
            style={{ backgroundColor: tempSelectedColor || currentColor }}
          >
            <span className="text-white font-bold text-xl">{stampName}</span>
          </div>
          <div className="w-10"></div>
        </div>

        {/* 색상 선택 그리드 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-5 gap-2">
            {colorPalette.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorClick(color)}
                className={`w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 relative ${
                  tempSelectedColor === color ? '' : ''
                }`}
                style={{ backgroundColor: color }}
              >
                {tempSelectedColor === color && (
                  <img
                    src={colorIcon}
                    alt="Color"
                    className="absolute inset-0 m-auto w-6 h-6"
                  />
                )}
              </button>
            ))}
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
  );
};

export default ColorSelectModal;

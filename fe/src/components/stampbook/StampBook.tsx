import React from 'react';

interface Stamp {
  id: string;
  name: string;
  color: string;
  locationCount: number;
}

interface StampBookProps {
  stamps: Stamp[];
  onStampClick?: (stamp: Stamp) => void;
}

const StampBook: React.FC<StampBookProps> = ({ stamps, onStampClick }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-3">
        {stamps.map((stamp) => (
          <div
            key={stamp.id}
            onClick={() => onStampClick?.(stamp)}
            className="cursor-pointer transition-all duration-200 hover:scale-105"
          >
            <div
              className="h-16 rounded-2xl p-3 flex items-center justify-between"
              style={{ backgroundColor: stamp.color }}
            >
              {/* 스탬프 아이콘들 - 5개씩 2행으로 배치 */}
              <div className="flex flex-col space-y-0.5">
                {/* 첫 번째 행 (5개) */}
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div
                      key={`row1-${index}`}
                      className={`w-5 h-5 rounded-full ${
                        index < Math.min(stamp.locationCount, 5)
                          ? 'bg-white'
                          : 'border-2 border-white'
                      }`}
                    />
                  ))}
                </div>
                {/* 두 번째 행 (5개) */}
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div
                      key={`row2-${index}`}
                      className={`w-5 h-5 rounded-full ${
                        index + 5 < stamp.locationCount
                          ? 'bg-white'
                          : 'border-2 border-white'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 스탬프명 - 우측에 배치 */}
              <span className="text-white font-bold text-lg opacity-80">
                {stamp.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StampBook;

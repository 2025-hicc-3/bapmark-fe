import React from 'react';

interface Location {
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
  locations: Location[];
}

interface StampBookProps {
  stamps: Stamp[];
  onStampClick?: (stamp: Stamp) => void;
  onStampLongPress?: (stamp: Stamp) => void;
}

const StampBook: React.FC<StampBookProps> = ({
  stamps,
  onStampClick,
  onStampLongPress,
}) => {
  // 스탬프 렌더링 함수
  const renderStamps = (locations: Location[]) => {
    const stampsPerRow = 5; // 행당 스탬프 개수

    // locations가 undefined이거나 배열이 아닌 경우 빈 배열로 처리
    const safeLocations = Array.isArray(locations) ? locations : [];

    return (
      <div className="flex flex-col space-y-0.5">
        {/* 첫 번째 행 (5개) */}
        <div className="flex space-x-1">
          {Array.from({ length: stampsPerRow }, (_, index) => {
            const location = safeLocations[index];
            const isVisited = location?.isVisited || false;
            const hasLocation = !!location;

            return (
              <div
                key={`row1-${index}`}
                className={`w-5 h-5 rounded-full transition-all duration-200 ${
                  hasLocation
                    ? isVisited
                      ? 'bg-white' // 방문한 경우 완전한 원
                      : 'bg-white bg-opacity-50' // 방문하지 않은 경우 반투명
                    : 'border-2 border-white border-opacity-30' // 위치가 없는 경우 투명한 테두리
                }`}
              />
            );
          })}
        </div>
        {/* 두 번째 행 (5개) */}
        <div className="flex space-x-1">
          {Array.from({ length: stampsPerRow }, (_, index) => {
            const location = safeLocations[index + stampsPerRow];
            const isVisited = location?.isVisited || false;
            const hasLocation = !!location;

            return (
              <div
                key={`row2-${index}`}
                className={`w-5 h-5 rounded-full transition-all duration-200 ${
                  hasLocation
                    ? isVisited
                      ? 'bg-white' // 방문한 경우 완전한 원
                      : 'bg-white bg-opacity-50' // 방문하지 않은 경우 반투명
                    : 'border-2 border-white border-opacity-30' // 위치가 없는 경우 투명한 테두리
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  // 길게 누르기 타이머 관리
  const longPressTimers = React.useRef<{ [key: string]: number }>({});
  const longPressTriggered = React.useRef<{ [key: string]: boolean }>({});

  const handleStart = (stamp: Stamp) => {
    // 이미 길게 누르기가 트리거된 경우 무시
    if (longPressTriggered.current[stamp.id]) {
      return;
    }

    const timer = setTimeout(() => {
      console.log('길게 누르기 트리거됨:', stamp.name);
      longPressTriggered.current[stamp.id] = true;
      onStampLongPress?.(stamp);
    }, 500); // 500ms 후에 길게 누르기로 인식

    longPressTimers.current[stamp.id] = timer;
  };

  const handleEnd = (stamp: Stamp) => {
    // 타이머가 있으면 클리어
    if (longPressTimers.current[stamp.id]) {
      clearTimeout(longPressTimers.current[stamp.id]);
      delete longPressTimers.current[stamp.id];
    }

    // 길게 누르기가 트리거되지 않았다면 클릭 이벤트 실행
    if (!longPressTriggered.current[stamp.id]) {
      console.log('클릭 이벤트 실행:', stamp.name);
      onStampClick?.(stamp);
    }

    // 길게 누르기 상태 초기화
    delete longPressTriggered.current[stamp.id];
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-3">
        {stamps.map((stamp) => (
          <div
            key={stamp.id}
            onMouseDown={() => handleStart(stamp)}
            onMouseUp={() => handleEnd(stamp)}
            onMouseLeave={() => handleEnd(stamp)}
            onTouchStart={() => handleStart(stamp)}
            onTouchEnd={() => handleEnd(stamp)}
            className="cursor-pointer transition-all duration-200 hover:scale-105 select-none touch-manipulation"
          >
            <div
              className="h-16 rounded-2xl p-3 flex items-center justify-between"
              style={{ backgroundColor: stamp.color }}
            >
              {/* 스탬프 아이콘들 */}
              {renderStamps(stamp.locations)}

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

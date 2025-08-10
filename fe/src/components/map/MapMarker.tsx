import React from 'react';

interface MapMarkerProps {
  name: string;
  x: number;
  y: number;
  isVisited?: boolean;
}

const MapMarker: React.FC<MapMarkerProps> = ({
  name,
  x,
  y,
  isVisited = false,
}) => {
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: x, top: y }}
    >
      {/* 마커 원 */}
      <div
        className={`w-2 h-2 rounded-full ${isVisited ? 'bg-black' : 'border border-black'}`}
      />

      {/* 장소 이름 */}
      <span className="text-xs text-black mt-1 whitespace-nowrap">{name}</span>
    </div>
  );
};

export default MapMarker;

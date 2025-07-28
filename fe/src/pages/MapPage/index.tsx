import React from 'react';
import Header from '../../components/layout/Header';
import Navigation from '../../components/layout/Navigation';
import MapMarker from '../../components/map/MapMarker';

const MapPage = () => {
  // 피그마 디자인에서 확인한 마커 위치들
  const markers = [
    { name: '카미야', x: 104, y: 2500, isVisited: true },
    { name: '한신포차', x: 215, y: 2523, isVisited: false },
    { name: '가미우동', x: 162, y: 2583, isVisited: true },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content bg-gray-50">
        {/* 지도 영역 (임시로 배경색으로 표현) */}
        <div className="w-full h-full bg-gray-100 relative">
          {/* 지도 마커들 */}
          {markers.map((marker, index) => (
            <MapMarker
              key={index}
              name={marker.name}
              x={marker.x}
              y={marker.y}
              isVisited={marker.isVisited}
            />
          ))}

          {/* 우측 하단 스탬프 아이콘 */}
          <div className="absolute bottom-20 right-4">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-black rounded-full"></div>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <Navigation />
    </div>
  );
};

export default MapPage;

import React from 'react';
import Header from '../../components/layout/Header';
import Navigation from '../../components/layout/Navigation';
import KakaoMapTest from './KakaoMapTest';

const MapTestPage = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content bg-gray-50">
        <div className="w-full h-full p-4">
          <h1 className="text-2xl font-bold mb-4">카카오맵 테스트</h1>
          <KakaoMapTest />
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <Navigation />
    </div>
  );
};

export default MapTestPage;

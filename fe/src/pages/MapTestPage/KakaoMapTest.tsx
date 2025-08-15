import React, { useEffect, useRef } from 'react';

const KakaoMapTest = () => {
  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 카카오맵 스크립트 로드 (autoload=false 사용)
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      // kakao.maps.load() 콜백 사용 (공식 문서 권장)
      const kakao = (window as any).kakao;
      kakao.maps.load(() => {
        const container = mapRef.current;
        if (container) {
          // 지도 생성 (공식 문서 예시)
          const options = {
            center: new kakao.maps.LatLng(37.5519, 126.9255), // 홍익대학교
            level: 3,
          };

          new kakao.maps.Map(container, options);
        }
      });
    };

    document.head.appendChild(script);
  }, [apiKey]);

  if (!apiKey) {
    return (
      <div className="w-full h-full">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">카카오맵 테스트</h2>
          <p className="text-sm text-red-600">
            카카오맵 API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.
          </p>
        </div>
        <div className="w-full h-96 border border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">API 키를 설정해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">카카오맵 테스트</h2>
        <p className="text-sm text-gray-600">공식 문서 기반 간단한 지도</p>
      </div>
      <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default KakaoMapTest;

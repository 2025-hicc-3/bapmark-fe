import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/layout/Header';
import Navigation from '../../components/layout/Navigation';

const MapPage = () => {
  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 피그마 디자인에서 확인한 마커 위치들 (위도, 경도로 변환)
  const markers = [
    {
      name: '카미야',
      lat: 37.5665,
      lng: 126.978,
      isVisited: true,
    },
    {
      name: '한신포차',
      lat: 37.5675,
      lng: 126.979,
      isVisited: false,
    },
    {
      name: '가미우동',
      lat: 37.5685,
      lng: 126.98,
      isVisited: true,
    },
  ];

  // 카카오맵 SDK 로드 함수 (KakaoMapTest 방식 적용)
  const loadKakaoMapSDK = () => {
    return new Promise<void>((resolve, reject) => {
      // 이미 로드된 경우 즉시 반환
      if ((window as any).kakao) {
        setSdkLoaded(true);
        resolve();
        return;
      }

      // 중복 로딩 방지
      if (document.querySelector('script[src*="dapi.kakao.com"]')) {
        // 이미 로딩 중인 경우 대기
        const checkLoaded = setInterval(() => {
          if ((window as any).kakao) {
            clearInterval(checkLoaded);
            setSdkLoaded(true);
            resolve();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
      script.onload = () => {
        setSdkLoaded(true);
        resolve();
      };
      script.onerror = () => {
        reject(new Error('카카오맵 SDK 로드 실패'));
      };
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    if (!apiKey) return;

    const initMap = async () => {
      try {
        await loadKakaoMapSDK();

        if (!mapRef.current) {
          return;
        }

        const kakao = (window as any).kakao;

        // kakao.maps.load() 콜백 사용
        kakao.maps.load(() => {
          const container = mapRef.current;
          if (!container) {
            return;
          }

          // 지도 생성
          const options = {
            center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 시청
            level: 3,
          };

          const kakaoMap = new kakao.maps.Map(container, options);

          // 마커들 추가
          markers.forEach((marker) => {
            const position = new kakao.maps.LatLng(marker.lat, marker.lng);
            const kakaoMarker = new kakao.maps.Marker({
              position: position,
              map: kakaoMap,
            });

            // 마커 클릭 이벤트
            kakao.maps.event.addListener(kakaoMarker, 'click', function () {
              console.log(`${marker.name} 마커 클릭됨`);
              // TODO: 마커 클릭 시 상세 정보 표시
            });
          });
        });
      } catch (error) {
        console.error('지도 초기화 에러:', error);
        setError('지도를 불러오는데 실패했습니다.');
      }
    };

    initMap();
  }, [apiKey, markers]);

  if (!apiKey) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <main className="main-content bg-gray-50">
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-2">
                카카오맵 API 키가 설정되지 않았습니다.
              </p>
              <p className="text-sm text-gray-600">.env 파일을 확인해주세요.</p>
            </div>
          </div>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className="main-content bg-gray-50">
        {/* 지도 영역 */}
        <div className="w-full h-full relative">
          {/* 카카오맵 */}
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

          {/* 로딩 상태 표시 */}
          {!sdkLoaded && !error && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">지도 로딩 중...</p>
              </div>
            </div>
          )}

          {/* 에러 상태 표시 */}
          {error && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <Navigation />
    </div>
  );
};

export default MapPage;

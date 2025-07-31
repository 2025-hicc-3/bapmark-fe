import React, { useEffect, useRef, useState } from 'react';

const KakaoMapTest = () => {
  console.log('=== 카카오맵 테스트 컴포넌트 시작 ===');

  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('1. API 키 확인:', apiKey ? '설정됨' : '설정되지 않음');
  console.log('2. API 키 값:', apiKey);

  // 카카오맵 SDK 로드 함수
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
      // autoload=false 추가
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer&autoload=false`;
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
    console.log('3. 컴포넌트 마운트됨');

    const initMap = async () => {
      try {
        await loadKakaoMapSDK();
        console.log('4. 카카오 SDK 로드 완료');

        if (!mapRef.current) {
          console.log('5. mapRef가 아직 준비되지 않음');
          return;
        }

        console.log('6. 지도 생성 시작');

        const kakao = (window as any).kakao;

        // kakao.maps.load() 콜백 사용
        kakao.maps.load(() => {
          const container = mapRef.current;
          if (!container) {
            console.log('container가 준비되지 않음');
            return;
          }

          // 지도를 생성할 때 필요한 기본 옵션
          const options = {
            center: new kakao.maps.LatLng(37.5665, 126.978), // 서울 시청
            level: 3, // 지도의 확대 레벨
          };

          const map = new kakao.maps.Map(container, options);
          console.log('7. 지도 생성 완료:', map);

          // 마커 추가
          const markerPosition = new kakao.maps.LatLng(37.5665, 126.978);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });

          marker.setMap(map);
          console.log('8. 마커 추가 완료');

          // 지도 클릭 이벤트 추가
          kakao.maps.event.addListener(
            map,
            'click',
            function (mouseEvent: any) {
              const latlng = mouseEvent.latLng;
              console.log('지도 클릭:', latlng.getLat(), latlng.getLng());
            }
          );
        });
      } catch (error) {
        console.error('지도 초기화 에러:', error);
        setError('지도를 불러오는데 실패했습니다.');
      }
    };

    initMap();
  }, [apiKey]);

  if (!apiKey || apiKey === 'your_kakao_map_javascript_key_here') {
    console.log('9. API 키가 설정되지 않음 - 에러 화면 표시');
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

  console.log('10. 지도 렌더링 시작');

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">카카오맵 테스트</h2>
        <p className="text-sm text-gray-600">
          동적으로 로드하는 카카오맵 테스트
        </p>
        <p className="text-sm text-blue-600">
          콘솔을 확인하여 디버깅 정보를 확인하세요
        </p>
        {!sdkLoaded && !error && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">카카오맵 로딩 중...</p>
            </div>
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default KakaoMapTest;

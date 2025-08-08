import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/layout/Header';
import Navigation from '../../components/layout/Navigation';
import emptyMarkIcon from '../../assets/icons/empty_mark.svg';
import fillMarkIcon from '../../assets/icons/fill_mark.svg';
import { colorPalette } from '../../components/stampbook/colorPalette';
import PlaceDetailModal from '../../components/map/PlaceDetailModal';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isVisited: boolean;
  address?: string;
  sourceTitle?: string;
  sourceContent?: string;
}

interface Stamp {
  id: string;
  name: string;
  color: string;
  locations: Place[];
}

const MapPage = () => {
  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showPlaceDetail, setShowPlaceDetail] = useState(false);

  // 모든 스탬프 데이터 (StampModal에서 가져온 데이터)
  const stamps: Stamp[] = [
    {
      id: '1',
      name: '카페 스탬프',
      color: colorPalette[0], // 첫 번째 색상 사용
      locations: [
        {
          id: '1',
          name: '스타벅스 강남점',
          lat: 37.5665,
          lng: 126.978,
          isVisited: true,
          address: '서울 강남구 강남대로 396',
          sourceTitle: '카페 리뷰',
          sourceContent: '강남역 근처 스타벅스입니다.',
        },
        {
          id: '2',
          name: '투썸플레이스 홍대점',
          lat: 37.5575,
          lng: 126.925,
          isVisited: false,
          address: '서울 마포구 홍대로 123',
          sourceTitle: '카페 추천',
          sourceContent: '홍대입구역 근처 투썸플레이스입니다.',
        },
        {
          id: '3',
          name: '할리스 커피 신촌점',
          lat: 37.5595,
          lng: 126.943,
          isVisited: false,
          address: '서울 서대문구 신촌로 123',
          sourceTitle: '카페 정보',
          sourceContent: '신촌역 근처 할리스 커피입니다.',
        },
      ],
    },
    {
      id: '2',
      name: '맛집 스탬프',
      color: colorPalette[1], // 두 번째 색상 사용
      locations: [
        {
          id: '6',
          name: '맛있는 치킨집',
          lat: 37.5725,
          lng: 126.985,
          isVisited: true,
          address: '서울 강남구 테헤란로 456',
          sourceTitle: '맛집 리뷰',
          sourceContent: '강남역 근처 맛있는 치킨집입니다.',
        },
        {
          id: '7',
          name: '피자나라',
          lat: 37.5535,
          lng: 126.935,
          isVisited: false,
          address: '서울 마포구 와우산로 789',
          sourceTitle: '피자 맛집',
          sourceContent: '홍대입구역 근처 피자나라입니다.',
        },
        {
          id: '8',
          name: '스시로',
          lat: 37.5685,
          lng: 126.988,
          isVisited: true,
          address: '서울 강남구 강남대로 321',
          sourceTitle: '스시 맛집',
          sourceContent: '강남역 근처 스시로입니다.',
        },
      ],
    },
    {
      id: '3',
      name: '일식집 스탬프',
      color: colorPalette[2], // 세 번째 색상 사용
      locations: [
        {
          id: '9',
          name: '스시로',
          lat: 37.5515,
          lng: 126.988,
          isVisited: true,
          address: '서울 강남구 논현로 654',
          sourceTitle: '스시 맛집',
          sourceContent: '논현역 근처 스시로입니다.',
        },
        {
          id: '10',
          name: '우동집',
          lat: 37.5475,
          lng: 126.915,
          isVisited: false,
          address: '서울 마포구 동교로 987',
          sourceTitle: '우동 맛집',
          sourceContent: '홍대입구역 근처 우동집입니다.',
        },
        {
          id: '11',
          name: '라멘집',
          lat: 37.5795,
          lng: 126.991,
          isVisited: true,
          address: '서울 강남구 삼성로 147',
          sourceTitle: '라멘 맛집',
          sourceContent: '삼성역 근처 라멘집입니다.',
        },
      ],
    },
  ];

  // 모든 장소를 하나의 배열로 합치기
  const allPlaces = stamps.flatMap((stamp) =>
    stamp.locations.map((place) => ({
      ...place,
      stampName: stamp.name,
      stampColor: stamp.color,
    }))
  );

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

          // 모든 장소에 마커 추가
          allPlaces.forEach((place) => {
            const position = new kakao.maps.LatLng(place.lat, place.lng);

            // 방문 상태에 따라 다른 아이콘 사용
            const iconSrc = place.isVisited ? fillMarkIcon : emptyMarkIcon;
            const markerImage = new kakao.maps.MarkerImage(
              iconSrc,
              new kakao.maps.Size(16, 16)
            );

            const kakaoMarker = new kakao.maps.Marker({
              position: position,
              map: kakaoMap,
              image: markerImage,
            });

            // 장소 이름을 표시하는 커스텀 오버레이 생성
            const placeNameElement = document.createElement('div');
            placeNameElement.className = 'place-name-overlay';
            placeNameElement.style.cssText = `
              position: absolute;
              background: rgba(0, 0, 0, 0.8);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              white-space: nowrap;
              transform: translateX(-50%);
              margin-top: 8px;
              z-index: 1000;
            `;
            placeNameElement.textContent = place.name;

            new kakao.maps.CustomOverlay({
              position: position,
              content: placeNameElement,
              map: kakaoMap,
              yAnchor: 0,
            });

            // 마커 클릭 이벤트
            kakao.maps.event.addListener(kakaoMarker, 'click', function () {
              console.log(`${place.name} 마커 클릭됨`);
              setSelectedPlace(place);
              setShowPlaceDetail(true);
            });
          });
        });
      } catch (error) {
        console.error('지도 초기화 에러:', error);
        setError('지도를 불러오는데 실패했습니다.');
      }
    };

    initMap();
  }, [apiKey, allPlaces]);

  const handleKakaoMap = () => {
    if (selectedPlace) {
      const url = `https://map.kakao.com/link/map/${selectedPlace.name},${selectedPlace.lat},${selectedPlace.lng}`;
      window.open(url, '_blank');
    }
  };

  const handleNaverMap = () => {
    if (selectedPlace) {
      const url = `https://map.naver.com/p/search/${selectedPlace.name}`;
      window.open(url, '_blank');
    }
  };

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

      {/* 장소 상세 정보 모달 */}
      {selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          isOpen={showPlaceDetail}
          onClose={() => setShowPlaceDetail(false)}
          onKakaoMap={handleKakaoMap}
          onNaverMap={handleNaverMap}
        />
      )}
    </div>
  );
};

export default MapPage;

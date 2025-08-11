import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/layout/Header';
import Navigation from '../../components/layout/Navigation';
import emptyMarkIcon from '../../assets/icons/empty_mark.svg';
import fillMarkIcon from '../../assets/icons/fill_mark.svg';
import { useStamp } from '../../store/StampContext';
import PlaceDetailModal from '../../components/map/PlaceDetailModal';

interface PlaceDetail {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isVisited: boolean;
  address?: string;
  sourceTitle?: string;
  sourceContent?: string;
}

const MapPage = () => {
  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetail | null>(null);
  const [showPlaceDetail, setShowPlaceDetail] = useState(false);

  // StampContext에서 데이터 가져오기
  const { stampData, isLoading: stampLoading, error: stampError } = useStamp();

  // 모든 장소를 하나의 배열로 변환
  const allPlaces: PlaceDetail[] = stampData.bookmarks.map((bookmark) => ({
    id: bookmark.id,
    name: bookmark.placeName,
    lat: bookmark.latitude,
    lng: bookmark.longitude,
    isVisited: bookmark.visited,
    address: bookmark.address,
    sourceTitle: bookmark.post?.title,
    sourceContent: bookmark.post?.title
      ? `${bookmark.post.title}에서 가져온 장소입니다.`
      : undefined,
  }));

  const handlePlaceClick = (place: PlaceDetail) => {
    setSelectedPlace(place);
    setShowPlaceDetail(true);
  };

  const handleClosePlaceDetail = () => {
    setShowPlaceDetail(false);
    setSelectedPlace(null);
  };

  const loadKakaoMapSDK = () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).kakao && (window as any).kakao.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('카카오맵 SDK 로드 실패'));
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
              handlePlaceClick(place);
            });
          });

          console.log('마커 추가 완료');
          setSdkLoaded(true);
        });
      } catch (err) {
        setError('지도를 초기화하는데 실패했습니다.');
        console.error('지도 초기화 오류:', err);
      }
    };

    initMap();
  }, [apiKey, allPlaces]);

  const handleKakaoMap = () => {
    // 카카오맵 앱으로 열기
    const url = `kakaomap://look?p=${37.5665},${126.978}`;
    window.open(url);
  };

  const handleNaverMap = () => {
    // 네이버맵 앱으로 열기
    const url = `nmap://place?lat=${37.5665}&lng=${126.978}&name=서울시청`;
    window.open(url);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            지도 로드 실패
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (stampLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">스탬프 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (stampError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            데이터 로드 실패
          </h1>
          <p className="text-gray-600 mb-4">{stampError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      {/* 지도 컨테이너 */}
      <div className="pt-[100px] px-4 pb-20">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div
            ref={mapRef}
            className="w-full h-[500px] relative"
            style={{ minHeight: '500px' }}
          >
            {!sdkLoaded && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">지도를 불러오는 중...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 지도 앱 연동 버튼들 */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleKakaoMap}
            className="w-full py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors"
          >
            카카오맵 앱에서 보기
          </button>
          <button
            onClick={handleNaverMap}
            className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            네이버맵 앱에서 보기
          </button>
        </div>

        {/* 장소 정보 */}
        {allPlaces.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              등록된 장소 ({allPlaces.length}개)
            </h3>
            <div className="space-y-2">
              {allPlaces.map((place) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handlePlaceClick(place)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        place.isVisited
                          ? 'bg-green-500'
                          : 'border-2 border-gray-400'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{place.name}</p>
                      {place.address && (
                        <p className="text-sm text-gray-600">{place.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {place.isVisited ? '방문 완료' : '미방문'}
                    </p>
                    {place.sourceTitle && (
                      <p className="text-xs text-blue-600">
                        {place.sourceTitle}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 장소 상세 모달 */}
      {showPlaceDetail && selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          isOpen={showPlaceDetail}
          onClose={handleClosePlaceDetail}
        />
      )}
    </div>
  );
};

export default MapPage;

import React, { useState, useEffect, useRef } from 'react';
import shareIcon from '../../assets/icons/share.svg';
import emptyMarkIcon from '../../assets/icons/empty_mark.svg';
import fillMarkIcon from '../../assets/icons/fill_mark.svg';

interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isVisited: boolean;
}

interface StampBook {
  id: string;
  name: string;
  color: string;
  places: Place[];
}

interface StampMapProps {
  stampBook: StampBook;
  onBack: () => void;
  onStampBookChange: (stampBookId: string) => void;
  availableStampBooks: StampBook[];
}

const StampMap: React.FC<StampMapProps> = ({
  stampBook,
  onBack,
  onStampBookChange,
  availableStampBooks,
}) => {
  const [showStampBookDropdown, setShowStampBookDropdown] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

  // 카카오맵 SDK 로드
  const loadKakaoMapSDK = () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).kakao) {
        resolve();
        return;
      }

      if (document.querySelector('script[src*="dapi.kakao.com"]')) {
        const checkLoaded = setInterval(() => {
          if ((window as any).kakao) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject(new Error('카카오맵 SDK 로드 실패'));
      };
      document.head.appendChild(script);
    });
  };

  // 지도 초기화
  useEffect(() => {
    if (!apiKey) {
      console.log('API 키가 없습니다:', apiKey);
      return;
    }

    const initMap = async () => {
      try {
        console.log('카카오맵 SDK 로드 시작');
        await loadKakaoMapSDK();
        console.log('카카오맵 SDK 로드 완료');

        const kakao = (window as any).kakao;
        if (!kakao) {
          console.error('카카오맵 SDK가 로드되지 않았습니다');
          return;
        }

        kakao.maps.load(() => {
          console.log('카카오맵 maps.load 콜백 실행');
          const container = mapRef.current;
          if (!container) {
            console.error('컨테이너가 없습니다');
            return;
          }

          // 지도 생성
          const options = {
            center: new kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
          };

          console.log('지도 생성 시작');
          mapInstance.current = new kakao.maps.Map(container, options);
          console.log('지도 생성 완료');

          // 기존 마커들 제거
          markersRef.current.forEach((marker) => {
            if (marker.setMap) {
              marker.setMap(null);
            }
          });
          markersRef.current = [];

          // 새로운 마커들 추가
          stampBook.places.forEach((place) => {
            const position = new kakao.maps.LatLng(place.lat, place.lng);

            // 방문 상태에 따라 다른 아이콘 사용
            const iconSrc = place.isVisited ? fillMarkIcon : emptyMarkIcon;
            const markerImage = new kakao.maps.MarkerImage(
              iconSrc,
              new kakao.maps.Size(16, 16)
            );

            const marker = new kakao.maps.Marker({
              position: position,
              map: mapInstance.current,
              image: markerImage,
            });

            markersRef.current.push(marker);

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

            const placeNameOverlay = new kakao.maps.CustomOverlay({
              position: position,
              content: placeNameElement,
              map: mapInstance.current,
              yAnchor: 0,
            });

            markersRef.current.push(placeNameOverlay);

            // 마커 클릭 이벤트
            kakao.maps.event.addListener(marker, 'click', function () {
              console.log(`${place.name} 마커 클릭됨`);
            });
          });

          console.log('마커 추가 완료');
          setSdkLoaded(true);
        });
      } catch (error) {
        console.error('지도 초기화 에러:', error);
      }
    };

    // mapRef가 준비될 때까지 대기
    const checkMapRef = setInterval(() => {
      if (mapRef.current) {
        clearInterval(checkMapRef);
        initMap();
      }
    }, 100);

    // 5초 후 타임아웃
    setTimeout(() => {
      clearInterval(checkMapRef);
      if (!mapRef.current) {
        console.error('mapRef가 5초 후에도 준비되지 않았습니다');
      }
    }, 5000);
  }, [apiKey, stampBook]);

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/stampbook/${stampBook.id}`;
      await navigator.clipboard.writeText(shareUrl);
      console.log('공유 링크가 복사되었습니다:', shareUrl);
    } catch (error) {
      console.error('링크 복사 실패:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col">
      {/* 헤더 */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex-1 flex justify-center">
          {/* 스탬프명 상자 */}
          <div
            className="relative px-6 py-2 rounded-2xl border-2 flex items-center space-x-2"
            style={{
              borderColor: stampBook.color,
              backgroundColor: 'white',
            }}
          >
            <span
              className="text-lg font-semibold"
              style={{ color: stampBook.color }}
            >
              {stampBook.name}
            </span>
            <button
              onClick={() => setShowStampBookDropdown(!showStampBookDropdown)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: stampBook.color }}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-10"></div> {/* 균형을 위한 빈 공간 */}
      </div>

      {/* 드롭다운 메뉴 */}
      {showStampBookDropdown && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 min-w-64 max-h-60 overflow-y-auto">
          {availableStampBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => {
                onStampBookChange(book.id);
                setShowStampBookDropdown(false);
              }}
              className={`px-6 py-1 cursor-pointer hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                book.id === stampBook.id ? 'bg-gray-50' : ''
              }`}
            >
              <div
                className="flex items-center justify-between px-4 py-2 rounded-xl border-2"
                style={{
                  borderColor: book.color,
                  backgroundColor:
                    book.id === stampBook.id ? `${book.color}20` : 'white',
                }}
              >
                <span className="font-semibold" style={{ color: book.color }}>
                  {book.name}
                </span>
                {book.id === stampBook.id && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: book.color }}
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 지도 영역 */}
      <div className="flex-1 relative">
        {/* 지도 컨테이너를 항상 렌더링 */}
        <div ref={mapRef} className="w-full h-full" />

        {/* 로딩 오버레이 */}
        {!sdkLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">지도 로딩 중...</p>
            </div>
          </div>
        )}
      </div>

      {/* 하단 공유 바 */}
      <div
        className="h-20 bg-white border-t border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleShare}
      >
        <div className="flex items-center space-x-2">
          <img src={shareIcon} alt="Share" className="w-6 h-6" />
          <span className="font-medium">공유하기</span>
        </div>
      </div>
    </div>
  );
};

export default StampMap;

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Header from '../../components/layout/Header';
import Navigation from '../../components/layout/Navigation';
import emptyMarkIcon from '../../assets/icons/empty_mark.svg';
import fillMarkIcon from '../../assets/icons/fill_mark.svg';
import { useStamp } from '../../store/StampContext';
import PlaceDetailModal from '../../components/map/PlaceDetailModal';
import type { SearchResult } from '../../types/search';

interface PlaceDetail {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isVisited: boolean;
  address?: string;
  sourceTitle?: string;
  sourceContent?: string;
  isBookmarked?: boolean; // 추가된 속성
  currentStampBoards?: string[]; // 현재 들어가있는 스탬프북 ID 목록
}

const MapPage = () => {
  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetail | null>(null);
  const [showPlaceDetail, setShowPlaceDetail] = useState(false);
  const [searchMarker, setSearchMarker] = useState<any>(null);
  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const markersRef = useRef<any[]>([]);
  const mapInitializedRef = useRef(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // StampContext에서 데이터 가져오기
  const { stampData, isLoading: stampLoading, error: stampError } = useStamp();

  // 컴포넌트 마운트 시 로그
  useEffect(() => {
    console.log('MapPage 컴포넌트 마운트:', {
      apiKey: !!apiKey,
      stampDataLength: stampData?.bookmarks?.length || 0,
      stampLoading,
      stampError: !!stampError,
      isLoggedIn: !!stampData, // stampData가 있으면 로그인된 것으로 간주
    });
  }, [stampData, stampLoading, stampError]);

  // 모든 장소를 하나의 배열로 변환
  const allPlaces: PlaceDetail[] = (stampData?.bookmarks || []).map(
    (bookmark) => ({
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
      isBookmarked: true, // 북마크된 장소는 북마크 상태를 true로 설정
      currentStampBoards: [], // TODO: 실제 스탬프북 정보를 가져와서 설정
    })
  );

  // allPlaces 변경 시 로그
  useEffect(() => {
    console.log('allPlaces 변경됨:', {
      length: allPlaces.length,
      places: allPlaces.map((p) => ({ name: p.name, lat: p.lat, lng: p.lng })),
      stampDataBookmarks: stampData.bookmarks.length,
      stampDataStampBoards: stampData.stampBoards.length,
    });
  }, [allPlaces, stampData.bookmarks.length, stampData.stampBoards.length]);

  const handlePlaceClick = useCallback((place: PlaceDetail) => {
    setSelectedPlace(place);
    setShowPlaceDetail(true);
  }, []);

  const handleClosePlaceDetail = useCallback(() => {
    setShowPlaceDetail(false);
    setSelectedPlace(null);
  }, []);

  // 검색된 장소 처리
  const handleSearchPlaceSelect = useCallback(
    (searchResult: SearchResult) => {
      // 기존 검색 마커 제거
      if (searchMarker) {
        searchMarker.setMap(null);
      }

      // 새로운 검색 마커 생성
      if (kakaoMap) {
        const kakao = (window as any).kakao;
        const position = new kakao.maps.LatLng(
          searchResult.lat,
          searchResult.lng
        );

        // 검색된 장소를 표시하는 특별한 마커 생성
        const newSearchMarker = new kakao.maps.Marker({
          position: position,
          map: kakaoMap,
          image: new kakao.maps.MarkerImage(
            'data:image/svg+xml;base64,' +
              btoa(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#FF6B6B" stroke="#FF0000" stroke-width="2"/>
                <circle cx="12" cy="12" r="4" fill="white"/>
              </svg>
            `),
            new kakao.maps.Size(24, 24)
          ),
        });

        setSearchMarker(newSearchMarker);

        // 지도 중심을 검색된 장소로 이동
        kakaoMap.setCenter(position);
        kakaoMap.setLevel(3);

        // 검색된 장소 클릭 시 상세정보 모달 표시
        const searchPlaceDetail: PlaceDetail = {
          id: searchResult.id,
          name: searchResult.name,
          lat: searchResult.lat,
          lng: searchResult.lng,
          isVisited: false,
          address: searchResult.address,
          sourceTitle: '검색된 장소',
          sourceContent: `카카오맵에서 검색된 장소입니다.\n카테고리: ${searchResult.category}\n전화번호: ${searchResult.phone || '정보 없음'}`,
          isBookmarked: false, // 검색된 장소는 아직 북마크되지 않음
        };

        setSelectedPlace(searchPlaceDetail);
        setShowPlaceDetail(true);

        // 검색 마커에 클릭 이벤트 추가
        kakao.maps.event.addListener(newSearchMarker, 'click', function () {
          console.log('검색 마커 클릭됨:', searchPlaceDetail.name);
          setSelectedPlace(searchPlaceDetail);
          setShowPlaceDetail(true);
        });
      }
    },
    [searchMarker, kakaoMap]
  );

  // 북마크 저장 처리
  const handleBookmarkSave = useCallback(
    async (place: PlaceDetail) => {
      try {
        console.log('북마크 저장 시작:', place.name);

        // API 호출하여 북마크 저장
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            placeName: place.name,
            address: place.address || '',
            latitude: place.lat,
            longitude: place.lng,
          }),
        });

        if (response.ok) {
          console.log('북마크 저장 성공');

          // 북마크 상태 업데이트
          setSelectedPlace((prev) =>
            prev ? { ...prev, isBookmarked: true } : null
          );

          // 검색 마커를 일반 마커로 변경
          if (searchMarker) {
            searchMarker.setMap(null);
            setSearchMarker(null);
          }

          // 스탬프 데이터 새로고침
          // useStamp 훅의 refreshStampData 함수가 있다면 사용
          // 여기서는 간단히 상태만 업데이트

          // 성공 메시지 표시 (선택사항)
          alert('북마크에 저장되었습니다!');
        } else {
          console.error('북마크 저장 실패:', response.status);
          alert('북마크 저장에 실패했습니다.');
        }
      } catch (error) {
        console.error('북마크 저장 오류:', error);
        alert('북마크 저장 중 오류가 발생했습니다.');
      }
    },
    [searchMarker]
  );

  // 북마크 토글 처리 (제거)
  const handleBookmarkToggle = useCallback(async (place: PlaceDetail) => {
    try {
      console.log('북마크 제거 시작:', place.name);

      // API 호출하여 북마크 제거
      const response = await fetch(`/api/bookmarks/${place.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('북마크 제거 성공');

        // 북마크 상태 업데이트
        setSelectedPlace((prev) =>
          prev ? { ...prev, isBookmarked: false } : null
        );

        // 성공 메시지 표시
        alert('북마크가 제거되었습니다!');
      } else {
        console.error('북마크 제거 실패:', response.status);
        alert('북마크 제거에 실패했습니다.');
      }
    } catch (error) {
      console.error('북마크 제거 오류:', error);
      alert('북마크 제거 중 오류가 발생했습니다.');
    }
  }, []);

  // 방문 상태 토글 처리
  const handleVisitToggle = useCallback(async (place: PlaceDetail) => {
    try {
      console.log('방문 상태 토글 시작:', place.name, '현재:', place.isVisited);

      // API 호출하여 방문 상태 업데이트
      const response = await fetch(`/api/bookmarks/${place.id}/visit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visited: !place.isVisited,
        }),
      });

      if (response.ok) {
        console.log('방문 상태 토글 성공');

        // 방문 상태 업데이트
        setSelectedPlace((prev) =>
          prev ? { ...prev, isVisited: !prev.isVisited } : null
        );

        // 성공 메시지 표시
        alert(
          `방문 상태가 ${!place.isVisited ? '완료' : '미방문'}로 변경되었습니다!`
        );
      } else {
        console.error('방문 상태 토글 실패:', response.status);
        alert('방문 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('방문 상태 토글 오류:', error);
      alert('방문 상태 변경 중 오류가 발생했습니다.');
    }
  }, []);

  // 스탬프북에 장소 추가 처리
  const handleAddToStampBoard = useCallback(
    async (place: PlaceDetail, stampBoardId: string) => {
      try {
        console.log(
          '스탬프북에 장소 추가 시작:',
          place.name,
          '스탬프북 ID:',
          stampBoardId
        );

        // API 호출하여 스탬프북에 장소 추가
        const response = await fetch(
          `/api/stampboards/${stampBoardId}/bookmarks`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              placeName: place.name,
              address: place.address || '',
              latitude: place.lat,
              longitude: place.lng,
            }),
          }
        );

        if (response.ok) {
          console.log('스탬프북에 장소 추가 성공');

          // 성공 메시지 표시
          alert('선택한 스탬프북에 장소가 추가되었습니다!');

          // 모달 닫기
          setShowPlaceDetail(false);
          setSelectedPlace(null);
        } else {
          console.error('스탬프북에 장소 추가 실패:', response.status);
          alert('스탬프북에 장소 추가에 실패했습니다.');
        }
      } catch (error) {
        console.error('스탬프북에 장소 추가 오류:', error);
        alert('스탬프북에 장소 추가 중 오류가 발생했습니다.');
      }
    },
    []
  );

  // 스탬프북에서 장소 제거 처리
  const handleRemoveFromStampBoard = useCallback(
    async (place: PlaceDetail, stampBoardId: string) => {
      try {
        console.log(
          '스탬프북에서 장소 제거 시작:',
          place.name,
          '스탬프북 ID:',
          stampBoardId
        );

        // API 호출하여 스탬프북에서 장소 제거
        const response = await fetch(
          `/api/stampboards/${stampBoardId}/bookmarks/${place.id}`,
          {
            method: 'DELETE',
          }
        );

        if (response.ok) {
          console.log('스탬프북에서 장소 제거 성공');

          // 성공 메시지 표시
          alert('선택한 스탬프북에서 장소가 제거되었습니다!');

          // 모달 닫기
          setShowPlaceDetail(false);
          setSelectedPlace(null);
        } else {
          console.error('스탬프북에서 장소 제거 실패:', response.status);
          alert('스탬프북에서 장소 제거에 실패했습니다.');
        }
      } catch (error) {
        console.error('스탬프북에서 장소 제거 오류:', error);
        alert('스탬프북에서 장소 제거 중 오류가 발생했습니다.');
      }
    },
    []
  );

  const loadKakaoMapSDK = () => {
    return new Promise<void>((resolve, reject) => {
      // 이미 로드된 경우
      if ((window as any).kakao && (window as any).kakao.maps) {
        resolve();
        return;
      }

      // 로딩 중인 경우
      if ((window as any).kakaoMapLoading) {
        const checkLoaded = () => {
          if ((window as any).kakao && (window as any).kakao.maps) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      // 로딩 시작
      (window as any).kakaoMapLoading = true;

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
      script.onload = () => {
        (window as any).kakaoMapLoading = false;
        resolve();
      };
      script.onerror = () => {
        (window as any).kakaoMapLoading = false;
        reject(new Error('카카오맵 SDK 로드 실패'));
      };
      document.head.appendChild(script);
    });
  };

  // 마커 생성 함수
  const createMarkers = useCallback(
    (map: any, places: PlaceDetail[]) => {
      console.log('createMarkers 함수 실행:', {
        map: !!map,
        placesLength: places.length,
      });

      // 기존 마커들 제거
      console.log('기존 마커 제거 시작, 개수:', markersRef.current.length);
      markersRef.current.forEach((marker) => {
        if (marker.marker) marker.marker.setMap(null);
        if (marker.overlay) marker.overlay.setMap(null);
      });
      markersRef.current = [];
      console.log('기존 마커 제거 완료');

      if (!map) {
        console.log('지도 객체가 없어서 마커 생성 중단');
        return;
      }

      const kakao = (window as any).kakao;
      if (!kakao || !kakao.maps) {
        console.log('카카오맵 SDK가 로드되지 않음');
        return;
      }

      console.log('새 마커 생성 시작');
      // 모든 장소에 마커 추가
      places.forEach((place, index) => {
        console.log(`마커 ${index + 1} 생성:`, place.name);

        const position = new kakao.maps.LatLng(place.lat, place.lng);

        // 방문 상태에 따라 다른 아이콘 사용
        const iconSrc = place.isVisited ? fillMarkIcon : emptyMarkIcon;
        const markerImage = new kakao.maps.MarkerImage(
          iconSrc,
          new kakao.maps.Size(16, 16)
        );

        const kakaoMarker = new kakao.maps.Marker({
          position: position,
          map: map,
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

        const overlay = new kakao.maps.CustomOverlay({
          position: position,
          content: placeNameElement,
          map: map,
          yAnchor: 0,
        });

        // 마커 클릭 이벤트
        kakao.maps.event.addListener(kakaoMarker, 'click', function () {
          handlePlaceClick(place);
        });

        // 마커와 오버레이를 배열에 저장
        markersRef.current.push({
          marker: kakaoMarker,
          overlay: overlay,
        });
      });

      console.log('마커 추가 완료, 총 개수:', markersRef.current.length);
    },
    [handlePlaceClick]
  );

  // 지도 초기화
  useEffect(() => {
    console.log('지도 초기화 useEffect 실행:', {
      apiKey: !!apiKey,
      isInitializing,
      mapInitializedRef: mapInitializedRef.current,
      allPlacesLength: allPlaces.length,
      stampLoading,
    });

    if (!apiKey) {
      console.log('API 키가 없음');
      return;
    }

    if (isInitializing) {
      console.log('이미 초기화 중');
      return;
    }

    // 로딩 중이어도 지도는 초기화 (데이터는 나중에 추가)
    const initMap = async () => {
      try {
        console.log('지도 초기화 시작');
        setIsInitializing(true);
        setError(null);

        await loadKakaoMapSDK();
        console.log('SDK 로드 완료');

        if (!mapRef.current) {
          console.log('mapRef가 없음');
          setIsInitializing(false);
          return;
        }

        const kakao = (window as any).kakao;
        console.log('카카오 객체 확인:', !!kakao, !!kakao.maps);

        // kakao.maps.load() 콜백 사용
        kakao.maps.load(() => {
          console.log('kakao.maps.load 콜백 실행');

          const container = mapRef.current;
          if (!container) {
            console.log('컨테이너가 없음');
            setIsInitializing(false);
            return;
          }

          // 지도 생성
          const options = {
            center: new kakao.maps.LatLng(37.5519, 126.9254), // 홍익대학교
            level: 3,
          };

          console.log('지도 생성 시작');
          const newKakaoMap = new kakao.maps.Map(container, options);
          console.log('지도 생성 완료');

          setKakaoMap(newKakaoMap);
          mapInitializedRef.current = true;

          // 데이터가 있을 때 마커 생성, 없어도 지도는 표시
          if (allPlaces.length > 0) {
            console.log('초기 마커 생성 시작, allPlaces:', allPlaces.length);
            createMarkers(newKakaoMap, allPlaces);
          } else {
            console.log('데이터가 없어서 마커 생성 생략, 지도만 표시');
          }

          setSdkLoaded(true);
          setIsInitializing(false);
          console.log('지도 초기화 완료');
        });
      } catch (err) {
        console.error('지도 초기화 오류:', err);
        setError('지도를 초기화하는데 실패했습니다.');
        setIsInitializing(false);
      }
    };

    initMap();
  }, [apiKey, createMarkers, isInitializing]); // stampLoading 의존성 제거

  // allPlaces가 변경될 때만 마커 업데이트 (지도가 이미 초기화된 경우)
  useEffect(() => {
    console.log('allPlaces 변경 useEffect 실행:', {
      kakaoMap: !!kakaoMap,
      mapInitializedRef: mapInitializedRef.current,
      allPlacesLength: allPlaces.length,
    });

    if (kakaoMap && mapInitializedRef.current && allPlaces.length > 0) {
      console.log('마커 업데이트 실행');
      createMarkers(kakaoMap, allPlaces);
    }
  }, [allPlaces, createMarkers, kakaoMap]);

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

  // 로딩 중이어도 기본 맵은 표시 (데이터는 비동기로 로드)
  if (stampLoading) {
    console.log('StampContext 로딩 중, 기본 맵 표시');
  }

  if (stampError) {
    console.error('StampContext 에러 발생:', stampError);
    // 에러가 발생해도 맵은 계속 표시
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={true} onPlaceSelect={handleSearchPlaceSelect} />
      <Navigation />

      {/* 지도 컨테이너 */}
      <div className="pt-[100px] pb-20">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div
            ref={mapRef}
            className="w-full h-[500px] relative"
            style={{ minHeight: '500px' }}
          >
            {(!sdkLoaded || isInitializing) && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">
                    {isInitializing
                      ? '지도를 초기화하는 중...'
                      : '지도를 불러오는 중...'}
                  </p>
                </div>
              </div>
            )}

            {/* StampContext 로딩 상태 표시 */}
            {stampLoading && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                데이터 로딩 중...
              </div>
            )}

            {/* StampContext 에러 상태 표시 */}
            {stampError && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs">
                데이터 로드 실패
              </div>
            )}
          </div>
        </div>

        {/* 지도 앱 연동 버튼들 */}
        <div className="mt-4 px-4 space-y-2">
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
          <div className="mt-6 mx-4 bg-white rounded-lg shadow-sm p-4">
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
          onBookmarkSave={handleBookmarkSave}
          onBookmarkToggle={handleBookmarkToggle}
          onVisitToggle={handleVisitToggle}
          onAddToStampBoard={handleAddToStampBoard}
          onRemoveFromStampBoard={handleRemoveFromStampBoard}
          stampBoards={stampData.stampBoards}
        />
      )}
    </div>
  );
};

export default MapPage;

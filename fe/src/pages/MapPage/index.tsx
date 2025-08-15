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
  const {
    stampData,
    isLoading: stampLoading,
    error: stampError,
    getStampBoardsForPlace,
    refreshStampData,
  } = useStamp();

  // 컴포넌트 마운트 시 로그
  useEffect(() => {
    console.log('MapPage 컴포넌트 마운트:', {
      apiKey: !!apiKey,
      stampDataLength: stampData?.bookmarks?.length || 0,
      stampLoading,
      stampError: !!stampError,
    });
  }, []);

  // 모든 장소를 하나의 배열로 변환 (로컬 상태로 관리)
  const [localPlaces, setLocalPlaces] = useState<PlaceDetail[]>([]);

  // stampData가 변경될 때만 localPlaces 업데이트
  useEffect(() => {
    const newPlaces: PlaceDetail[] = stampData.bookmarks.map((bookmark) => {
      // 해당 장소가 어떤 스탬프북에 포함되어 있는지 확인
      const currentStampBoards = getStampBoardsForPlace(
        bookmark.title,
        bookmark.latitude,
        bookmark.longitude
      );

      return {
        id: bookmark.postId.toString(),
        name: bookmark.title,
        lat: bookmark.latitude,
        lng: bookmark.longitude,
        isVisited: bookmark.visited,
        address: bookmark.address,
        sourceTitle: undefined,
        sourceContent: undefined,
        isBookmarked: true, // 북마크된 장소는 북마크 상태를 true로 설정
        currentStampBoards, // 실제 스탬프북 정보 설정
      };
    });
    setLocalPlaces(newPlaces);
  }, [stampData.bookmarks, getStampBoardsForPlace]);

  // allPlaces는 localPlaces를 참조
  const allPlaces = localPlaces;

  // allPlaces 변경 시 로그
  useEffect(() => {
    console.log('allPlaces 변경됨:', allPlaces.length);
    // 각 장소의 스탬프북 정보 로깅
    allPlaces.forEach((place) => {
      if (place.currentStampBoards && place.currentStampBoards.length > 0) {
        console.log(
          `장소 "${place.name}"이 포함된 스탬프북:`,
          place.currentStampBoards
        );
      }
    });
  }, [allPlaces]);

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

      // 로그인 방식에 따라 API 선택
      const isTestLogin = localStorage.getItem('isTestLogin') === 'true';

      if (isTestLogin) {
        // 테스트 로그인인 경우 fakeApi 사용
        const { fakeApi } = await import('../../utils/fakeApi');
        fakeApi.setTestMode(true);

        // fakeApi에서 북마크 방문 상태 업데이트
        await fakeApi.updateBookmarkVisitStatus(parseInt(place.id), !place.isVisited);
        console.log('테스트 로그인: fakeApi로 방문 상태 토글');
      } else {
        // 실제 구글 로그인인 경우 백엔드 API 사용
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/bookmarks/${place.id}/visit`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
              visited: !place.isVisited,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        console.log('구글 로그인: 백엔드 API로 방문 상태 토글');
      }

      // 방문 상태 업데이트 (로컬 상태만 업데이트)
      setSelectedPlace((prev) =>
        prev ? { ...prev, isVisited: !prev.isVisited } : null
      );

      // 로컬 상태 업데이트로 맵 재초기화 방지
      setLocalPlaces((prevPlaces) =>
        prevPlaces.map((p) =>
          p.id === place.id ? { ...p, isVisited: !p.isVisited } : p
        )
      );

      // 마커 아이콘만 업데이트 (맵 재초기화 방지)
      updateMarkerIcon(place.id, !place.isVisited);

      // 성공 메시지 제거 (사용자 경험 개선)
    } catch (error) {
      console.error('방문 상태 토글 오류:', error);
      alert('방문 상태 변경 중 오류가 발생했습니다.');
    }
  }, [refreshStampData]);

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

        // 로그인 방식에 따라 API 선택
        const isTestLogin = localStorage.getItem('isTestLogin') === 'true';

        if (isTestLogin) {
          // 테스트 로그인인 경우 fakeApi 사용
          const { fakeApi } = await import('../../utils/fakeApi');
          fakeApi.setTestMode(true);

          // fakeApi에서 스탬프보드에 북마크 추가
          await fakeApi.addBookmarkToStampBoard(
            parseInt(stampBoardId),
            parseInt(place.id)
          );
          console.log('테스트 로그인: fakeApi로 스탬프보드에 장소 추가');
        } else {
          // 실제 구글 로그인인 경우 백엔드 API 사용
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/stampboards/${stampBoardId}/bookmark`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
              body: JSON.stringify(parseInt(place.id)),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          console.log('구글 로그인: 백엔드 API로 스탬프보드에 장소 추가');
        }

        // 성공 메시지 제거 (사용자 경험 개선)

        // 스탬프 데이터 새로고침
        refreshStampData();

        // 모달 닫기
        setShowPlaceDetail(false);
        setSelectedPlace(null);
      } catch (error) {
        console.error('스탬프북에 장소 추가 오류:', error);
        alert('스탬프북에 장소 추가 중 오류가 발생했습니다.');
      }
    },
    [refreshStampData]
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

        // 로그인 방식에 따라 API 선택
        const isTestLogin = localStorage.getItem('isTestLogin') === 'true';

        if (isTestLogin) {
          // 테스트 로그인인 경우 fakeApi 사용
          const { fakeApi } = await import('../../utils/fakeApi');
          fakeApi.setTestMode(true);

          // fakeApi에서 스탬프보드에서 북마크 제거
          await fakeApi.removeBookmarkFromStampBoard(
            parseInt(stampBoardId),
            parseInt(place.id)
          );
          console.log('테스트 로그인: fakeApi로 스탬프보드에서 장소 제거');
        } else {
          // 실제 구글 로그인인 경우 백엔드 API 사용
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/stampboards/${stampBoardId}/bookmark`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
              body: JSON.stringify(parseInt(place.id)),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          console.log('구글 로그인: 백엔드 API로 스탬프보드에서 장소 제거');
        }

        // 성공 메시지 제거 (사용자 경험 개선)

        // 스탬프 데이터 새로고침
        refreshStampData();

        // 모달 닫기
        setShowPlaceDetail(false);
        setSelectedPlace(null);
      } catch (error) {
        console.error('스탬프북에서 장소 제거 오류:', error);
        alert('스탬프북에서 장소 제거 중 오류가 발생했습니다.');
      }
    },
    [refreshStampData]
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
    });

    if (!apiKey) {
      console.log('API 키가 없음');
      return;
    }

    if (isInitializing) {
      console.log('이미 초기화 중');
      return;
    }

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
            center: new kakao.maps.LatLng(37.5519, 126.9255), // 홍익대학교
            level: 5, // 범위를 넓혀서 더 넓은 지역을 보여줌
          };

          console.log('지도 생성 시작');
          const newKakaoMap = new kakao.maps.Map(container, options);
          console.log('지도 생성 완료');

          setKakaoMap(newKakaoMap);
          mapInitializedRef.current = true;

          // 초기 마커 생성
          console.log('초기 마커 생성 시작, allPlaces:', allPlaces.length);
          createMarkers(newKakaoMap, allPlaces);
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
  }, [apiKey, createMarkers, isInitializing, allPlaces.length]);

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

  // 방문 상태 변경 시 마커 아이콘만 업데이트 (맵 재초기화 방지)
  const updateMarkerIcon = useCallback((placeId: string, isVisited: boolean) => {
    if (!kakaoMap) return;

    // 해당 장소의 마커 찾기
    const markerData = markersRef.current.find((markerData, index) => {
      const place = allPlaces[index];
      return place && place.id === placeId;
    });

    if (markerData && markerData.marker) {
      const kakao = (window as any).kakao;
      const iconSrc = isVisited ? fillMarkIcon : emptyMarkIcon;
      const markerImage = new kakao.maps.MarkerImage(
        iconSrc,
        new kakao.maps.Size(16, 16)
      );
      
      markerData.marker.setImage(markerImage);
    }
  }, [kakaoMap, allPlaces]);

  const handleKakaoMap = () => {
    if (selectedPlace) {
      // 카카오맵 앱으로 열기
      const url = `https://map.kakao.com/link/map/${selectedPlace.name},${selectedPlace.lat},${selectedPlace.lng}`;
      window.open(url, '_blank');
    }
  };

  const handleNaverMap = () => {
    if (selectedPlace) {
      // 네이버맵 앱으로 열기
      const url = `https://map.naver.com/p/search/${selectedPlace.name}`;
      window.open(url, '_blank');
    }
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
          </div>
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
          onKakaoMap={handleKakaoMap}
          onNaverMap={handleNaverMap}
          onBookmarkSave={handleBookmarkSave}
          onBookmarkToggle={handleBookmarkToggle}
          onVisitToggle={handleVisitToggle}
          onAddToStampBoard={handleAddToStampBoard}
          onRemoveFromStampBoard={handleRemoveFromStampBoard}
          stampBoards={stampData.stampBoards.map((board) => ({
            id: board.id.toString(), // number를 string으로 변환
            title: board.title,
            color: board.color,
            bookmarks: board.bookmarks || [], // 북마크 정보 추가
          }))}
        />
      )}
    </div>
  );
};

export default MapPage;

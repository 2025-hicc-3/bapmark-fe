import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderWithoutSearch from '../../components/layout/HeaderWithoutSearch';
import Navigation from '../../components/layout/Navigation';
import saveIcon from '../../assets/icons/save.svg';
import saveFillIcon from '../../assets/icons/save_fill.svg';
import type { Post } from '../../types/api';

const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

  // 임시 게시물 데이터 (API 명세서에 맞게 수정)
  const mockPost: Post = {
    id: id || '1',
    title: '카미야가 어쩌구저쩌구',
    content: '내용은 이렇고 저렇고. 정말 맛있는 곳이에요. 꼭 가보세요!',
    address: '카미야',
    latitude: 37.5665,
    longitude: 126.978,
    user: {
      id: '1',
      email: 'user1@example.com',
    },
  };

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
  const initMap = async () => {
    if (!post || !mapRef.current) return;

    try {
      await loadKakaoMapSDK();

      const kakao = (window as any).kakao;
      if (!kakao) {
        console.error('카카오맵 SDK가 로드되지 않았습니다');
        return;
      }

      kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;

        // 지도 생성
        const options = {
          center: new kakao.maps.LatLng(post.latitude, post.longitude),
          level: 3,
        };

        mapInstance.current = new kakao.maps.Map(container, options);

        // 마커 생성
        const position = new kakao.maps.LatLng(post.latitude, post.longitude);
        markerRef.current = new kakao.maps.Marker({
          position: position,
          map: mapInstance.current,
        });

        // 마커에 장소명 표시
        const infowindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;">${post.address}</div>`,
        });
        infowindow.open(mapInstance.current, markerRef.current);

        setMapLoaded(true);
      });
    } catch (error) {
      console.error('지도 초기화 에러:', error);
    }
  };

  useEffect(() => {
    // TODO: 실제 API 호출로 대체
    // const fetchPost = async () => {
    //   try {
    //     const response = await fetch(`/api/posts/${id}`);
    //     const data = await response.json();
    //     setPost(data);
    //   } catch (error) {
    //     console.error('게시물 조회 실패:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchPost();

    // 임시로 mock 데이터 사용
    setPost(mockPost);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (post && !mapLoaded) {
      // 지도 컨테이너가 준비될 때까지 대기
      const timer = setTimeout(() => {
        initMap();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [post, mapLoaded]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    // TODO: 실제 북마크 API 호출
    // if (isSaved) {
    //   // 북마크 삭제
    //   await deleteBookmark(post.id);
    // } else {
    //   // 북마크 추가
    //   await addBookmark(post.id);
    // }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">게시물을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 헤더 (검색창 없음) */}
      <HeaderWithoutSearch />

      {/* 메인 콘텐츠 */}
      <main className="main-content-no-search flex-1 pt-15 pb-16">
        <div className="p-4 space-y-4">
          {/* 뒤로가기 버튼과 제목 */}
          <div className="flex items-center space-x-3">
            <button onClick={handleBackClick}>
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h1 className="text-xl font-semibold text-gray-900 flex-1">
              {post.title}
            </h1>

            <button onClick={handleSaveClick}>
              <img
                src={isSaved ? saveFillIcon : saveIcon}
                alt="저장"
                className="w-5 h-5"
              />
            </button>
          </div>

          {/* 작성자 정보 */}
          {post.user && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>작성자: {post.user.email}</span>
            </div>
          )}

          {/* 주소 정보 */}
          <div className="text-sm text-gray-700">
            <span className="font-medium">📍 위치:</span> {post.address}
          </div>

          {/* 위도/경도 정보 (개발용, 실제로는 지도에 표시) */}
          <div className="text-xs text-gray-500">
            <span>
              위도: {post.latitude}, 경도: {post.longitude}
            </span>
          </div>

          {/* 카카오맵 지도 */}
          <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200">
            <div
              ref={mapRef}
              className="w-full h-full"
              style={{ minHeight: '128px' }}
            />
            {!mapLoaded && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-xs text-gray-600">지도 로딩 중...</p>
                </div>
              </div>
            )}
          </div>

          {/* 게시물 내용 */}
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={() => {
                // TODO: 카카오맵으로 이동
                const url = `https://map.kakao.com/link/map/${post.title},${post.latitude},${post.longitude}`;
                window.open(url, '_blank');
              }}
              className="flex-1 bg-yellow-400 text-black h-12 rounded-2xl font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="currentColor"
                />
              </svg>
              카카오맵
            </button>

            <button
              onClick={() => {
                // TODO: 네이버 지도로 이동
                const url = `https://map.naver.com/p/search/${post.address}`;
                window.open(url, '_blank');
              }}
              className="flex-1 bg-green-500 text-white h-12 rounded-2xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="currentColor"
                />
              </svg>
              네이버 지도
            </button>
          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <Navigation />
    </div>
  );
};

export default BoardDetailPage;

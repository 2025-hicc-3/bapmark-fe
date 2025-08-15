import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderWithoutSearch from '../../components/layout/HeaderWithoutSearch';
import Navigation from '../../components/layout/Navigation';
import saveIcon from '../../assets/icons/save.svg';
import saveFillIcon from '../../assets/icons/save_fill.svg';
import { usePost } from '../../store/PostContext';

import type { Post } from '../../types/api';

const BoardDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts } = usePost(); // 이미 로드된 게시글 목록 사용
  const [isSaved, setIsSaved] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

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
    if (!id || !posts.length) return;

    // posts 배열에서 해당 게시글 찾기
    const postData = posts.find((p) => p.id === parseInt(id));

    if (postData) {
      setPost(postData);

      // 북마크 상태 초기화 (테스트 모드에서는 기본적으로 북마크된 상태로 표시)
      const isTestLogin = localStorage.getItem('isTestLogin') === 'true';
      if (isTestLogin) {
        setIsSaved(true); // 테스트 모드에서는 기본적으로 북마크된 상태
      } else {
        // 실제 로그인에서는 사용자의 북마크 상태를 확인해야 함
        // TODO: GET /users/me/bookmarks로 현재 게시글이 북마크되어 있는지 확인
        setIsSaved(false);
      }
    } else {
      // 게시글을 찾을 수 없는 경우
      setPost(null);
    }
  }, [id, posts]);

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

  const handleSaveClick = async () => {
    if (!post) return;

    try {
      // 테스트 로그인인지 확인
      const isTestLogin = localStorage.getItem('isTestLogin') === 'true';

      if (isTestLogin) {
        // 테스트 로그인인 경우 fakeApi 사용
        if (isSaved) {
          // 북마크 삭제 - 테스트 모드에서는 단순히 상태만 변경
          console.log('테스트 모드: 북마크 삭제');
        } else {
          // 북마크 추가 - 테스트 모드에서는 단순히 상태만 변경
          console.log('테스트 모드: 북마크 추가');
        }
      } else {
        // 실제 구글 로그인인 경우 실제 API 사용
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('토큰이 없습니다.');
          return;
        }

        if (isSaved) {
          // 북마크 삭제: DELETE /users/{postId}
          const baseURL =
            import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
          const response = await fetch(`${baseURL}/users/${post.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`북마크 삭제 실패: ${response.status}`);
          }
        } else {
          // 북마크 추가: POST /users/search
          const baseURL =
            import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
          const response = await fetch(
            `${baseURL}/users/search?placeName=${encodeURIComponent(post.title)}&address=${encodeURIComponent(post.address)}&latitude=${post.latitude}&longitude=${post.longitude}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`북마크 추가 실패: ${response.status}`);
          }
        }
      }

      // 성공 시 상태 변경
      setIsSaved(!isSaved);
      console.log(
        isSaved ? '북마크가 삭제되었습니다.' : '북마크가 추가되었습니다.'
      );
    } catch (error) {
      console.error('북마크 처리 오류:', error);
      alert(
        isSaved ? '북마크 삭제에 실패했습니다.' : '북마크 추가에 실패했습니다.'
      );
    }
  };

  // posts가 아직 로드되지 않은 경우
  if (!posts.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">게시글을 불러오는 중...</p>
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

          {/* 작성자 정보는 API 명세서에 포함되지 않음 */}

          {/* 주소 정보 */}
          <div className="text-sm text-gray-700">
            <span className="font-medium"></span> {post.address}
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

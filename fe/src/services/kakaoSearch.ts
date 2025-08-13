import type { KakaoSearchResponse, SearchResult } from '../types/search';

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export const searchPlaces = async (query: string): Promise<SearchResult[]> => {
  if (!KAKAO_REST_API_KEY) {
    throw new Error('카카오 REST API 키가 설정되지 않았습니다.');
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=15`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('검색 요청에 실패했습니다.');
    }

    const data: KakaoSearchResponse = await response.json();

    return data.documents.map((place) => ({
      id: place.id,
      name: place.place_name,
      address: place.address_name,
      roadAddress: place.road_address_name,
      category: place.category_name,
      phone: place.phone,
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
      placeUrl: place.place_url,
    }));
  } catch (error) {
    console.error('장소 검색 오류:', error);
    throw error;
  }
};

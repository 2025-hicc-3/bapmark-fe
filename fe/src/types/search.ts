// Kakao Map Search API types
export interface KakaoSearchPlace {
  id: string;
  place_name: string;
  place_url: string;
  category_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  x: string; // longitude
  y: string; // latitude
}

export interface KakaoSearchResponse {
  documents: KakaoSearchPlace[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

export interface SearchResult {
  id: string;
  name: string;
  address: string;
  roadAddress: string;
  category: string;
  phone: string;
  lat: number;
  lng: number;
  placeUrl: string;
}

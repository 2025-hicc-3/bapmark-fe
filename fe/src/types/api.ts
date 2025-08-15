// Post type based on API specification
export interface Post {
  id: number;
  title: string;
  content: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Bookmark type based on API specification
export interface Bookmark {
  postId: number;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  visited: boolean;
}

// StampBoard type based on API specification
export interface StampBoard {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  user: {
    id: number;
  };
  bookmarks?: Bookmark[];
}

// Create post request type
export interface CreatePostRequest {
  title: string;
  content: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Update post request type
export interface UpdatePostRequest {
  title?: string;
  content?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

// Create stampboard request type
export interface CreateStampBoardRequest {
  title: string;
  color: string;
}

// Update stampboard request type
export interface UpdateStampBoardRequest {
  title?: string;
  color?: string;
}

// Search posts request type
export interface SearchPostsRequest {
  keyword: string;
}

// Bookmark by search request type
export interface BookmarkBySearchRequest {
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
}

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

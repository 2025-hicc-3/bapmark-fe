// Post type based on API specification
export interface Post {
  id: string;
  title: string;
  content: string;
  address: string;
  latitude: number;
  longitude: number;
  user?: {
    id: string;
    email: string;
  };
}

// Bookmark type based on API specification
export interface Bookmark {
  id: string;
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  visited: boolean;
  createdAt: string;
  user: {
    id: string;
  };
  post?: {
    id: string;
    title: string;
  };
}

// StampBoard type based on API specification
export interface StampBoard {
  id: string;
  title: string;
  color: string;
  createdAt: string;
  user: {
    id: string;
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

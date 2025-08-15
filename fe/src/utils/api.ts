// API 클라이언트 유틸리티
// JWT 토큰을 자동으로 헤더에 포함하여 요청을 보내는 함수들

import type { User, LoginResponse, UpdateNicknameRequest } from '../types/auth';

import type {
  Post,
  Bookmark,
  StampBoard,
  CreatePostRequest,
  UpdatePostRequest,
  BookmarkBySearchRequest,
} from '../types/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    // 환경 변수에서 API URL을 가져오거나 기본값 사용
    this.baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || '/api';
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (response.status === 401) {
      // 토큰이 만료되었거나 유효하지 않음
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
      // 로그인 페이지로 리다이렉트하거나 로그인 모달을 열 수 있음
      window.location.href = '/';
      return { error: '인증이 필요합니다.' };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || `HTTP ${response.status} 오류` };
    }

    // Content-Type 확인하여 JSON인지 문자열인지 판단
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.json();
        return { data };
      } catch {
        return { error: 'JSON 응답을 파싱할 수 없습니다.' };
      }
    } else {
      // JSON이 아닌 경우 (문자열 등) 텍스트로 읽기
      try {
        const text = await response.text();
        return { data: text };
      } catch {
        return { error: '응답을 읽을 수 없습니다.' };
      }
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch {
      return { error: '네트워크 오류가 발생했습니다.' };
    }
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch {
      return { error: '네트워크 오류가 발생했습니다.' };
    }
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch {
      return { error: '네트워크 오류가 발생했습니다.' };
    }
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch {
      return { error: '네트워크 오류가 발생했습니다.' };
    }
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch {
      return { error: '네트워크 오류가 발생했습니다.' };
    }
  }
}

// 기본 API 클라이언트 인스턴스 - 환경 변수 사용
export const apiClient = new ApiClient();

// 인증 API 함수들
export const authAPI = {
  // Google 로그인
  googleLogin: (idToken: string) =>
    apiClient.post<LoginResponse>('/auth/google', { idToken }),

  // 테스트 로그인 (나중에 실제 API로 교체)
  testLogin: () => apiClient.post<LoginResponse>('/auth/test'),

  // 로그아웃
  logout: () => apiClient.post('/auth/logout'),
};

// 사용자 API 함수들
export const userAPI = {
  // 현재 사용자 정보 조회
  getMe: () => apiClient.get<User>('/user/me'),

  // ID로 사용자 프로필 조회
  getProfile: (userId: string) => apiClient.get<User>(`/user/${userId}`),

  // 사용자 프로필 업데이트
  updateProfile: (userId: string, data: Partial<User>) =>
    apiClient.put<User>(`/user/${userId}`, data),

  // 닉네임 업데이트
  updateNickname: (data: UpdateNicknameRequest) =>
    apiClient.patch<User>('/user/me', data),

  // 사용자 삭제
  deleteUser: (userId: string) => apiClient.delete(`/user/${userId}`),
};

// 게시물 API 함수들
export const postAPI = {
  // 모든 게시물 조회
  getAllPosts: () => apiClient.get<Post[]>('/posts/allPosts'),

  // 키워드로 게시물 검색
  searchPosts: (keyword: string) =>
    apiClient.get<Post[]>(
      `/posts/search?keyword=${encodeURIComponent(keyword)}`
    ),

  // 내 게시물 조회
  getMyPosts: () => apiClient.get<Post[]>('/posts/me'),

  // ID로 게시물 조회
  getPost: (postId: string) => apiClient.get<Post>(`/posts/${postId}`),

  // 새 게시물 생성
  createPost: (data: CreatePostRequest) =>
    apiClient.post<Post>('/posts/', data),

  // 게시물 수정
  updatePost: (postId: string, data: UpdatePostRequest) =>
    apiClient.put<Post>(`/posts/${postId}`, data),

  // 게시물 삭제
  deletePost: (postId: string) => apiClient.delete(`/posts/${postId}`),
};

// 북마크 API 함수들
export const bookmarkAPI = {
  // 내 북마크 조회
  getMyBookmarks: (visited?: boolean) => {
    const params = visited !== undefined ? `?visited=${visited}` : '';
    return apiClient.get<Bookmark[]>(`/users/me/bookmarks${params}`);
  },

  // 게시물 ID로 북마크 추가
  addBookmarkByPost: (postId: string) => apiClient.post(`/users/${postId}`),

  // 게시물 ID로 북마크 제거
  removeBookmarkByPost: (postId: string) =>
    apiClient.delete(`/users/${postId}`),

  // 검색으로 북마크 추가
  addBookmarkBySearch: (data: BookmarkBySearchRequest) =>
    apiClient.post('/users/search', data),

  // 북마크의 스탬프보드 조회
  getStampBoardsForBookmark: (bookmarkId: string) =>
    apiClient.get<StampBoard[]>(`/users/${bookmarkId}/stampboards`),
};

// 스탬프보드 API 함수들
export const stampBoardAPI = {
  // 새 스탬프보드 생성
  createStampBoard: (title: string, color: string) =>
    apiClient.post<StampBoard>(
      `/stampboards?title=${encodeURIComponent(title)}&color=${encodeURIComponent(color)}`
    ),

  // 스탬프보드 제목 업데이트
  updateStampBoardTitle: (boardId: string, title: string) =>
    apiClient.patch(
      `/stampboards/${boardId}/title?title=${encodeURIComponent(title)}`
    ),

  // 스탬프보드 색상 업데이트
  updateStampBoardColor: (boardId: string, color: string) =>
    apiClient.patch(
      `/stampboards/${boardId}/color?color=${encodeURIComponent(color)}`
    ),

  // 내 스탬프보드 조회
  getMyStampBoards: () => apiClient.get<StampBoard[]>('/stampboards/me/boards'),

  // ID로 스탬프보드 조회
  getStampBoard: (id: string) =>
    apiClient.get<StampBoard>(`/stampboards/${id}`),

  // 스탬프보드 삭제
  deleteStampBoard: (id: string) => apiClient.delete(`/stampboards/${id}`),

  // 스탬프보드에 북마크 추가
  addBookmarkToStampBoard: (boardId: string, bookmarkId: string) =>
    apiClient.post(`/stampboards/${boardId}/bookmark`, bookmarkId),

  // 스탬프보드에서 북마크 제거
  removeBookmarkFromStampBoard: (boardId: string) =>
    apiClient.delete(`/stampboards/${boardId}/bookmark`),
};

// 공유 링크 API 함수들
export const shareAPI = {
  // 스탬프보드 공유 링크 생성
  createShareLink: (stampBoardId: string) =>
    apiClient.post<string>(`/share/${stampBoardId}`),

  // 공유 링크로 스탬프보드 복사
  copyFromShareLink: (uuid: string) => apiClient.get<string>(`/share/${uuid}`),
};

// 테스트 API 함수들
export const testAPI = {
  // JWT 인증 테스트
  testJWT: () => apiClient.get<string>('/secure/test'),
};

export default apiClient;

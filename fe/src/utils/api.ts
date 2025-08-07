// API 클라이언트 유틸리티
// JWT 토큰을 자동으로 헤더에 포함하여 요청을 보내는 함수들

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
      // 로그인 페이지로 리다이렉트하거나 로그인 모달을 열 수 있음
      window.location.href = '/login';
      return { error: '인증이 필요합니다.' };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || `HTTP ${response.status} 오류` };
    }

    try {
      const data = await response.json();
      return { data };
    } catch {
      return { error: '응답을 파싱할 수 없습니다.' };
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

// 사용 예시를 위한 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  authorId: string;
  createdAt: string;
}

// API 함수들
export const authAPI = {
  // Google 로그인
  googleLogin: (idToken: string) =>
    apiClient.post<{ jwt: string }>('/auth/google', { idToken }),

  // 사용자 정보 조회
  getMe: () => apiClient.get<User>('/user/me'),

  // 로그아웃
  logout: () => apiClient.post('/auth/logout'),
};

export const userAPI = {
  // 사용자 프로필 조회
  getProfile: (userId: string) => apiClient.get<User>(`/user/${userId}`),

  // 사용자 프로필 업데이트
  updateProfile: (userId: string, data: Partial<User>) =>
    apiClient.put<User>(`/user/${userId}`, data),
};

export const postAPI = {
  // 게시물 목록 조회
  getPosts: (page = 1, limit = 10) =>
    apiClient.get<Post[]>(`/posts?page=${page}&limit=${limit}`),

  // 게시물 상세 조회
  getPost: (postId: string) => apiClient.get<Post>(`/posts/${postId}`),

  // 게시물 생성
  createPost: (data: Omit<Post, 'id' | 'authorId' | 'createdAt'>) =>
    apiClient.post<Post>('/posts', data),

  // 게시물 수정
  updatePost: (postId: string, data: Partial<Post>) =>
    apiClient.put<Post>(`/posts/${postId}`, data),

  // 게시물 삭제
  deletePost: (postId: string) => apiClient.delete(`/posts/${postId}`),
};

export default apiClient;

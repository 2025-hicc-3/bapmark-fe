// User type definition based on API specification
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  nickname?: string;
  createdAt: string;
}

// Login response type
export interface LoginResponse {
  accessToken: string;
  user: User;
}

// Google login request type
export interface GoogleLoginRequest {
  idToken: string;
}

// Update nickname request type
export interface UpdateNicknameRequest {
  nickname: string;
}

// API error response type
export interface ApiErrorResponse {
  error: string;
  message: string;
  status: number;
}

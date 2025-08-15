import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { fakeApi } from '../utils/fakeApi';
import { postAPI } from '../utils/api';
import type { Post, CreatePostRequest } from '../types/api';

interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  refreshPostData: () => Promise<void>;
  getPost: (postId: number) => Promise<Post | null>;
  createPost: (request: CreatePostRequest) => Promise<boolean>;
  updatePost: (postId: number, request: CreatePostRequest) => Promise<boolean>;
  deletePost: (postId: number) => Promise<boolean>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: React.ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  // 게시글 데이터 새로고침
  const refreshPostData = useCallback(async () => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    setError(null);

    try {
      let postData: Post[];

      if (import.meta.env.DEV) {
        // 개발 모드에서는 fakeApi 사용
        fakeApi.setTestMode(true); // 테스트 모드 활성화
        postData = await fakeApi.getAllPosts();
      } else {
        // 프로덕션 모드에서는 실제 API 사용
        const response = await postAPI.getAllPosts();
        postData = response.data || [];
      }

      setPosts(postData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '게시글을 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('게시글 데이터 로드 오류:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  // 게시글 생성
  const createPost = async (request: CreatePostRequest): Promise<boolean> => {
    if (!isLoggedIn) return false;

    try {
      let result: string;

      if (import.meta.env.DEV) {
        // 개발 모드에서는 fakeApi 사용
        fakeApi.setTestMode(true); // 테스트 모드 활성화
        result = await fakeApi.createPost(request);
      } else {
        // 프로덕션 모드에서는 실제 API 사용
        const response = await postAPI.createPost(request);
        result = response.data;
      }

      if (result.includes('완료')) {
        // 게시글 데이터 새로고침
        await refreshPostData();
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '게시글 생성에 실패했습니다.';
      setError(errorMessage);
      console.error('게시글 생성 오류:', err);
      return false;
    }
  };

  // 게시글 수정
  const updatePost = async (
    postId: number,
    request: CreatePostRequest
  ): Promise<boolean> => {
    if (!isLoggedIn) return false;

    try {
      let result: string;

      if (import.meta.env.DEV) {
        // 개발 모드에서는 fakeApi 사용
        fakeApi.setTestMode(true); // 테스트 모드 활성화
        result = await fakeApi.updatePost(postId, request);
      } else {
        // 프로덕션 모드에서는 실제 API 사용
        const response = await postAPI.updatePost(postId, request);
        result = response.data;
      }

      if (result.includes('완료')) {
        // 게시글 데이터 새로고침
        await refreshPostData();
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '게시글 수정에 실패했습니다.';
      setError(errorMessage);
      console.error('게시글 수정 오류:', err);
      return false;
    }
  };

  // 게시글 삭제
  const deletePost = async (postId: number): Promise<boolean> => {
    if (!isLoggedIn) return false;

    try {
      let result: string;

      if (import.meta.env.DEV) {
        // 개발 모드에서는 fakeApi 사용
        fakeApi.setTestMode(true); // 테스트 모드 활성화
        result = await fakeApi.deletePost(postId);
      } else {
        // 프로덕션 모드에서는 실제 API 사용
        const response = await postAPI.deletePost(postId);
        result = response.data;
      }

      if (result.includes('완료')) {
        // 게시글 데이터 새로고침
        await refreshPostData();
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '게시글 삭제에 실패했습니다.';
      setError(errorMessage);
      console.error('게시글 삭제 오류:', err);
      return false;
    }
  };

  // 개별 게시글 조회
  const getPost = async (postId: number): Promise<Post | null> => {
    if (!isLoggedIn) return null;

    try {
      let postData: Post | null;

      if (import.meta.env.DEV) {
        // 개발 모드에서는 fakeApi 사용
        fakeApi.setTestMode(true); // 테스트 모드 활성화
        postData = await fakeApi.getPost(postId);
      } else {
        // 프로덕션 모드에서는 실제 API 사용
        const response = await postAPI.getPost(postId);
        postData = response.data || null;
      }

      return postData;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '게시글을 불러오는데 실패했습니다.';
      setError(errorMessage);
      console.error('게시글 조회 오류:', err);
      return null;
    }
  };

  // 로그인 상태가 변경될 때마다 게시글 데이터 새로고침
  useEffect(() => {
    if (isLoggedIn) {
      refreshPostData();
    } else {
      setPosts([]);
      setError(null);
    }
  }, [isLoggedIn, refreshPostData]);

  const value: PostContextType = {
    posts,
    isLoading,
    error,
    refreshPostData,
    getPost,
    createPost,
    updatePost,
    deletePost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

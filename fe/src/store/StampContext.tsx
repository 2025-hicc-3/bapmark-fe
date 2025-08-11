import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Bookmark, StampBoard } from '../types/api';
import { colorPalette } from '../components/stampbook/colorPalette';

// API 응답 형식에 맞는 스탬프 데이터 인터페이스
interface StampData {
  stampBoards: StampBoard[];
  bookmarks: Bookmark[];
}

interface StampContextType {
  stampData: StampData;
  isLoading: boolean;
  error: string | null;
  refreshStampData: () => void;
  updateBookmarkVisited: (bookmarkId: string, visited: boolean) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'user'>) => void;
  removeBookmark: (bookmarkId: string) => void;
  createStampBoard: (title: string, color: string) => void;
  updateStampBoard: (boardId: string, updates: Partial<StampBoard>) => void;
  deleteStampBoard: (boardId: string) => void;
}

const StampContext = createContext<StampContextType | undefined>(undefined);

export const useStamp = () => {
  const context = useContext(StampContext);
  if (context === undefined) {
    throw new Error('useStamp must be used within a StampProvider');
  }
  return context;
};

interface StampProviderProps {
  children: ReactNode;
}

export const StampProvider: React.FC<StampProviderProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [stampData, setStampData] = useState<StampData>({
    stampBoards: [],
    bookmarks: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 테스트용 하드코딩 데이터 (API 응답 형식과 동일)
  const getTestData = (): StampData => {
    return {
      stampBoards: [
        {
          id: '1',
          title: '카페 스탬프',
          color: colorPalette[0], // 사전 지정된 첫 번째 색상
          createdAt: '2024-01-01T00:00:00.000Z',
          user: { id: 'test-user-1' },
          bookmarks: [
            {
              id: '1',
              placeName: '스타벅스 강남점',
              address: '서울 강남구 강남대로 396',
              latitude: 37.5665,
              longitude: 126.978,
              visited: true,
              createdAt: '2024-01-01T00:00:00.000Z',
              user: { id: 'test-user-1' },
              post: { id: '1', title: '카페 리뷰' },
            },
            {
              id: '2',
              placeName: '투썸플레이스 홍대점',
              address: '서울 마포구 홍대로 123',
              latitude: 37.5575,
              longitude: 126.925,
              visited: false,
              createdAt: '2024-01-02T00:00:00.000Z',
              user: { id: 'test-user-1' },
            },
            {
              id: '3',
              placeName: '할리스 커피 신촌점',
              address: '서울 서대문구 신촌로 123',
              latitude: 37.5595,
              longitude: 126.943,
              visited: false,
              createdAt: '2024-01-03T00:00:00.000Z',
              user: { id: 'test-user-1' },
            },
          ],
        },
        {
          id: '2',
          title: '맛집 스탬프',
          color: colorPalette[1], // 사전 지정된 두 번째 색상
          createdAt: '2024-01-04T00:00:00.000Z',
          user: { id: 'test-user-1' },
          bookmarks: [
            {
              id: '4',
              placeName: '맛있는 치킨집',
              address: '서울 강남구 테헤란로 456',
              latitude: 37.5725,
              longitude: 126.985,
              visited: true,
              createdAt: '2024-01-05T00:00:00.000Z',
              user: { id: 'test-user-1' },
              post: { id: '2', title: '맛집 리뷰' },
            },
            {
              id: '5',
              placeName: '피자나라',
              address: '서울 마포구 와우산로 789',
              latitude: 37.5535,
              longitude: 126.935,
              visited: false,
              createdAt: '2024-01-06T00:00:00.000Z',
              user: { id: 'test-user-1' },
            },
            {
              id: '6',
              placeName: '스시로',
              address: '서울 강남구 강남대로 321',
              latitude: 37.5685,
              longitude: 126.988,
              visited: true,
              createdAt: '2024-01-07T00:00:00.000Z',
              user: { id: 'test-user-1' },
              post: { id: '3', title: '스시 맛집' },
            },
          ],
        },
        {
          id: '3',
          title: '일식집 스탬프',
          color: colorPalette[2], // 사전 지정된 세 번째 색상
          createdAt: '2024-01-08T00:00:00.000Z',
          user: { id: 'test-user-1' },
          bookmarks: [
            {
              id: '7',
              placeName: '우동집',
              address: '서울 강남구 논현로 654',
              latitude: 37.5515,
              longitude: 126.988,
              visited: true,
              createdAt: '2024-01-09T00:00:00.000Z',
              user: { id: 'test-user-1' },
            },
            {
              id: '8',
              placeName: '라멘집',
              address: '서울 강남구 강남대로 789',
              latitude: 37.5795,
              longitude: 126.991,
              visited: false,
              createdAt: '2024-01-10T00:00:00.000Z',
              user: { id: 'test-user-1' },
            },
          ],
        },
      ],
      bookmarks: [],
    };
  };

  // 모든 북마크를 하나의 배열로 추출
  const extractAllBookmarks = (stampBoards: StampBoard[]): Bookmark[] => {
    const allBookmarks: Bookmark[] = [];
    stampBoards.forEach((board) => {
      if (board.bookmarks) {
        allBookmarks.push(...board.bookmarks);
      }
    });
    return allBookmarks;
  };

  // 스탬프 데이터 새로고침
  const refreshStampData = () => {
    if (!isLoggedIn) {
      setStampData({ stampBoards: [], bookmarks: [] });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 테스트 로그인 상태에서는 하드코딩된 데이터 사용
      const testData = getTestData();
      const allBookmarks = extractAllBookmarks(testData.stampBoards);

      setStampData({
        stampBoards: testData.stampBoards,
        bookmarks: allBookmarks,
      });
    } catch {
      setError('스탬프 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 북마크 방문 상태 업데이트
  const updateBookmarkVisited = (bookmarkId: string, visited: boolean) => {
    setStampData((prev) => ({
      ...prev,
      stampBoards: prev.stampBoards.map((board) => ({
        ...board,
        bookmarks:
          board.bookmarks?.map((bookmark) =>
            bookmark.id === bookmarkId ? { ...bookmark, visited } : bookmark
          ) || [],
      })),
      bookmarks: prev.bookmarks.map((bookmark) =>
        bookmark.id === bookmarkId ? { ...bookmark, visited } : bookmark
      ),
    }));
  };

  // 새 북마크 추가
  const addBookmark = (
    newBookmark: Omit<Bookmark, 'id' | 'createdAt' | 'user'>
  ) => {
    const bookmark: Bookmark = {
      ...newBookmark,
      id: `bookmark-${Date.now()}`,
      createdAt: new Date().toISOString(),
      user: { id: 'test-user-1' },
    };

    setStampData((prev) => ({
      ...prev,
      bookmarks: [...prev.bookmarks, bookmark],
    }));
  };

  // 북마크 제거
  const removeBookmark = (bookmarkId: string) => {
    setStampData((prev) => ({
      ...prev,
      stampBoards: prev.stampBoards.map((board) => ({
        ...board,
        bookmarks:
          board.bookmarks?.filter((bookmark) => bookmark.id !== bookmarkId) ||
          [],
      })),
      bookmarks: prev.bookmarks.filter(
        (bookmark) => bookmark.id !== bookmarkId
      ),
    }));
  };

  // 새 스탬프보드 생성
  const createStampBoard = (title: string, color: string) => {
    const newBoard: StampBoard = {
      id: `board-${Date.now()}`,
      title,
      color,
      createdAt: new Date().toISOString(),
      user: { id: 'test-user-1' },
      bookmarks: [],
    };

    setStampData((prev) => ({
      ...prev,
      stampBoards: [...prev.stampBoards, newBoard],
    }));
  };

  // 스탬프보드 업데이트
  const updateStampBoard = (boardId: string, updates: Partial<StampBoard>) => {
    setStampData((prev) => ({
      ...prev,
      stampBoards: prev.stampBoards.map((board) =>
        board.id === boardId ? { ...board, ...updates } : board
      ),
    }));
  };

  // 스탬프보드 삭제
  const deleteStampBoard = (boardId: string) => {
    setStampData((prev) => ({
      ...prev,
      stampBoards: prev.stampBoards.filter((board) => board.id !== boardId),
    }));
  };

  // 로그인 상태 변경 시 데이터 새로고침
  useEffect(() => {
    refreshStampData();
  }, [isLoggedIn]);

  const value: StampContextType = {
    stampData,
    isLoading,
    error,
    refreshStampData,
    updateBookmarkVisited,
    addBookmark,
    removeBookmark,
    createStampBoard,
    updateStampBoard,
    deleteStampBoard,
  };

  return (
    <StampContext.Provider value={value}>{children}</StampContext.Provider>
  );
};

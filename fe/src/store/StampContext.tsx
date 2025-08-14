import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Bookmark, StampBoard } from '../types/api';
import { stampBoardAPI } from '../utils/api';
import { fakeApi } from '../utils/fakeApi';

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
  updateBookmarkVisited: (bookmarkId: number, visited: boolean) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'postId'>) => void;
  removeBookmark: (bookmarkId: number) => void;
  createStampBoard: (title: string, color: string) => Promise<boolean>;
  updateStampBoard: (
    boardId: number,
    updates: Partial<StampBoard>
  ) => Promise<boolean>;
  deleteStampBoard: (boardId: number) => Promise<boolean>;
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

  // 테스트용 데이터 가져오기 - fakeApi 사용
  const getTestData = async (): Promise<StampData> => {
    try {
      // fakeApi 테스트 모드 활성화
      fakeApi.setTestMode(true);

      // fakeApi에서 데이터 가져오기
      const [stampBoards, bookmarks] = await Promise.all([
        fakeApi.getStampBoards(),
        fakeApi.getBookmarks(),
      ]);

      return {
        stampBoards,
        bookmarks,
      };
    } catch (error) {
      console.error('테스트 데이터 가져오기 실패:', error);
      // 에러 발생 시 빈 데이터 반환
      return {
        stampBoards: [],
        bookmarks: [],
      };
    }
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

  // 백엔드 API에서 스탬프 데이터 가져오기
  const fetchStampDataFromAPI = async (): Promise<StampData | null> => {
    try {
      // 스탬프보드 데이터 가져오기
      const stampBoardsResponse = await stampBoardAPI.getMyStampBoards();
      if (stampBoardsResponse.error) {
        console.error('스탬프보드 조회 실패:', stampBoardsResponse.error);
        return null;
      }

      const stampBoards = stampBoardsResponse.data || [];

      // 각 스탬프보드의 북마크 정보 가져오기
      const stampBoardsWithBookmarks = await Promise.all(
        stampBoards.map(async (board) => {
          try {
            // 스탬프보드에 속한 북마크들 가져오기 (API 명세에 따라 조정 필요)
            // 현재는 board.bookmarks가 이미 포함되어 있다고 가정
            return board;
          } catch (error) {
            console.error(`스탬프보드 ${board.id} 북마크 조회 실패:`, error);
            return { ...board, bookmarks: [] };
          }
        })
      );

      const allBookmarks = extractAllBookmarks(stampBoardsWithBookmarks);

      return {
        stampBoards: stampBoardsWithBookmarks,
        bookmarks: allBookmarks,
      };
    } catch (error) {
      console.error('API에서 스탬프 데이터 가져오기 실패:', error);
      return null;
    }
  };

  // 스탬프 데이터 새로고침
  const refreshStampData = async () => {
    if (!isLoggedIn) {
      setStampData({ stampBoards: [], bookmarks: [] });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 먼저 백엔드 API에서 데이터 가져오기 시도
      const apiData = await fetchStampDataFromAPI();

      if (apiData) {
        // API에서 데이터를 성공적으로 가져온 경우
        setStampData(apiData);
        console.log('백엔드 API에서 스탬프 데이터를 성공적으로 가져왔습니다.');
      } else {
        // API 호출 실패 시 테스트 데이터 사용 (개발 환경에서만)
        if (import.meta.env.DEV) {
          console.warn('API 호출 실패로 테스트 데이터를 사용합니다.');
          const testData = await getTestData();
          const allBookmarks = extractAllBookmarks(testData.stampBoards);

          setStampData({
            stampBoards: testData.stampBoards,
            bookmarks: allBookmarks,
          });
        } else {
          setError('스탬프 데이터를 불러오는데 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('스탬프 데이터 새로고침 실패:', error);
      setError('스탬프 데이터를 불러오는데 실패했습니다.');

      // 개발 환경에서만 테스트 데이터 사용
      if (import.meta.env.DEV) {
        const testData = await getTestData();
        const allBookmarks = extractAllBookmarks(testData.stampBoards);

        setStampData({
          stampBoards: testData.stampBoards,
          bookmarks: allBookmarks,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 북마크 방문 상태 업데이트
  const updateBookmarkVisited = (bookmarkId: number, visited: boolean) => {
    setStampData((prev) => ({
      ...prev,
      stampBoards: prev.stampBoards.map((board) => ({
        ...board,
        bookmarks:
          board.bookmarks?.map((bookmark) =>
            bookmark.postId === bookmarkId ? { ...bookmark, visited } : bookmark
          ) || [],
      })),
      bookmarks: prev.bookmarks.map((bookmark) =>
        bookmark.postId === bookmarkId ? { ...bookmark, visited } : bookmark
      ),
    }));
  };

  // 새 북마크 추가
  const addBookmark = (newBookmark: Omit<Bookmark, 'postId'>) => {
    const bookmark: Bookmark = {
      ...newBookmark,
      postId: Date.now(),
    };

    setStampData((prev) => ({
      ...prev,
      bookmarks: [...prev.bookmarks, bookmark],
    }));
  };

  // 북마크 제거
  const removeBookmark = (bookmarkId: number) => {
    setStampData((prev) => ({
      ...prev,
      stampBoards: prev.stampBoards.map((board) => ({
        ...board,
        bookmarks:
          board.bookmarks?.filter(
            (bookmark) => bookmark.postId !== bookmarkId
          ) || [],
      })),
      bookmarks: prev.bookmarks.filter(
        (bookmark) => bookmark.postId !== bookmarkId
      ),
    }));
  };

  // 새 스탬프보드 생성 (백엔드 API 연동)
  const createStampBoard = async (
    title: string,
    color: string
  ): Promise<boolean> => {
    try {
      const response = await stampBoardAPI.createStampBoard(title, color);

      if (response.error) {
        console.error('스탬프보드 생성 실패:', response.error);
        setError('스탬프보드를 생성하는데 실패했습니다.');
        return false;
      }

      if (response.data) {
        // 성공적으로 생성된 경우 로컬 상태 업데이트
        const newBoard: StampBoard = {
          ...response.data,
          bookmarks: response.data.bookmarks || [],
        };

        setStampData((prev) => ({
          ...prev,
          stampBoards: [...prev.stampBoards, newBoard],
        }));

        console.log('스탬프보드가 성공적으로 생성되었습니다:', response.data);
        return true;
      }

      return false;
    } catch (error) {
      console.error('스탬프보드 생성 중 오류 발생:', error);
      setError('스탬프보드를 생성하는데 실패했습니다.');
      return false;
    }
  };

  // 스탬프보드 업데이트 (백엔드 API 연동)
  const updateStampBoard = async (
    boardId: number,
    updates: Partial<StampBoard>
  ): Promise<boolean> => {
    try {
      let success = true;

      // 제목 업데이트
      if (updates.title) {
        const titleResponse = await stampBoardAPI.updateStampBoardTitle(
          boardId.toString(),
          updates.title
        );
        if (titleResponse.error) {
          console.error('스탬프보드 제목 업데이트 실패:', titleResponse.error);
          success = false;
        }
      }

      // 색상 업데이트
      if (updates.color) {
        const colorResponse = await stampBoardAPI.updateStampBoardColor(
          boardId.toString(),
          updates.color
        );
        if (colorResponse.error) {
          console.error('스탬프보드 색상 업데이트 실패:', colorResponse.error);
          success = false;
        }
      }

      if (success) {
        // 성공적으로 업데이트된 경우 로컬 상태 업데이트
        setStampData((prev) => ({
          ...prev,
          stampBoards: prev.stampBoards.map((board) =>
            board.id === boardId ? { ...board, ...updates } : board
          ),
        }));

        console.log('스탬프보드가 성공적으로 업데이트되었습니다:', boardId);
        return true;
      } else {
        setError('스탬프보드 업데이트에 실패했습니다.');
        return false;
      }
    } catch (error) {
      console.error('스탬프보드 업데이트 중 오류 발생:', error);
      setError('스탬프보드 업데이트에 실패했습니다.');
      return false;
    }
  };

  // 스탬프보드 삭제 (백엔드 API 연동)
  const deleteStampBoard = async (boardId: number): Promise<boolean> => {
    try {
      const response = await stampBoardAPI.deleteStampBoard(boardId.toString());

      if (response.error) {
        console.error('스탬프보드 삭제 실패:', response.error);
        setError('스탬프보드를 삭제하는데 실패했습니다.');
        return false;
      }

      // 성공적으로 삭제된 경우 로컬 상태 업데이트
      setStampData((prev) => ({
        ...prev,
        stampBoards: prev.stampBoards.filter((board) => board.id !== boardId),
      }));

      console.log('스탬프보드가 성공적으로 삭제되었습니다:', boardId);
      return true;
    } catch (error) {
      console.error('스탬프보드 삭제 중 오류 발생:', error);
      setError('스탬프보드를 삭제하는데 실패했습니다.');
      return false;
    }
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

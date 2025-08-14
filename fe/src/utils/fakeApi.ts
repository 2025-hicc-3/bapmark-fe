import type {
  Post,
  Bookmark,
  StampBoard,
  CreatePostRequest,
  CreateStampBoardRequest,
} from '../types/api';
import type { User, LoginResponse, UpdateNicknameRequest } from '../types/auth';

// 테스트용 사용자 데이터
export const fakeUsers: User[] = [
  {
    id: 1,
    email: 'test1@example.com',
    nickname: '테스트 사용자1',
  },
];

// 테스트용 게시글 데이터 (API 명세서에 맞게 수정)
export const fakePosts: Post[] = [
  {
    id: 1,
    title: '카미야가 어쩌구저쩌구',
    content: '내용은 이렇고 저렇고',
    address: '카미야',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: 2,
    title: '한신포차 맛있어요',
    content: '정말 맛있는 포차였어요',
    address: '한신포차',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: 3,
    title: '가미우동 추천',
    content: '우동이 정말 맛있어요',
    address: '가미우동',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: 4,
    title: '맛집 발견했어요',
    content: '이곳 꼭 가보세요',
    address: '맛집',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: 5,
    title: '오늘 점심 메뉴',
    content: '오늘 점심 뭐 먹을까요',
    address: '점심',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: 6,
    title: '저녁 맛집 추천',
    content: '저녁에 먹기 좋은 곳',
    address: '저녁',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: 7,
    title: '주말 맛집 탐방',
    content: '주말에 가볼만한 곳',
    address: '주말',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: 8,
    title: '디저트 맛집',
    content: '달콤한 디저트 맛집',
    address: '디저트',
    latitude: 37.5665,
    longitude: 126.978,
  },
];

// 테스트용 북마크 데이터 (API 명세서에 맞게 수정)
export const fakeBookmarks: Bookmark[] = [
  {
    postId: 1,
    title: '스타벅스 홍대점',
    address: '서울 마포구 홍대로 396',
    latitude: 37.5519,
    longitude: 126.9255,
    visited: true,
  },
  {
    postId: 2,
    title: '투썸플레이스 홍대점',
    address: '서울 마포구 홍대로 123',
    latitude: 37.5575,
    longitude: 126.92,
    visited: false,
  },
  {
    postId: 3,
    title: '할리스 커피 홍대점',
    address: '서울 마포구 홍대로 456',
    latitude: 37.549,
    longitude: 126.93,
    visited: false,
  },
  {
    postId: 4,
    title: '맛있는 치킨집',
    address: '서울 마포구 와우산로 123',
    latitude: 37.5535,
    longitude: 126.935,
    visited: true,
  },
  {
    postId: 5,
    title: '피자나라',
    address: '서울 마포구 와우산로 456',
    latitude: 37.555,
    longitude: 126.932,
    visited: false,
  },
  {
    postId: 6,
    title: '우동집',
    address: '서울 마포구 와우산로 789',
    latitude: 37.5565,
    longitude: 126.928,
    visited: true,
  },
];

// 테스트용 스탬프보드 데이터 (API 명세서에 맞게 수정)
export const fakeStampBoards: StampBoard[] = [
  {
    id: 1,
    title: '카페 스탬프',
    color: '#153641',
    createdAt: '2024-01-01T00:00:00.000Z',
    user: { id: 1 },
    bookmarks: [
      {
        postId: 1,
        title: '스타벅스 홍대점',
        address: '서울 마포구 홍대로 396',
        latitude: 37.5519,
        longitude: 126.9255,
        visited: true,
      },
      {
        postId: 2,
        title: '투썸플레이스 홍대점',
        address: '서울 마포구 홍대로 123',
        latitude: 37.5575,
        longitude: 126.92,
        visited: false,
      },
      {
        postId: 3,
        title: '할리스 커피 홍대점',
        address: '서울 마포구 홍대로 456',
        latitude: 37.549,
        longitude: 126.93,
        visited: false,
      },
    ],
  },
  {
    id: 2,
    title: '맛집 스탬프',
    color: '#22556e',
    createdAt: '2024-01-04T00:00:00.000Z',
    user: { id: 1 },
    bookmarks: [
      {
        postId: 4,
        title: '맛있는 치킨집',
        address: '서울 마포구 와우산로 123',
        latitude: 37.5535,
        longitude: 126.935,
        visited: true,
      },
      {
        postId: 5,
        title: '피자나라',
        address: '서울 마포구 와우산로 456',
        latitude: 37.555,
        longitude: 126.932,
        visited: false,
      },
    ],
  },
  {
    id: 3,
    title: '일식집 스탬프',
    color: '#4799b7',
    createdAt: '2024-01-08T00:00:00.000Z',
    user: { id: 1 },
    bookmarks: [
      {
        postId: 6,
        title: '우동집',
        address: '서울 마포구 와우산로 789',
        latitude: 37.5565,
        longitude: 126.928,
        visited: true,
      },
    ],
  },
];

// Fake API 클래스
export class FakeAPI {
  private static instance: FakeAPI;
  private isTestMode: boolean = false;

  private constructor() {}

  static getInstance(): FakeAPI {
    if (!FakeAPI.instance) {
      FakeAPI.instance = new FakeAPI();
    }
    return FakeAPI.instance;
  }

  // 테스트 모드 활성화/비활성화
  setTestMode(enabled: boolean) {
    this.isTestMode = enabled;
  }

  isInTestMode(): boolean {
    return this.isTestMode;
  }

  // 게시글 관련 Fake API
  async getPosts(): Promise<Post[]> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    return [...fakePosts];
  }

  async getPost(id: number): Promise<Post | null> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    return fakePosts.find((post) => post.id === id) || null;
  }

  async createPost(postData: CreatePostRequest): Promise<Post> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const newPost: Post = {
      id: Date.now(), // 현재 시간을 ID로 사용
      ...postData,
    };

    fakePosts.push(newPost);
    return newPost;
  }

  async updatePost(id: number, postData: CreatePostRequest): Promise<Post> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const index = fakePosts.findIndex((post) => post.id === id);
    if (index === -1) throw new Error('게시글을 찾을 수 없습니다');

    const updatedPost: Post = {
      ...fakePosts[index],
      ...postData,
    };

    fakePosts[index] = updatedPost;
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const index = fakePosts.findIndex((post) => post.id === id);
    if (index === -1) return false;

    fakePosts.splice(index, 1);
    return true;
  }

  // 북마크 관련 Fake API
  async getBookmarks(visited?: boolean): Promise<Bookmark[]> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    if (visited !== undefined) {
      return fakeBookmarks.filter((bookmark) => bookmark.visited === visited);
    }
    return [...fakeBookmarks];
  }

  async createBookmark(
    bookmarkData: Omit<Bookmark, 'postId'>
  ): Promise<Bookmark> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const newBookmark: Bookmark = {
      postId: Date.now(), // 현재 시간을 postId로 사용
      ...bookmarkData,
    };

    fakeBookmarks.push(newBookmark);
    return newBookmark;
  }

  async updateBookmarkVisited(
    postId: number,
    visited: boolean
  ): Promise<Bookmark> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const bookmark = fakeBookmarks.find((b) => b.postId === postId);
    if (!bookmark) throw new Error('북마크를 찾을 수 없습니다');

    bookmark.visited = visited;
    return bookmark;
  }

  async deleteBookmark(postId: number): Promise<boolean> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const index = fakeBookmarks.findIndex((b) => b.postId === postId);
    if (index === -1) return false;

    fakeBookmarks.splice(index, 1);
    return true;
  }

  // 스탬프보드 관련 Fake API
  async getStampBoards(): Promise<StampBoard[]> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    return [...fakeStampBoards];
  }

  async getStampBoard(id: number): Promise<StampBoard | null> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    return fakeStampBoards.find((board) => board.id === id) || null;
  }

  async createStampBoard(
    boardData: CreateStampBoardRequest
  ): Promise<StampBoard> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const newBoard: StampBoard = {
      id: Date.now(), // 현재 시간을 ID로 사용
      ...boardData,
      createdAt: new Date().toISOString(),
      user: { id: 1 },
      bookmarks: [],
    };

    fakeStampBoards.push(newBoard);
    return newBoard;
  }

  async updateStampBoardTitle(id: number, title: string): Promise<StampBoard> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const board = fakeStampBoards.find((b) => b.id === id);
    if (!board) throw new Error('스탬프보드를 찾을 수 없습니다');

    board.title = title;
    return board;
  }

  async updateStampBoardColor(id: number, color: string): Promise<StampBoard> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const board = fakeStampBoards.find((b) => b.id === id);
    if (!board) throw new Error('스탬프보드를 찾을 수 없습니다');

    board.color = color;
    return board;
  }

  async deleteStampBoard(id: number): Promise<boolean> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const index = fakeStampBoards.findIndex((b) => b.id === id);
    if (index === -1) return false;

    fakeStampBoards.splice(index, 1);
    return true;
  }

  // 사용자 관련 Fake API
  async getUserInfo(): Promise<User> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    return { ...fakeUsers[0] };
  }

  async updateNickname(request: UpdateNicknameRequest): Promise<User> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const user = fakeUsers[0];
    user.nickname = request.nickname;
    return { ...user };
  }

  // 테스트 로그인
  async testLogin(): Promise<LoginResponse> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    return {
      accessToken: `test-token-${Date.now()}`,
      user: { ...fakeUsers[0] },
    };
  }

  // 지연 시뮬레이션 (실제 API 호출과 비슷한 경험을 위해)
  private async simulateDelay(
    min: number = 300,
    max: number = 800
  ): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // 데이터 초기화 (테스트용)
  resetData(): void {
    // 원본 데이터로 복원
    fakePosts.length = 0;
    fakeBookmarks.length = 0;
    fakeStampBoards.length = 0;

    // 원본 데이터 다시 추가
    fakePosts.push(...fakePosts);
    fakeBookmarks.push(...fakeBookmarks);
    fakeStampBoards.push(...fakeStampBoards);
  }
}

// 싱글톤 인스턴스 export
export const fakeApi = FakeAPI.getInstance();

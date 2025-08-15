import type {
  Post,
  Bookmark,
  StampBoard,
  CreatePostRequest,
  CreateStampBoardRequest,
} from '../types/api';
import type { User, UpdateNicknameRequest } from '../types/auth';

// 테스트용 사용자 데이터
// GET /users/me 엔드포인트 응답 데이터
export const fakeUsers: User[] = [
  {
    id: 1,
    email: 'test1@example.com',
    nickname: '테스트 사용자1',
  },
];

// 테스트용 게시글 데이터 (API 명세서에 맞게 수정)
// GET /posts/allPosts 엔드포인트 응답 데이터
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
    title: '가미우동 추천2',
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
// GET /users/me/bookmarks 엔드포인트 응답 데이터
// postId는 게시글 ID를 의미하며, 게시글이 없는 경우 북마크 ID를 사용
export const fakeBookmarks: Bookmark[] = [
  {
    postId: 1, // 게시글 ID
    title: '스타벅스',
    address: '서울 마포구 홍대로 396',
    latitude: 37.5519,
    longitude: 126.9255,
    visited: true,
  },
  {
    postId: 2, // 게시글 ID
    title: '투썸플레이스 홍대점',
    address: '서울 마포구 홍대로 123',
    latitude: 37.5575,
    longitude: 126.92,
    visited: false,
  },
  {
    postId: 3, // 게시글 ID
    title: '할리스 커피 홍대점',
    address: '서울 마포구 홍대로 456',
    latitude: 37.549,
    longitude: 126.93,
    visited: false,
  },
  {
    postId: 4, // 게시글 ID
    title: '맛있는 치킨집',
    address: '서울 마포구 와우산로 123',
    latitude: 37.5535,
    longitude: 126.935,
    visited: true,
  },
  {
    postId: 5, // 게시글 ID
    title: '피자나라',
    address: '서울 마포구 와우산로 456',
    latitude: 37.555,
    longitude: 126.932,
    visited: false,
  },
  {
    postId: 6, // 게시글 ID
    title: '우동집',
    address: '서울 마포구 와우산로 789',
    latitude: 37.5565,
    longitude: 126.928,
    visited: true,
  },
];

// 테스트용 스탬프보드 데이터 (API 명세서에 맞게 수정)
// GET /stampboards/me/boards 엔드포인트 응답 데이터
export const fakeStampBoards: StampBoard[] = [
  {
    id: 1,
    title: '카페 스탬프',
    color: '#153641',
    createdAt: '2024-01-01T00:00:00.000Z',
    user: { id: 1 },
    bookmarks: [
      {
        postId: 1, // 게시글 ID
        title: '스타벅스',
        address: '서울 마포구 홍대로 396',
        latitude: 37.5519,
        longitude: 126.9255,
        visited: true,
      },
      {
        postId: 2, // 게시글 ID
        title: '투썸플레이스 홍대점',
        address: '서울 마포구 홍대로 123',
        latitude: 37.5575,
        longitude: 126.92,
        visited: false,
      },
      {
        postId: 3, // 게시글 ID
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
        postId: 4, // 게시글 ID
        title: '맛있는 치킨집',
        address: '서울 마포구 와우산로 123',
        latitude: 37.5535,
        longitude: 126.935,
        visited: true,
      },
      {
        postId: 5, // 게시글 ID
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
        postId: 6, // 게시글 ID
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
  // GET /posts/allPosts 엔드포인트 시뮬레이션
  async getPosts(): Promise<Post[]> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    return [...fakePosts];
  }

  // GET /posts/{id} 엔드포인트 시뮬레이션
  async getPost(id: number): Promise<Post | null> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    return fakePosts.find((post) => post.id === id) || null;
  }

  // POST /posts 엔드포인트 시뮬레이션
  // API 명세서: "게시글 작성 완료" 반환
  async createPost(postData: CreatePostRequest): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const newPost: Post = {
      id: Date.now(), // 현재 시간을 ID로 사용
      ...postData,
    };

    fakePosts.push(newPost);
    return '게시글 작성 완료';
  }

  // PUT /posts/{id} 엔드포인트 시뮬레이션
  // API 명세서: "게시글 수정 완료" 반환
  async updatePost(id: number, postData: CreatePostRequest): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const index = fakePosts.findIndex((post) => post.id === id);
    if (index === -1) throw new Error('게시글을 찾을 수 없습니다');

    const updatedPost: Post = {
      ...fakePosts[index],
      ...postData,
    };

    fakePosts[index] = updatedPost;
    return '게시글 수정 완료';
  }

  // DELETE /posts/{id} 엔드포인트 시뮬레이션
  // API 명세서: "게시글 삭제 완료" 반환
  async deletePost(id: number): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const index = fakePosts.findIndex((post) => post.id === id);
    if (index === -1) throw new Error('게시글을 찾을 수 없습니다');

    fakePosts.splice(index, 1);
    return '게시글 삭제 완료';
  }

  // 북마크 관련 Fake API
  // GET /users/me/bookmarks?visited={visited} 엔드포인트 시뮬레이션
  async getBookmarks(visited?: boolean): Promise<Bookmark[]> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    if (visited !== undefined) {
      return fakeBookmarks.filter((bookmark) => bookmark.visited === visited);
    }
    return [...fakeBookmarks];
  }

  // POST /users/search 엔드포인트 시뮬레이션 (장소 정보로 북마크 추가)
  // API 명세서: POST /users/search?placeName={placeName}&address={address}&latitude={latitude}&longitude={longitude}
  // API 명세서: "Bookmark added by search" 반환
  async createBookmark(
    bookmarkData: Omit<Bookmark, 'postId'>
  ): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const newBookmark: Bookmark = {
      postId: Date.now(), // 검색 기반 북마크의 경우 북마크 ID를 postId로 사용
      ...bookmarkData,
    };

    fakeBookmarks.push(newBookmark);
    return 'Bookmark added by search';
  }

  // ⚠️ API 명세서에 명시되지 않은 메서드 (백엔드 구현 필요)
  // PATCH /users/me/bookmarks/{bookmarkId}/visited 엔드포인트 시뮬레이션
  // 현재는 테스트용으로 유지하되, 실제 API 구현 시 제거 예정
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

  // DELETE /users/{postId} 엔드포인트 시뮬레이션 (북마크 취소)
  // API 명세서: DELETE /users/{postId} - "북마크 취소됨" 반환
  async deleteBookmark(postId: number): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const index = fakeBookmarks.findIndex((b) => b.postId === postId);
    if (index === -1) throw new Error('북마크를 찾을 수 없습니다');

    fakeBookmarks.splice(index, 1);
    return '북마크 취소됨';
  }

  // 스탬프보드 관련 Fake API
  // GET /stampboards/me/boards 엔드포인트 시뮬레이션
  async getStampBoards(): Promise<StampBoard[]> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    return [...fakeStampBoards];
  }

  // GET /stampboards/{id} 엔드포인트 시뮬레이션
  async getStampBoard(id: number): Promise<StampBoard | null> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    return fakeStampBoards.find((board) => board.id === id) || null;
  }

  // POST /stampboards?title={title}&color={color} 엔드포인트 시뮬레이션
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

  // PATCH /stampboards/{boardId}/title?title={title} 엔드포인트 시뮬레이션
  // API 명세서: "보드 이름이 수정되었습니다." 반환
  async updateStampBoardTitle(id: number, title: string): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const board = fakeStampBoards.find((b) => b.id === id);
    if (!board) throw new Error('스탬프보드를 찾을 수 없습니다');

    board.title = title;
    return '보드 이름이 수정되었습니다.';
  }

  // PATCH /stampboards/{boardId}/color?color={color} 엔드포인트 시뮬레이션
  // API 명세서: "보드 컬러가 수정되었습니다." 반환
  async updateStampBoardColor(id: number, color: string): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const board = fakeStampBoards.find((b) => b.id === id);
    if (!board) throw new Error('스탬프보드를 찾을 수 없습니다');

    board.color = color;
    return '보드 컬러가 수정되었습니다.';
  }

  // DELETE /stampboards/{id} 엔드포인트 시뮬레이션
  // API 명세서: "삭제 완료" 반환
  async deleteStampBoard(id: number): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const index = fakeStampBoards.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('스탬프보드를 찾을 수 없습니다');

    fakeStampBoards.splice(index, 1);
    return '삭제 완료';
  }

  // 스탬프보드-북마크 연결 관련 Fake API
  // POST /stampboards/{boardId}/bookmark 엔드포인트 시뮬레이션
  // API 명세서: 요청 본문에 북마크 ID 숫자값을 raw number로 전송, "북마크 추가 완료" 반환
  async addBookmarkToStampBoard(
    boardId: number,
    bookmarkId: number
  ): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const board = fakeStampBoards.find((b) => b.id === boardId);
    const bookmark = fakeBookmarks.find((b) => b.postId === bookmarkId);

    if (!board || !bookmark)
      throw new Error('스탬프보드 또는 북마크를 찾을 수 없습니다');

    // 이미 추가되어 있는지 확인
    if (board.bookmarks?.some((b) => b.postId === bookmarkId)) {
      throw new Error('이미 추가된 북마크입니다');
    }

    // 북마크를 스탬프보드에 추가
    if (!board.bookmarks) board.bookmarks = [];
    board.bookmarks.push({ ...bookmark });

    return '북마크 추가 완료';
  }

  // DELETE /stampboards/{boardId}/bookmark 엔드포인트 시뮬레이션
  // API 명세서: "북마크 삭제 완료" 반환
  async removeBookmarkFromStampBoard(
    boardId: number,
    bookmarkId: number
  ): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const board = fakeStampBoards.find((b) => b.id === boardId);
    if (!board || !board.bookmarks)
      throw new Error('스탬프보드를 찾을 수 없습니다');

    const index = board.bookmarks.findIndex((b) => b.postId === bookmarkId);
    if (index === -1) throw new Error('북마크를 찾을 수 없습니다');

    board.bookmarks.splice(index, 1);
    return '북마크 삭제 완료';
  }

  // GET /stampboards/{boardId}/bookmarks 엔드포인트 시뮬레이션 (API 명세서에 명시되지 않음)
  async getStampBoardBookmarks(boardId: number): Promise<Bookmark[]> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const board = fakeStampBoards.find((b) => b.id === boardId);
    return board?.bookmarks || [];
  }

  // 게시글 관련 Fake API
  // GET /posts/allPosts 엔드포인트 시뮬레이션
  async getAllPosts(): Promise<Post[]> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    return [...fakePosts];
  }

  // GET /posts/search?keyword={keyword} 엔드포인트 시뮬레이션
  async searchPosts(keyword: string): Promise<Post[]> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const filtered = fakePosts.filter(
      (post) =>
        post.title.toLowerCase().includes(keyword.toLowerCase()) ||
        post.content.toLowerCase().includes(keyword.toLowerCase()) ||
        post.address.toLowerCase().includes(keyword.toLowerCase())
    );
    return filtered;
  }

  // GET /posts/me 엔드포인트 시뮬레이션
  async getMyPosts(): Promise<Post[]> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    // 테스트용으로 모든 게시글을 반환 (실제로는 사용자별로 필터링)
    return [...fakePosts];
  }

  // POST /posts/ 엔드포인트 시뮬레이션
  // API 명세서: "게시글 작성 완료" 반환
  async createPost(request: CreatePostRequest): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const newPost: Post = {
      id: fakePosts.length + 1,
      title: request.title,
      content: request.content,
      address: request.address,
      latitude: request.latitude,
      longitude: request.longitude,
    };

    fakePosts.push(newPost);
    return '게시글 작성 완료';
  }

  // PUT /posts/{postId} 엔드포인트 시뮬레이션
  // API 명세서: "게시글 수정 완료" 반환
  async updatePost(
    postId: number,
    request: CreatePostRequest
  ): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const post = fakePosts.find((p) => p.id === postId);
    if (!post) throw new Error('게시글을 찾을 수 없습니다');

    post.title = request.title;
    post.content = request.content;
    post.address = request.address;
    post.latitude = request.latitude;
    post.longitude = request.longitude;

    return '게시글 수정 완료';
  }

  // DELETE /posts/{postId} 엔드포인트 시뮬레이션
  // API 명세서: "게시글 삭제 완료" 반환
  async deletePost(postId: number): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const index = fakePosts.findIndex((p) => p.id === postId);
    if (index === -1) throw new Error('게시글을 찾을 수 없습니다');

    fakePosts.splice(index, 1);
    return '게시글 삭제 완료';
  }

  // 사용자 관련 Fake API
  // GET /users/me 엔드포인트 시뮬레이션
  async getUserInfo(): Promise<User> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();
    return { ...fakeUsers[0] };
  }

  // PATCH /users/me 엔드포인트 시뮬레이션
  // API 명세서: "닉네임이 성공적으로 변경되었습니다." 반환
  async updateNickname(request: UpdateNicknameRequest): Promise<string> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    const user = fakeUsers[0];
    user.nickname = request.nickname;
    return '닉네임이 성공적으로 변경되었습니다.';
  }

  // 테스트 로그인 (실제 API와는 다른 테스트용 메서드)
  // POST /auth/google 엔드포인트와 유사한 응답 형식 시뮬레이션
  // API 명세서: { accessToken } 반환
  async testLogin(): Promise<{ accessToken: string }> {
    if (!this.isTestMode) throw new Error('테스트 모드가 아닙니다');
    await this.simulateDelay();

    return {
      accessToken: `test-token-${Date.now()}`,
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

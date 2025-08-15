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
    email: 'user@gmail.com',
    nickname: '홍대 맛집 탐험가',
  },
];

// 테스트용 게시글 데이터 (API 명세서에 맞게 수정)
// GET /posts/allPosts 엔드포인트 응답 데이터
export const fakePosts: Post[] = [
  {
    id: 1,
    title: '홍대 카페거리 맛집 탐방',
    content:
      '홍대 카페거리에서 발견한 숨겨진 맛집들을 소개합니다. 특히 스타벅스 홍대점 근처에 있는 작은 카페들이 정말 맛있어요. 커피도 맛있고 디저트도 훌륭합니다.',
    address: '서울 마포구 홍대로 396',
    latitude: 37.5519,
    longitude: 126.9255,
  },
  {
    id: 2,
    title: '홍대 포차거리 야식 추천',
    content:
      '홍대 포차거리에서 먹을 수 있는 야식들을 정리했습니다. 특히 한신포차의 떡볶이와 어묵이 정말 맛있어요. 밤늦게까지 영업해서 야식으로도 좋습니다.',
    address: '서울 마포구 홍대로 123',
    latitude: 37.5575,
    longitude: 126.92,
  },
  {
    id: 3,
    title: '홍대 우동 맛집 가미우동',
    content:
      '홍대에 있는 가미우동에서 먹은 우동 후기입니다. 우동 면발이 쫄깃하고 국물이 진해서 정말 맛있었어요. 특히 온소바가 추천 메뉴입니다.',
    address: '서울 마포구 와우산로 123',
    latitude: 37.5535,
    longitude: 126.935,
  },
  {
    id: 4,
    title: '홍대 치킨 맛집 발견',
    content:
      '홍대 근처에서 발견한 치킨 맛집입니다. 양념치킨이 정말 맛있고 가격도 합리적이에요. 특히 후라이드 치킨의 바삭함이 일품입니다.',
    address: '서울 마포구 와우산로 456',
    latitude: 37.555,
    longitude: 126.932,
  },
  {
    id: 5,
    title: '홍대 피자 맛집 피자나라',
    content:
      '홍대에 있는 피자나라에서 먹은 피자 후기입니다. 도우가 얇고 바삭해서 정말 맛있었어요. 특히 페퍼로니 피자가 추천 메뉴입니다.',
    address: '서울 마포구 와우산로 789',
    latitude: 37.5565,
    longitude: 126.928,
  },
  {
    id: 6,
    title: '홍대 일식집 우동집',
    content:
      '홍대에 있는 우동집에서 먹은 일식 후기입니다. 우동뿐만 아니라 돈카츠도 정말 맛있었어요. 특히 가라아게가 추천 메뉴입니다.',
    address: '서울 마포구 홍대로 456',
    latitude: 37.549,
    longitude: 126.93,
  },
  {
    id: 7,
    title: '홍대 디저트 맛집 탐방',
    content:
      '홍대 근처에 있는 디저트 맛집들을 소개합니다. 특히 팬케이크와 와플이 맛있는 카페들이 많아요. 커피와 함께 먹으면 더욱 맛있습니다.',
    address: '서울 마포구 홍대로 789',
    latitude: 37.548,
    longitude: 126.931,
  },
  {
    id: 8,
    title: '홍대 술집 추천',
    content:
      '홍대 근처에 있는 술집들을 소개합니다. 특히 맥주가 맛있는 펍들이 많아요. 친구들과 함께 가면 더욱 즐거운 시간을 보낼 수 있습니다.',
    address: '서울 마포구 홍대로 321',
    latitude: 37.552,
    longitude: 126.929,
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
  async getAllPosts(): Promise<Post[]> {
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

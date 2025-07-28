/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_MAP_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 카카오맵 SDK 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
} 
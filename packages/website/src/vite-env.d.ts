/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_COMMIT_SHA: string;
  readonly VITE_BUILD_TIMESTAMP: string;
  readonly VITE_BUILD_VERSION: string;
}

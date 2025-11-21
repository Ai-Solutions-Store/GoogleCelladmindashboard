/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SQUARE_APPLICATION_ID: string
  readonly VITE_SQUARE_LOCATION_ID: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

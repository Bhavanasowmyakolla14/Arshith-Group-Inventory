/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_LOCAL_API_URL: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_PLATFORM_NAME: string;
  readonly VITE_ADMIN_DEFAULT_EMAIL: string;
  readonly VITE_POLLING_INTERVAL_MS: string;
  readonly VITE_DATABASE_TYPE: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


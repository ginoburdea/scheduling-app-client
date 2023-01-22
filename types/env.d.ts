/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER_URL: string
    readonly VITE_ENCRYPTION_KEY: string
    readonly PORT: number
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

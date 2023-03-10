import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import eslint from 'vite-plugin-eslint'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        server: { port: +env.CLIENT_PORT },
        preview: {
            port: 80,
            host: '0.0.0.0',
        },
        plugins: [
            vue({ reactivityTransform: true }),
            eslint({ failOnError: false }),
        ],
        resolve: {
            alias: {
                '@': resolve('src'),
            },
        },
    }
})

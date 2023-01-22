import { defineConfig } from 'cypress'
import { config } from 'dotenv'

config()

export default defineConfig({
    e2e: {
        videosFolder: 'temp',
        baseUrl: `http://localhost:${process.env.PORT}`,
    },
})

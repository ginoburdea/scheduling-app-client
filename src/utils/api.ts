import { Fetcher } from 'openapi-typescript-fetch'
import { paths } from './apiSchema'

const fetcher = Fetcher.for<paths>()

fetcher.configure({
    baseUrl: import.meta.env.VITE_SERVER_URL,
})

export const registerUser = fetcher
    .path('/users/register')
    .method('post')
    .create()

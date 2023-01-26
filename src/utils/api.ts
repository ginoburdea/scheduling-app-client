import { useUserStore } from '@/store/userStore'
import { Fetcher, Middleware } from 'openapi-typescript-fetch'
import { paths } from './apiSchema'

const fetcher = Fetcher.for<paths>()

const addAuthorization: Middleware = async (url, init, next) => {
    const userStore = useUserStore()
    if (userStore.isLoggedIn) {
        init.headers.append('Authorization', `Bearer ${userStore.session}`)
    }

    const response = await next(url, init)
    return response
}

fetcher.configure({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    use: [addAuthorization],
})

export const registerUser = fetcher
    .path('/users/register')
    .method('post')
    .create()

export const logInUser = fetcher.path('/users/log-in').method('post').create()

export const updateCalendar = fetcher.path('/calendars').method('put').create()

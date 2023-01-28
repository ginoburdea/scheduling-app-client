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

export const logOutUser = fetcher.path('/users/log-out').method('post').create()

export const updateCalendar = fetcher.path('/calendars').method('put').create()

export const getAppointments = fetcher
    .path('/calendars/appointments')
    .method('get')
    .create()

export const getCalendarInfo = fetcher.path('/calendars').method('get').create()

export const getAvailableDays = fetcher
    .path('/calendars/available-days')
    .method('get')
    .create()

export const getAvailableSpots = fetcher
    .path('/calendars/available-spots')
    .method('get')
    .create()

export const setAppointment = fetcher
    .path('/calendars/set-appointment')
    .method('post')
    .create()

export const getCalendarSettings = fetcher
    .path('/calendars/settings')
    .method('get')
    .create()

export const getAppointment = fetcher
    .path('/calendars/appointment')
    .method('get')
    .create()

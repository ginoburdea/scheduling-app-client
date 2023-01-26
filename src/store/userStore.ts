import { components } from '@/utils/apiSchema'
import { defineStore } from 'pinia'

type AuthRes = components['schemas']['AuthRes']

export const useUserStore = defineStore('user', {
    state: (): AuthRes | Partial<AuthRes> => ({
        calendarId: undefined,
        userEmail: undefined,
        session: undefined,
        sessionExpiresAt: undefined,
    }),
    getters: {
        isLoggedIn: state =>
            state.session != undefined &&
            state.sessionExpiresAt != undefined &&
            +new Date(state.sessionExpiresAt) > Date.now(),
    },
    persist: true,
})

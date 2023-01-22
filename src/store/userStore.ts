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
    persist: true,
})

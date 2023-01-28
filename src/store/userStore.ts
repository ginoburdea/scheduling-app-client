import { components } from '@/utils/apiSchema'
import aes from 'crypto-js/aes'
import utf8 from 'crypto-js/enc-utf8'
import { defineStore } from 'pinia'
import { PersistedStateOptions } from 'pinia-plugin-persistedstate'
type AuthRes = components['schemas']['AuthRes']

const persistProductionOptions: PersistedStateOptions = {
    serializer: {
        serialize: value =>
            aes
                .encrypt(
                    JSON.stringify(value),
                    import.meta.env.VITE_ENCRYPTION_KEY
                )
                .toString(),
        deserialize: encrypted =>
            JSON.parse(
                aes
                    .decrypt(encrypted, import.meta.env.VITE_ENCRYPTION_KEY)
                    .toString(utf8)
            ),
    },
}

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
    persist: import.meta.env.DEV ? true : persistProductionOptions,
})

import { router } from '@/router'
import { ApiError } from 'openapi-typescript-fetch'

export const handleErrors = <T>(
    error: any | ApiError,
    fields: string[]
): { key: T; error: string } => {
    if (error instanceof ApiError) {
        const errorField = (error.data.message || '').split(' ')[0]

        if (error.status === 400 && fields.includes(errorField)) {
            return {
                key: errorField,
                error: error.data.message.replace(errorField, 'this'),
            }
        }

        if (error.status === 401) {
            router.push({
                name: 'Login',
                query: {
                    redirectTo: router.currentRoute.value.path,
                },
            })
            return { key: 'other', error: '' }
        }

        return { key: 'other', error: error.data.message }
    }

    return { key: 'other', error: error.message }
}

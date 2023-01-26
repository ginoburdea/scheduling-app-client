<script setup lang="ts">
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import { useUserStore } from '@/store/userStore'
import { logInUser } from '@/utils/api'
import { handleErrors } from '@/utils/handleErrors'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const formData = reactive({
    email: '',
    password: '',
})

const errors = reactive({
    email: '',
    password: '',
    other: '',
})

const userStore = useUserStore()
const router = useRouter()

const submitForm = async () => {
    errors.email = ''
    errors.password = ''
    errors.other = ''

    try {
        const { data } = await logInUser(formData)
        userStore.$patch(data)

        const redirectTo = router.currentRoute.value.query.redirectTo as string
        router.push(redirectTo || { name: 'Dashboard' })
    } catch (err: any) {
        const { key, error } = handleErrors<keyof typeof errors>(
            err,
            Object.keys(formData)
        )
        if (!error) return
        errors[key] = error
    }
}
</script>

<template>
    <p class="text-3xl font-bold">Log in</p>

    <form class="space-y-2" @submit.prevent="submitForm">
        <Input
            v-model="formData.email"
            :error="errors.email"
            label="Email"
            type="email"
            data-cy="input-email"
            @input="errors.email = ''" />
        <Input
            v-model="formData.password"
            :error="errors.password"
            label="Password"
            type="password"
            data-cy="input-password"
            @input="errors.password = ''" />
        <Button type="submit" data-cy="button-submit">Log in</Button>
    </form>

    <p class="text-danger-2" data-cy="text-error">{{ errors.other }}</p>

    <p>
        Don't have an account?
        <router-link class="link" :to="{ name: 'Register' }"
            >Register now</router-link
        >
    </p>
</template>

<style scoped></style>

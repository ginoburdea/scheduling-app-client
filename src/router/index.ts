import { useUserStore } from '@/store/userStore'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        name: 'Register',
        path: '/register',
        meta: { center: true },
        component: () => import('@/views/Register.vue'),
    },
    {
        name: 'Login',
        path: '/login',
        meta: { center: true },
        component: () => import('@/views/Login.vue'),
    },
    {
        name: 'Dashboard',
        path: '/dashboard',
        meta: { requiresLogin: true },
        component: () => import('@/views/Dashboard.vue'),
    },
    {
        name: 'UpdateCalendar',
        path: '/update-calendar',
        meta: { center: true, requiresLogin: true },
        component: () => import('@/views/UpdateCalendar.vue'),
    },
    {
        path: '/:all(.*)',
        redirect: { name: 'Register' },
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(to => {
    if (to.meta.requiresLogin) {
        const userStore = useUserStore()
        if (!userStore.isLoggedIn) {
            return { name: 'Login' }
        }
    }
})

router.afterEach(to => {
    document.title = to.name as string
})

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
        component: () => import('@/views/Dashboard.vue'),
    },
    {
        path: '/:all(.*)',
        redirect: 'Register',
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.afterEach(to => {
    document.title = to.name as string
})

<script setup lang="ts"></script>

<template>
    <div
        v-if="$route.meta.center"
        class="flex min-h-screen items-center justify-center p-2">
        <div
            class="w-full rounded-md bg-primary-2 p-4 sm:w-3/4 md:w-1/2 lg:w-1/3">
            <router-view></router-view>
        </div>
    </div>

    <router-view v-else></router-view>
</template>

<style scoped></style>

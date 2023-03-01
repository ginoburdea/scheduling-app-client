<script setup lang="ts">
import Button from '@/components/Button.vue'
</script>

<template>
    <p class="text-3xl font-bold">Welcome!</p>

    <div class="space-y-4">
        <div class="space-y-1">
            <p>
                This application is designed for anyone that needs to offer
                their clients a way to book meetings.
            </p>
            <p>Try it by clicking one of the buttons below!</p>
        </div>
        <div class="space-x-2">
            <Button>
                <router-link :to="{ name: 'Register' }">Register</router-link>
            </Button>
            <Button>
                <router-link :to="{ name: 'Login' }">Log in</router-link>
            </Button>
        </div>
        <p class="text-sm">
            PS: You may use a fake email for registration since this is a
            portfolio project
        </p>
    </div>
</template>

<style scoped></style>

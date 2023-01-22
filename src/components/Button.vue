<script setup lang="ts">
interface Props {
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
}

// eslint-disable-next-line
const { loading = false, type = 'button' } = defineProps<Props>()
</script>

<template>
    <button
        class="rounded-md bg-accent-1 py-2 px-6 hover:bg-accent-2 disabled:cursor-not-allowed disabled:bg-accent-3"
        :type="type"
        :disabled="!!loading">
        <span v-if="loading">Loading...</span>
        <span v-else>
            <slot></slot>
        </span>
    </button>
</template>

<style scoped></style>

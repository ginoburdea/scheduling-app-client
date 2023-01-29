<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

interface Props {
    label: string
    error?: string
    modelValue: string
    options: { value: string; label: string }[]
}

// eslint-disable-next-line vue/no-setup-props-destructure
const { label, error = '', modelValue, options = [] } = defineProps<Props>()

const id = uuidv4()
</script>

<template>
    <div>
        <label :for="id">{{ label }}</label>
        <select
            v-bind="$attrs"
            :id="id"
            class="box-border w-full rounded-md border-2 border-primary-3 bg-primary-1 text-primary-4 focus:border-primary-4 focus:ring-0"
            :class="[
                error && 'border-danger-1 text-danger-2 focus:border-danger-2',
            ]"
            :value="modelValue"
            @input="(event: Event) => emit('update:modelValue', (event.target as HTMLSelectElement).value)">
            <option
                v-for="option in options"
                :key="option.value"
                :value="option.value">
                {{ option.label }}
            </option>
        </select>
        <p class="text-danger-2">
            {{ error }}
        </p>
    </div>
</template>

<style scoped></style>

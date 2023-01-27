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

const props = defineProps({
    label: { type: String, required: true },
    error: { type: String, default: '' },
    modelValue: { type: String, required: true },
    options: { type: Array, default: () => [] },
})

const id = uuidv4()
</script>

<template>
    <div>
        <label :for="id">{{ props.label }}</label>
        <select
            v-bind="$attrs"
            :id="id"
            class="box-border w-full rounded-md border-2 border-primary-3 bg-primary-1 text-primary-4 focus:border-primary-4 focus:ring-0"
            :class="[
                props.error &&
                    'border-danger-1 text-danger-2 focus:border-danger-2',
            ]"
            :value="props.modelValue"
            :type="props.type"
            @input="event => emit('update:modelValue', event.target.value)">
            <option
                v-for="option in props.options"
                :key="option.value"
                :value="option.value">
                {{ option.label }}
            </option>
        </select>
        <p class="text-danger-2">
            {{ props.error }}
        </p>
    </div>
</template>

<style scoped></style>

<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>
<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

const emit = defineEmits<{
    (e: 'update:modelValue', value: typeof props.modelValue): void
}>()

const props = defineProps({
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    modelValue: { type: [Boolean, Array], required: true },
})

const id = uuidv4()

// interface HTMLCheckboxElement extends HTMLInputElement {
//     checked: boolean
// }
</script>

<template>
    <div class="flex items-center justify-start gap-1">
        <input
            v-bind="$attrs"
            :id="id"
            class="cursor-pointer rounded border-primary-4 bg-primary-1 text-primary-4 outline-0 checked:bg-primary-4 hover:checked:bg-primary-4 focus:ring-0"
            type="checkbox"
            :checked="
                Array.isArray(props.modelValue)
                    ? props.modelValue.includes(props.value)
                    : props.modelValue
            "
            @input="
                event =>
                    emit(
                        'update:modelValue',
                        Array.isArray(props.modelValue)
                            ? props.modelValue.includes(props.value)
                                ? props.modelValue.filter(
                                      value => value != props.value
                                  )
                                : props.modelValue.concat(props.value)
                            : (event.target as HTMLInputElement).checked 
                    )
            " />
        <label :for="id">{{ props.label }}</label>
    </div>
</template>

<style scoped></style>

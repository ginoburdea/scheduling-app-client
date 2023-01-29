<script setup lang="ts">
import { getAppointment } from '@/utils/api'
import { handleErrors } from '@/utils/handleErrors'
import { onClickOutside } from '@vueuse/core'
import { reactive, ref, watch } from 'vue'

const emit = defineEmits<{
    (e: 'close'): void
}>()

const props = defineProps({
    appointmentId: { type: Number, default: undefined },
})

const modalDiv = ref<HTMLDivElement>()

const closeModal = () => emit('close')
onClickOutside(modalDiv, closeModal)

const errors = reactive({ appointmentId: '', other: '' })
const appointmentPlaceholder = {
    clientName: 'Loading...',
    clientPhoneNumber: 'Loading...',
}
const appointment = reactive({ ...appointmentPlaceholder })

watch(
    () => props.appointmentId,
    async appointmentId => {
        if (!appointmentId) return

        errors.appointmentId = ''
        errors.other = ''

        try {
            const { data } = await getAppointment({
                appointmentId,
            })
            appointment.clientName = data.clientName
            appointment.clientPhoneNumber = data.clientPhoneNumber
        } catch (err: any) {
            const { key, error } = handleErrors(err, Object.keys(errors))
            if (!error) return
            errors[key as keyof typeof errors] = error
        }
    },
    { immediate: true }
)
</script>

<template>
    <div
        v-if="props.appointmentId != null"
        data-cy="modal-appointmentInfo"
        class="fixed top-0 left-0 z-30 flex h-screen w-screen items-center justify-center bg-primary-5 bg-opacity-30">
        <div
            ref="modalDiv"
            class="w-full space-y-3 rounded-md bg-primary-2 p-4 sm:w-3/4 md:w-1/2 lg:w-1/3">
            <div class="flex justify-between">
                <p class="text-2xl font-bold">Appointment info</p>
                <div
                    class="cursor-pointer rounded p-1 hover:bg-primary-1"
                    data-cy="button-mobile-prev"
                    @click="closeModal">
                    <img class="h-6" src="/close.svg" />
                </div>
            </div>
            <div v-if="!errors.other && !errors.appointmentId">
                <p data-cy="text-clientName">
                    Client name: {{ appointment.clientName }}
                </p>
                <p data-cy="text-clientPhoneNumber">
                    Client phone number: {{ appointment.clientPhoneNumber }}
                </p>
            </div>
            <div v-else>
                <p class="text-danger-2">{{ errors.appointmentId }}</p>
                <p class="text-danger-2">{{ errors.other }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>

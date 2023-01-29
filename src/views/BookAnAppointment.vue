<script setup lang="ts">
import Button from '@/components/Button.vue'
import Dropdown from '@/components/Dropdown.vue'
import Input from '@/components/Input.vue'
import {
    getAvailableDays,
    getAvailableSpots,
    getCalendarInfo,
    setAppointment,
} from '@/utils/api'
import { handleErrors } from '@/utils/handleErrors'
import dayjs from 'dayjs'
import { onBeforeMount, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const errors = reactive({
    mainOther: '',
    other: '',
    date: '',
    name: '',
    phoneNumber: '',
})

const calendarInfo = reactive({
    businessName: '',
    businessDescription: '',
    availableDates: [] as string[],
    availableSpots: [] as string[],
})

const formData = reactive({
    date: '',
    time: '',
    name: '',
    phoneNumber: '',
})

const appointmentBookedAt = ref('')

onBeforeMount(async () => {
    errors.other = ''
    try {
        const { data } = await getCalendarInfo({
            id: router.currentRoute.value.params.calendarId as string,
        })
        calendarInfo.businessName = data.businessName
        calendarInfo.businessDescription = data.businessDescription
    } catch (err: any) {
        const { key, error } = handleErrors(err, [])
        if (!error) return
        errors[(key === 'other' ? 'mainOther' : key) as keyof typeof errors] =
            error
    }
})

watch(
    () => calendarInfo.businessName,
    async () => {
        errors.mainOther = ''
        try {
            const { data } = await getAvailableDays({
                calendarId: router.currentRoute.value.params
                    .calendarId as string,
            })

            calendarInfo.availableDates.splice(
                0,
                calendarInfo.availableDates.length,
                ...data.dates
            )
        } catch (err: any) {
            const { key, error } = handleErrors(err, [])
            if (!error) return
            errors[key as keyof typeof errors] = error
        }
    }
)

watch(
    () => formData.date,
    async () => {
        formData.time = ''
        errors.other = ''
        try {
            const { data } = await getAvailableSpots({
                calendarId: router.currentRoute.value.params
                    .calendarId as string,
                date: formData.date,
            })

            calendarInfo.availableSpots.splice(
                0,
                calendarInfo.availableSpots.length,
                ...data.spots
            )
        } catch (err: any) {
            const { key, error } = handleErrors(err, [])
            if (!error) return
            errors[key as keyof typeof errors] = error
        }
    }
)

const bookAppointment = async () => {
    errors.other = ''
    try {
        const { data } = await setAppointment({
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            calendarId: router.currentRoute.value.params.calendarId as string,
            date: formData.time,
        })

        appointmentBookedAt.value = data.date
        // while (calendarInfo.availableDates.pop()) {}
        // calendarInfo.availableDates.push(...data.dates)
    } catch (err: any) {
        const { key, error } = handleErrors(err, Object.keys(errors))
        if (!error) return
        errors[key as keyof typeof errors] = error
    }
}

// const dates: Date[] = reactive([])
// onBeforeMount(() => {
//     const startOfMonth = dayjs('2023-02-10').startOf('month')
//     const a = +startOfMonth.format('d')
//     console.log(a)

//     for (let i = a; i > -1; i--) {
//         dates.push(startOfMonth.subtract(i, 'days').toDate())
//     }

//     const endOfMonth = startOfMonth.endOf('month')
//     for (let i = 0; i < +endOfMonth.format('D'); i++) {
//         dates.push(startOfMonth.add(i, 'days').toDate())
//     }
// })
</script>

<template>
    <div v-if="errors.mainOther">
        <p>Error: {{ errors.mainOther }}</p>
    </div>
    <div
        v-else-if="appointmentBookedAt"
        data-cy="text-success"
        class="space-y-3">
        <p class="text-xl font-bold">Appointment set successfully</p>
        <div>
            <p>Date: {{ dayjs(appointmentBookedAt).format('MMMM D, YYYY') }}</p>
            <p>Time: {{ dayjs(appointmentBookedAt).format('HH:mm') }}</p>
        </div>
        <Button @click="router.go(0)">Set another appointment</Button>
    </div>
    <form v-else class="space-y-3" @submit.prevent="bookAppointment">
        <p class="text-3xl font-bold">Book an appointment</p>

        <div>
            <p class="text-lg font-semibold">{{ calendarInfo.businessName }}</p>
            <p>{{ calendarInfo.businessDescription }}</p>
        </div>

        <Dropdown
            v-model="formData.date"
            data-cy="dropdown-date"
            label="Select a date"
            error=""
            :options="
                calendarInfo.availableDates.map(date => ({
                    value: date,
                    label: dayjs(date).format('MMMM D, YYYY'),
                }))
            " />

        <Dropdown
            v-if="formData.date"
            v-model="formData.time"
            data-cy="dropdown-time"
            label="Select a time"
            error=""
            :options="
                calendarInfo.availableSpots.map(spot => ({
                    value: spot,
                    label: dayjs(spot).format('HH:mm'),
                }))
            " />

        <div v-if="formData.time" class="space-y-3">
            <Input
                v-model="formData.name"
                data-cy="input-name"
                label="Name"
                :error="errors.name" />
            <Input
                v-model="formData.phoneNumber"
                data-cy="input-phoneNumber"
                label="Phone number"
                :error="errors.phoneNumber" />
            <Button data-cy="button-submit" type="submit"
                >Set appointment</Button
            >
        </div>
    </form>
    <p v-if="errors.other" class="text-danger-2" data-cy="error-other">
        {{ errors.other }}
    </p>
</template>

<style scoped></style>

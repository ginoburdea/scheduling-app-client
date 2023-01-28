<script setup lang="ts">
import Button from '@/components/Button.vue'
import Checkbox from '@/components/Checkbox.vue'
import Input from '@/components/Input.vue'
import { getCalendarSettings, updateCalendar } from '@/utils/api'
import { handleErrors } from '@/utils/handleErrors'
import { onBeforeMount, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const initialState = {
    businessName: '',
    businessDescription: '',
    dayStartsAt: '',
    dayEndsAt: '',
    breakBetweenBookings: '',
    bookingDuration: '',
    bookInAdvance: '',
    workingDays: [] as number[],
}

const formData = reactive({ ...initialState })
const errors = reactive({ ...initialState, workingDays: '', other: '' })

const resetErrors = () => {
    for (const key in errors) {
        errors[key] = ''
    }
}

onBeforeMount(async () => {
    resetErrors()

    try {
        const { data } = await getCalendarSettings({})

        for (const key in data) {
            if (Array.isArray(formData[key])) {
                formData[key].splice(0, formData[key].length, ...data[key])
            } else {
                formData[key] = data[key]
            }
        }
    } catch (err: any) {
        const { key, error } = handleErrors<keyof typeof errors>(err, [])
        if (!error) return
        errors[key] = error
    }
})

const submitForm = async () => {
    resetErrors()

    try {
        console.log(formData.workingDays)
        await updateCalendar(formData)

        router.push({ name: 'Dashboard' })
    } catch (err: any) {
        const { key, error } = handleErrors<keyof typeof errors>(
            err,
            Object.keys(initialState)
        )
        if (!error) return

        errors[key] = error
    }
}

const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]
</script>

<template>
    <p class="text-3xl font-bold">Update calendar</p>
    <form class="space-y-2" @submit.prevent="submitForm">
        <Input
            v-model="formData.businessName"
            :error="errors.businessName"
            label="Business name"
            type="text"
            data-cy="input-businessName"
            @input="errors.businessName = ''" />
        <Input
            v-model="formData.businessDescription"
            :error="errors.businessDescription"
            label="Business description"
            type="text"
            data-cy="input-businessDescription"
            @input="errors.businessDescription = ''" />
        <div class="grid grid-cols-2 gap-2">
            <Input
                v-model="formData.dayStartsAt"
                :error="errors.dayStartsAt"
                label="Opening hours"
                type="time"
                data-cy="input-dayStartsAt"
                @input="errors.dayStartsAt = ''" />
            <Input
                v-model="formData.dayEndsAt"
                :error="errors.dayEndsAt"
                label="Closing hours"
                type="time"
                data-cy="input-dayEndsAt"
                @input="errors.dayEndsAt = ''" />
        </div>
        <div class="grid grid-cols-2 gap-2">
            <Input
                v-model="formData.breakBetweenBookings"
                :error="errors.breakBetweenBookings"
                label="Break between bookings (in minutes)"
                type="number"
                data-cy="input-breakBetweenBookings"
                @input="errors.breakBetweenBookings = ''" />
            <Input
                v-model="formData.bookingDuration"
                :error="errors.bookingDuration"
                label="Booking duration (in minutes)"
                type="number"
                data-cy="input-bookingDuration"
                @input="errors.bookingDuration = ''" />
        </div>
        <Input
            v-model="formData.bookInAdvance"
            :error="errors.bookInAdvance"
            label="How many days can you be booked in advance?"
            type="number"
            data-cy="input-bookInAdvance"
            @input="errors.bookInAdvance = ''" />
        <div>
            <p>Working days</p>
            <Checkbox
                v-for="(weekDay, index) in weekDays"
                :key="weekDay"
                v-model="formData.workingDays"
                :label="weekDay"
                :value="index"
                :data-cy="`input-workingDays-${index}`"
                @input="errors.workingDays = ''" />
        </div>
        <Button type="submit" data-cy="button-submit">Update</Button>
    </form>

    <p class="text-danger-2" data-cy="text-error">{{ errors.other }}</p>
</template>

<style scoped></style>

<script setup lang="ts">
import Input from '@/components/Input.vue'
import { useUserStore } from '@/store/userStore'
import { getAppointments, logOutUser } from '@/utils/api'
import { components } from '@/utils/apiSchema'
import { handleErrors } from '@/utils/handleErrors'
import dayjs from 'dayjs'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const showMenu = ref(false)
const desktopView = ref<HTMLDivElement | null>(null)

const router = useRouter()
const userStore = useUserStore()

const bookingsLink =
    window.location.origin +
    router.resolve({
        name: 'BookAnAppointment',
        params: { calendarId: userStore.calendarId },
    }).fullPath

const errors = reactive({ bookingLink: '', other: '' })

const copyLink = async () => {
    errors.bookingLink = ''
    try {
        await navigator.clipboard.writeText(bookingsLink)
    } catch (err) {
        errors.bookingLink =
            'Failed to copy to clipboard. Select and copy the link manually'
    }
}

const logOut = async () => {
    errors.other = ''
    try {
        await logOutUser({})
        userStore.$reset()
        router.push({ name: 'Login' })
    } catch (err: any) {
        const { key, error } = handleErrors<keyof typeof errors>(err, [])
        if (!error) return
        errors[key] = error
    }
}

const currentTimeAsAppointment = reactive({ startsAt: new Date() })

const intervalId = ref()

onMounted(() => {
    intervalId.value = setInterval(() => {
        currentTimeAsAppointment.startsAt = new Date()
    }, 1_000)
})

onUnmounted(() => clearInterval(intervalId.value))

type Appointment = components['schemas']['Appointment']
let appointments = reactive<Appointment[]>([])
const selectedTime = ref<Date>(new Date())

onMounted(() => {
    selectedTime.value = new Date()
})

const groupAppointmentsByHour = (appointments: Appointment[], day: Date) => {
    const result: { [key: string]: MiniAppointment[] } = {}
    for (let i = 0; i < 24; i++) {
        const key = `${i < 10 ? '0' : ''}${i}:00`
        result[key] = []
    }

    const formattedSelectedDay = dayjs(day).format('YYYY-MM-DD')
    const apps = appointments.filter(app => app.day == formattedSelectedDay)

    if (apps.length > 0) {
        for (const app of apps[0].appointments) {
            const key = dayjs(app.startsAt).format('HH:mm')
            result[key].push(app)
        }
    }

    return result
}

const appointmentsByDayByHour = computed(() => {
    return groupAppointmentsByHour(appointments, selectedTime.value)
})

const appointmentsByWeekByHour = computed(() => {
    return Array(7)
        .fill(null)
        .map((_, index) =>
            groupAppointmentsByHour(
                appointments,
                dayjs(selectedTime.value).add(index, 'days').toDate()
            )
        )
})

watch(selectedTime, async updatedSelectedTime => {
    errors.other = ''
    try {
        const { display } = window.getComputedStyle(
            desktopView.value as HTMLDivElement
        )

        const { data } = await getAppointments({
            atOrAfter: dayjs(updatedSelectedTime).startOf('day').toISOString(),
            atOrBefore: dayjs(updatedSelectedTime)
                .add(display === 'none' ? 7 : 0, 'days')
                .endOf('day')
                .toISOString(),
        })

        appointments.splice(0, appointments.length, ...data.appointments)
    } catch (err: any) {
        const { key, error } = handleErrors<keyof typeof errors>(err, [])
        if (!error) return
        errors[key] = error
    }
})

type MiniAppointment = components['schemas']['MiniAppointment']
const calculateHeight = (appointment: MiniAppointment) => {
    const end = +new Date(appointment.endsAt)
    const start = +new Date(appointment.startsAt)
    const diffInSeconds = (end - start) / 1000 / 60
    const gapSize = 0.1

    return `${diffInSeconds / 15 - gapSize}rem`
}

const calculateMarginTop = (
    appointment: { startsAt: Date | string; [key: string]: any },
    hours = 0
) => {
    const start = new Date(appointment.startsAt)
    return `${(hours * 60 + start.getMinutes()) / 15}rem`
}
// const {getComputedStyle}  =window
</script>

<template>
    <!-- <p>{{ getComputedStyle(desktopView) }}</p> -->
    <div class="box-border p-4">
        <div class="sm:hidden">
            <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-1">
                    <span class="text-lg font-bold">{{
                        dayjs(selectedTime).format('MMMM D, YYYY')
                    }}</span>
                    <div class="flex">
                        <div
                            class="rounded p-1 hover:bg-primary-2"
                            data-cy="button-mobile-prev"
                            @click="
                                selectedTime = dayjs(selectedTime)
                                    .subtract(1, 'day')
                                    .toDate()
                            ">
                            <img
                                class="h-6 rotate-180 cursor-pointer"
                                src="/chevron-right.svg" />
                        </div>
                        <div
                            class="rounded p-1 hover:bg-primary-2"
                            data-cy="button-mobile-next"
                            @click="
                                selectedTime = dayjs(selectedTime)
                                    .add(1, 'day')
                                    .toDate()
                            ">
                            <img
                                class="h-6 cursor-pointer"
                                src="/chevron-right.svg" />
                        </div>
                    </div>
                </div>
                <div
                    data-cy="button-mobile-menu"
                    class="cursor-pointer rounded p-2 hover:bg-primary-2"
                    @click="showMenu = !showMenu">
                    <img class="h-5" src="/menu.svg" />
                </div>
                <div
                    v-if="showMenu"
                    class="fixed top-0 left-0 z-50 flex h-full w-full flex-col items-start space-y-4 bg-primary-2 p-4">
                    <div class="flex w-full justify-between">
                        <p class="text-2xl font-semibold">Menu</p>
                        <div
                            class="inline-block cursor-pointer rounded p-2 hover:bg-primary-1"
                            @click="showMenu = !showMenu">
                            <img class="h-5" src="/close.svg" />
                        </div>
                    </div>
                    <div class="w-full">
                        <Input
                            label="Your bookings link"
                            type="text"
                            :error="errors.bookingLink"
                            :model-value="bookingsLink"
                            :disabled="true" />
                        <a class="link" @click="copyLink">Copy link</a>
                    </div>
                    <router-link
                        class="link bold text-xl"
                        :to="{ name: 'UpdateCalendar' }"
                        >Update calendar settings</router-link
                    >
                    <a
                        class="link bold text-xl"
                        data-cy="button-mobile-logOut"
                        @click="logOut"
                        >Log out</a
                    >
                </div>
            </div>
            <table class="w-full border-collapse">
                <tr>
                    <td></td>
                    <td class="border-r-2 border-primary-2 pt-2 pr-2"></td>
                    <td></td>
                </tr>
                <tr
                    v-for="(apps, hour, index) in appointmentsByDayByHour"
                    :key="hour">
                    <td class="relative -top-8 text-sm text-primary-3">
                        {{ hour }}
                    </td>
                    <td
                        class="border-r-2 border-t-2 border-primary-2 pr-2"></td>
                    <td class="calendar-block">
                        <div
                            v-if="index === 0"
                            id="time"
                            class="add-dot-before absolute z-20 h-1 w-full rounded-sm bg-accent-1"
                            :style="{
                                marginTop: calculateMarginTop(
                                    currentTimeAsAppointment,
                                    new Date().getHours()
                                ),
                            }"></div>
                        <router-link
                            v-for="appointment in apps"
                            :key="appointment.id"
                            class="absolute z-10 w-full cursor-pointer rounded bg-primary-3 p-1 hover:bg-primary-4"
                            :style="{
                                height: calculateHeight(appointment),
                                marginTop: calculateMarginTop(appointment),
                            }"
                            :to="{
                                name: 'ViewAppointment',
                                params: { appointmentId: appointment.id },
                            }">
                            {{ dayjs(appointment.startsAt).format('HH:mm') }} -
                            {{ dayjs(appointment.endsAt).format('HH:mm') }}
                        </router-link>
                    </td>
                </tr>
            </table>
        </div>

        <div ref="desktopView" class="hidden sm:block">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-1">
                    <span class="whitespace-nowrap text-lg font-bold"
                        >{{ dayjs(selectedTime).format('MMMM D, YYYY') }} -
                        {{
                            dayjs(selectedTime)
                                .add(1, 'week')
                                .format('MMMM D, YYYY')
                        }}</span
                    >
                    <div class="flex">
                        <div
                            class="rounded p-1 hover:bg-primary-2"
                            data-cy="button-desktop-prev"
                            @click="
                                selectedTime = dayjs(selectedTime)
                                    .subtract(1, 'week')
                                    .toDate()
                            ">
                            <img
                                class="h-6 rotate-180 cursor-pointer"
                                src="/chevron-right.svg" />
                        </div>
                        <div
                            class="rounded p-1 hover:bg-primary-2"
                            data-cy="button-desktop-next"
                            @click="
                                selectedTime = dayjs(selectedTime)
                                    .add(1, 'week')
                                    .toDate()
                            ">
                            <img
                                class="h-6 cursor-pointer"
                                src="/chevron-right.svg" />
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <router-link
                        class="link bold text-md whitespace-nowrap"
                        :to="{ name: 'UpdateCalendar' }"
                        >Calendar settings</router-link
                    >
                    <a
                        class="link bold text-md whitespace-nowrap"
                        data-cy="button-desktop-logOut"
                        @click="logOut"
                        >Log out</a
                    >
                </div>
            </div>
            <div class="mt-3">
                <Input
                    label="Your bookings link"
                    type="text"
                    :error="errors.bookingLink"
                    :model-value="bookingsLink"
                    :disabled="true" />
                <a class="link" @click="copyLink">Copy link</a>
            </div>
            <table class="mt-6 w-full border-collapse">
                <tr class="flex">
                    <td class="flex-shrink-0 flex-grow-0 basis-[35.23px]"></td>
                    <td class="border-r-2 border-primary-2 pt-2 pr-2"></td>
                    <td
                        v-for="i in 7"
                        :key="i - 1"
                        :set="
                            (currentDay = dayjs(selectedTime).add(
                                i - 1,
                                'days'
                            ))
                        "
                        class="w-full border-r-2 border-primary-2 text-center last:border-r-0">
                        <p>
                            {{ currentDay.format('ddd') }}
                        </p>
                        <p class="text-2xl">
                            {{ currentDay.format('DD') }}
                        </p>
                    </td>
                </tr>
                <tr
                    v-for="(_, hours, index) in appointmentsByWeekByHour[0]"
                    :key="index"
                    class="flex">
                    <td
                        class="relative -top-8 flex items-center text-sm text-primary-3">
                        {{ hours }}
                    </td>
                    <td
                        class="border-r-2 border-t-2 border-primary-2 pr-2"></td>
                    <td
                        v-for="(
                            apps, appointmentsIndex
                        ) in appointmentsByWeekByHour"
                        :key="appointmentsIndex"
                        class="calendar-block border-r-2 last:border-r-0">
                        <div
                            v-if="index === 0"
                            class="absolute z-20 h-1 w-[105%] rounded-sm bg-accent-1"
                            :class="{
                                'add-dot-before': appointmentsIndex === 0,
                            }"
                            :style="{
                                marginTop: calculateMarginTop(
                                    currentTimeAsAppointment,
                                    new Date().getHours()
                                ),
                            }"></div>
                        <router-link
                            v-for="appointment in apps[hours]"
                            :key="appointment.id"
                            class="absolute z-10 w-full cursor-pointer rounded bg-primary-3 p-1 hover:bg-primary-4"
                            :style="{
                                height: calculateHeight(appointment),
                                marginTop: calculateMarginTop(appointment),
                            }"
                            :to="{
                                name: 'ViewAppointment',
                                params: { appointmentId: appointment.id },
                            }">
                            {{ dayjs(appointment.startsAt).format('HH:mm') }} -
                            {{ dayjs(appointment.endsAt).format('HH:mm') }}
                        </router-link>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style scoped>
.add-dot-before {
    @apply before:absolute before:-top-1 before:-left-2 before:inline-block before:h-3 before:w-3 before:rounded-md before:bg-accent-1 before:content-[""];
}

.calendar-block {
    @apply relative h-16 w-full border-t-2 border-primary-2 align-top;
    @apply relative h-16 w-full border-t-2 border-primary-2 align-top;
}
</style>

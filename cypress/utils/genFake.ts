import { faker } from '@faker-js/faker'
import dayjs = require('dayjs')

export const genFakeCalendar = () => {
    return {
        businessName: faker.company.name(),
        businessDescription: faker.company.catchPhrase(),
        dayStartsAt: genFakeTime(),
        dayEndsAt: genFakeTime(),
        breakBetweenBookings: faker.datatype
            .number({ min: 0, max: 15, precision: 5 })
            .toString(),
        bookingDuration: faker.datatype
            .number({ min: 25, max: 60, precision: 5 })
            .toString(),
        bookInAdvance: faker.datatype
            .number({ min: 7, max: 21, precision: 7 })
            .toString(),
        workingDays: [0, 1, 2, 3, 4],
    }
}

export const genFakeTime = () => {
    const hours = faker.datatype.number({ min: 10, max: 23 })
    const minutes = faker.datatype.number({ min: 10, max: 59 })

    return `${hours}:${minutes}`
}

export const genFakeAuthRes = () => ({
    calendarId: faker.datatype.uuid(),
    userEmail: faker.internet.email(),
    session: faker.datatype.string(64),
    sessionExpiresAt: faker.date.future(),
})

export const genFake400Error = (fieldName: string) => ({
    statusCode: 400,
    message: `${fieldName} is required`,
})

export const genFakeAppointmentInfo = () => ({
    clientName: faker.name.fullName(),
    clientPhoneNumber: faker.phone.number(),
})

export const genFakeAppointments = (countPerDay: number) => {
    const firstDate = dayjs().subtract(2, 'weeks')
    return {
        appointments: Array(30)
            .fill(null)
            .map((_, index) => ({
                day: firstDate.add(index, 'days').format('YYYY-MM-DD'),
                appointments: Array(countPerDay)
                    .fill(null)
                    .map((_, index) => ({
                        id: faker.datatype.number({ min: 1, max: 1000 }),
                        startsAt: dayjs()
                            .add(index, 'days')
                            .set('hours', index * 2 + 9)
                            .startOf('hours'),
                        endsAt: dayjs()
                            .add(index, 'days')
                            .set('hours', index * 2 + 11)
                            .startOf('hours'),
                    })),
            })),
    }
}

export const genFakeCalendarInfo = () => ({
    businessName: faker.company.name(),
    businessDescription: faker.lorem.sentence(),
})

export const genFakeAvailableDays = () => {
    let index = 0

    return {
        dates: Array(14)
            .fill(null)
            .map(() => dayjs().add(index++, 'days'))
            .filter(day => ![0, 6].includes(day.get('day')))
            .map(date => date.toDate()),
    }
}

export const genFakeAvailableSpots = (date = new Date()) => ({
    spots: Array(5)
        .fill(null)
        .map((_, index) =>
            dayjs(date)
                .add(8 + index * 2, 'hours')
                .startOf('hours')
                .toDate()
        ),
})

export const genFakeAppointment = () => ({
    date: faker.date.future(),
    name: faker.name.fullName(),
    phoneNumber: faker.phone.number(),
})

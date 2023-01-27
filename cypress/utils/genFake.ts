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

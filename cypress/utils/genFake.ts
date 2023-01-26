import { faker } from '@faker-js/faker'

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

import { faker } from '@faker-js/faker'
import {
    genFake400Error,
    genFakeAppointment,
    genFakeAvailableDays,
    genFakeAvailableSpots,
    genFakeCalendarInfo,
} from '../utils/genFake'

describe('Book an appointment page', () => {
    describe('Successfully booking appointments', () => {
        it('should book an appointment', () => {
            cy.intercept('**/calendars*', {
                body: genFakeCalendarInfo(),
            })
            cy.intercept('**/calendars/available-days*', {
                body: genFakeAvailableDays(),
            })
            cy.intercept('**/calendars/available-spots*', {
                body: genFakeAvailableSpots(),
            })
            cy.intercept('**/calendars/set-appointment*', {
                body: genFakeAppointment(),
            })
            const fakeAppointmentId = faker.datatype.uuid()
            cy.visit(`/book-an-appointment/${fakeAppointmentId}`)

            cy.getBySelector('dropdown-date').select(0)
            cy.getBySelector('dropdown-time').select(0)
            cy.getBySelector('input-name').type(faker.name.fullName())
            cy.getBySelector('input-phoneNumber').type(faker.phone.number())
            cy.getBySelector('button-submit').click()

            cy.getBySelector('text-success').should('exist')
        })
    })

    describe('Failed appointment booking', () => {
        it('should not book an appointment when the calendar does not exist', () => {
            cy.intercept('**/calendars*', {
                body: genFake400Error('calendar'),
                statusCode: 400,
            })
            cy.intercept('**/calendars/available-days*', {
                body: genFakeAvailableDays(),
            })
            cy.intercept('**/calendars/available-spots*', {
                body: genFakeAvailableSpots(),
            })
            cy.intercept('**/calendars/set-appointment*', {
                body: genFakeAppointment(),
            })
            const fakeAppointmentId = faker.datatype.uuid()
            cy.visit(`/book-an-appointment/${fakeAppointmentId}`)
        })

        it('should not book an appointment when the name is required', () => {
            cy.intercept('**/calendars*', {
                body: genFakeCalendarInfo(),
            })
            cy.intercept('**/calendars/available-days*', {
                body: genFakeAvailableDays(),
            })
            cy.intercept('**/calendars/available-spots*', {
                body: genFakeAvailableSpots(),
            })
            cy.intercept('**/calendars/set-appointment*', {
                body: genFake400Error('name'),
                statusCode: 400,
            })
            const fakeAppointmentId = faker.datatype.uuid()
            cy.visit(`/book-an-appointment/${fakeAppointmentId}`)

            cy.getBySelector('dropdown-date').select(0)
            cy.getBySelector('dropdown-time').select(0)
            cy.getBySelector('input-name').type(faker.name.fullName())
            cy.getBySelector('input-phoneNumber').type(faker.phone.number())
            cy.getBySelector('button-submit').click()

            cy.get(':nth-child(1) > p.text-danger-2').should('exist')
        })

        it('should not book an appointment when an unexpected error occurs', () => {
            cy.intercept('**/calendars*', {
                body: genFakeCalendarInfo(),
            })
            cy.intercept('**/calendars/available-days*', {
                body: genFakeAvailableDays(),
            })
            cy.intercept('**/calendars/available-spots*', {
                body: genFakeAvailableSpots(),
            })
            cy.intercept('**/calendars/set-appointment*', {
                fixture: 'unexpectedError.json',
                statusCode: 500,
            })
            const fakeAppointmentId = faker.datatype.uuid()
            cy.visit(`/book-an-appointment/${fakeAppointmentId}`)

            cy.getBySelector('dropdown-date').select(0)
            cy.getBySelector('dropdown-time').select(0)
            cy.getBySelector('input-name').type(faker.name.fullName())
            cy.getBySelector('input-phoneNumber').type(faker.phone.number())
            cy.getBySelector('button-submit').click()

            cy.getBySelector('error-other').should('exist')
        })
    })
})

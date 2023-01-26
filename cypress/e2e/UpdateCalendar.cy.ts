import { genFake400Error, genFakeCalendar } from '../utils/genFake'

describe('Update calendar page', () => {
    beforeEach(() => {
        cy.logIn()
    })

    describe('Successful update', () => {
        it('should update the calendar successfully', () => {
            cy.visit('/update-calendar')

            const calendar = genFakeCalendar()
            cy.getBySelector('input-businessName').type(calendar.businessName)
            cy.getBySelector('input-businessDescription').type(
                calendar.businessDescription
            )
            cy.getBySelector('input-dayStartsAt').type(calendar.dayStartsAt)
            cy.getBySelector('input-dayEndsAt').type(calendar.dayEndsAt)
            cy.getBySelector('input-breakBetweenBookings').type(
                '' + calendar.breakBetweenBookings
            )
            cy.getBySelector('input-bookingDuration').type(
                '' + calendar.bookingDuration
            )
            cy.getBySelector('input-bookInAdvance').type(
                '' + calendar.bookInAdvance
            )
            for (let i = 0; i < 7; i++) {
                cy.getBySelector(`input-workingDays-${i}`).check()
            }

            cy.intercept('**/calendars', { body: genFakeCalendar() })
            cy.getBySelector('button-submit').click()
            cy.url().should('endWith', '/dashboard')
        })
    })

    describe('Failed update', () => {
        it('should not update when a required field is empty', () => {
            cy.visit('/update-calendar')

            cy.intercept('**/calendars', {
                body: genFake400Error('businessName'),
                statusCode: 400,
            })
            cy.getBySelector('button-submit').click()
            cy.getBySelector('text-error').should('exist')
        })

        it('should not update when the user is not logged in', () => {
            cy.visit('/update-calendar')

            cy.intercept('**/calendars', {
                fixture: 'unauthorizedError.json',
                statusCode: 401,
            })
            cy.getBySelector('button-submit').click()
            cy.url().should('contain', '/login')
        })

        it('should not update when an unexpected error occurs', () => {
            cy.visit('/update-calendar')

            cy.intercept('**/calendars', {
                fixture: 'unexpectedError.json',
                statusCode: 500,
            })
            cy.getBySelector('button-submit').click()
            cy.getBySelector('text-error').should('exist')
        })
    })
})

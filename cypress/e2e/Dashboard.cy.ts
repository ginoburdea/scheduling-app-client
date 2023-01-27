import { genFakeAppointments } from '../utils/genFake'

describe('Dashboard page', () => {
    beforeEach(() => {
        cy.logIn()
    })

    describe('Successfully getting appointments on mobile', () => {
        it('should get appointments for the current day', () => {
            const appointmentsPerDay = 5
            cy.intercept('**/calendars/appointments**', {
                body: genFakeAppointments(appointmentsPerDay),
            })
            cy.viewport('iphone-x')

            cy.visit('/dashboard')

            cy.get('.calendar-block > a')
                .filter(':visible')
                .should('have.length', appointmentsPerDay)
        })

        it('should get appointments for the previous day', () => {
            const appointmentsPerDay = 5
            cy.intercept('**/calendars/appointments**', {
                body: genFakeAppointments(appointmentsPerDay),
            })
            cy.viewport('iphone-x')

            cy.visit('/dashboard')
            cy.getBySelector('button-mobile-prev').click()

            cy.get('.calendar-block > a')
                .filter(':visible')
                .should('have.length', appointmentsPerDay)
        })

        it('should get appointments for the following day', () => {
            const appointmentsPerDay = 5
            cy.intercept('**/calendars/appointments**', {
                body: genFakeAppointments(appointmentsPerDay),
            })
            cy.viewport('iphone-x')

            cy.visit('/dashboard')
            cy.getBySelector('button-mobile-next').click()

            cy.get('.calendar-block > a')
                .filter(':visible')
                .should('have.length', appointmentsPerDay)
        })
    })

    describe('Successfully getting appointments on desktop', () => {
        it('should get appointments for the current week', () => {
            const appointmentsPerDay = 5
            cy.intercept('**/calendars/appointments**', {
                body: genFakeAppointments(appointmentsPerDay),
            })

            cy.visit('/dashboard')

            const daysPerWeek = 7
            cy.get('.calendar-block > a')
                .filter(':visible')
                .should('have.length', daysPerWeek * appointmentsPerDay)
        })

        it('should get appointments for the previous week', () => {
            const daysPerWeek = 7
            const appointmentsPerDay = 5
            cy.intercept('**/calendars/appointments**', {
                body: genFakeAppointments(appointmentsPerDay),
            })

            cy.visit('/dashboard')
            cy.getBySelector('button-desktop-prev').click()

            cy.get('.calendar-block > a')
                .filter(':visible')
                .should('have.length', daysPerWeek * appointmentsPerDay)
        })

        it('should get appointments for the following week', () => {
            const daysPerWeek = 7
            const appointmentsPerDay = 5
            cy.intercept('**/calendars/appointments**', {
                body: genFakeAppointments(appointmentsPerDay),
            })

            cy.visit('/dashboard')
            cy.getBySelector('button-desktop-next').click()

            cy.get('.calendar-block > a')
                .filter(':visible')
                .should('have.length', daysPerWeek * appointmentsPerDay)
        })
    })

    describe('Successfully logging out on mobile', () => {
        it('should log out', () => {
            cy.intercept('**/calendars/appointments**', {
                body: genFakeAppointments(5),
            })
            cy.viewport('iphone-x')
            cy.visit('/dashboard')

            cy.intercept('**/users/log-out', {
                body: '',
                statusCode: 201,
            })
            cy.getBySelector('button-mobile-menu').click()
            cy.getBySelector('button-mobile-logOut').click()

            cy.url().should('endWith', '/login')
            cy.window().then(window => {
                expect(window.localStorage.getItem('user')).to.equal('{}')
            })
        })
    })

    describe('Successfully logging out on desktop', () => {
        it('should log out', () => {
            cy.intercept('**/calendars/appointments**', {
                body: genFakeAppointments(5),
            })
            cy.visit('/dashboard')

            cy.intercept('**/users/log-out', {
                body: '',
                statusCode: 201,
            })
            cy.getBySelector('button-desktop-logOut').click()

            cy.url().should('endWith', '/login')
            cy.window().then(window => {
                expect(window.localStorage.getItem('user')).to.equal('{}')
            })
        })
    })
})

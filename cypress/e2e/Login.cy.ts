import { faker } from '@faker-js/faker'
import { genFake400Error, genFakeAuthRes } from '../utils/genFake'

describe('Login page', () => {
    describe('Successful log in', () => {
        it('should successfully log in a user', () => {
            cy.visit('/login')

            cy.getBySelector('input-email').type(faker.internet.email())
            cy.getBySelector('input-password').type(faker.internet.password())

            cy.intercept('**/users/log-in', {
                body: genFakeAuthRes(),
            })
            cy.getBySelector('button-submit').click()
            cy.url().should('endWith', '/dashboard')
        })

        it('should successfully log in a user then redirect to the appropriate page', () => {
            cy.visit('/login?redirectTo=/update-calendar')

            cy.getBySelector('input-email').type(faker.internet.email())
            cy.getBySelector('input-password').type(faker.internet.password())

            cy.intercept('**/users/log-in', {
                body: genFakeAuthRes(),
            })
            cy.getBySelector('button-submit').click()
            cy.url().should('endWith', '/update-calendar')
        })
    })

    describe('Failed log in', () => {
        it('should not log in a user when the password is required', () => {
            cy.visit('/login')

            cy.getBySelector('input-email').type(faker.internet.email())

            cy.intercept('**/users/log-in', {
                body: genFake400Error('password'),
                statusCode: 400,
            })
            cy.getBySelector('button-submit').click()
            cy.get(':nth-child(2) > p.text-danger-2').should('exist')
        })

        it('should not register a user when an unexpected error occurs', () => {
            cy.visit('/login')

            cy.getBySelector('input-email').type(faker.internet.email())
            cy.getBySelector('input-password').type(faker.internet.password())

            cy.intercept('**/users/log-in', {
                fixture: 'unexpectedError.json',
                statusCode: 500,
            })
            cy.getBySelector('button-submit').click()
            cy.getBySelector('text-error').should('exist')
        })
    })
})

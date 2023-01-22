import { faker } from '@faker-js/faker'

describe('Register page', () => {
    describe('Successful registration', () => {
        it('should register a user successfully', () => {
            cy.visit('/register')

            cy.getBySelector('input-email').type(faker.internet.email())
            cy.getBySelector('input-password').type(faker.internet.password())

            cy.intercept('**/users/register', { fixture: 'authSuccess.json' })
            cy.getBySelector('button-submit').click()
            cy.url().should('endWith', '/dashboard')
        })
    })

    describe('Failed registration', () => {
        it('should not register a user when the password is required', () => {
            cy.visit('/register')

            cy.getBySelector('input-email').type(faker.internet.email())

            cy.intercept('**/users/register', {
                fixture: 'authError.json',
                statusCode: 400,
            })
            cy.getBySelector('button-submit').click()
            cy.url().should('endWith', '/register')
        })

        it('should not register a user when the password is required', () => {
            cy.visit('/register')

            cy.getBySelector('input-email').type(faker.internet.email())

            cy.intercept('**/users/register', {
                fixture: 'unexpectedError.json',
                statusCode: 500,
            })
            cy.getBySelector('button-submit').click()
            cy.getBySelector('text-error').should('exist')
        })
    })
})

import { genFakeAuthRes } from '../utils/genFake'

Cypress.Commands.add('getBySelector', selector => {
    return cy.get(`[data-cy=${selector}]`)
})

Cypress.Commands.add('logIn', () => {
    window.localStorage.setItem('user', JSON.stringify(genFakeAuthRes()))
})

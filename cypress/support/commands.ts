/// <reference types="cypress" />

Cypress.Commands.add('getBySelector', selector => {
    return cy.get(`[data-cy=${selector}]`)
})

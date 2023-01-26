declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to select DOM element by data-cy attribute.
             * @example cy.getBySelector('greeting')
             */
            getBySelector(value: string): Chainable<JQuery<HTMLElement>>
            logIn(): void
        }
    }
}

export {}

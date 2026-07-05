/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      register(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
      ): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  "login",
  (
    email = Cypress.env("TEST_EMAIL"),
    password = Cypress.env("TEST_PASSWORD"),
  ) => {
    cy.visit("/account");
    cy.get("#Email").clear().type(email);
    cy.get("#Passwd").clear().type(password);
    cy.get('input[name="login"]').click();
  },
);

Cypress.Commands.add(
  "register",
  (firstName: string, lastName: string, email: string, password: string) => {
    cy.visit("/account/newAccount");
    cy.get("#FirstName").clear().type(firstName);
    cy.get("#LastName").clear().type(lastName);
    cy.get("#Email").clear().type(email);
    cy.get("#Passwd").clear().type(password);
    cy.get("#PasswdAgain").clear().type(password);
    cy.get("#submitbutton").click();
  },
);

export {};

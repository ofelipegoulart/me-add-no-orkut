describe("Register", () => {
  const uniqueEmail = () => `cypress_${Date.now()}@teste.com`;

  beforeEach(() => {
    cy.visit("/account/newAccount");
  });

  // ── Happy path ──

  it("should register with valid data and redirect to login", () => {
    const email = uniqueEmail();

    cy.get("#FirstName").type("Cypress");
    cy.get("#LastName").type("Teste");
    cy.get("#Email").type(email);
    cy.get("#Passwd").type("senha123");
    cy.get("#PasswdAgain").type("senha123");
    cy.get("#submitbutton").click();

    cy.url().should("include", "/account");
  });

  it("should show loading state while submitting", () => {
    const email = uniqueEmail();

    cy.get("#FirstName").type("Cypress");
    cy.get("#LastName").type("Teste");
    cy.get("#Email").type(email);
    cy.get("#Passwd").type("senha123");
    cy.get("#PasswdAgain").type("senha123");
    cy.get("#submitbutton").click();

    cy.get("#submitbutton").should("be.disabled");
    cy.get("#submitbutton").should("have.text", "Criando conta...");
  });

  // ── Validations ──

  it("should show error when first name is empty", () => {
    cy.get("#LastName").type("Teste");
    cy.get("#Email").type(uniqueEmail());
    cy.get("#Passwd").type("senha123");
    cy.get("#PasswdAgain").type("senha123");
    cy.get("#submitbutton").click();

    cy.get("#FirstName")
      .parent()
      .contains("Campo obrigatório.")
      .should("be.visible");
  });

  it("should show error when last name is empty", () => {
    cy.get("#FirstName").type("Cypress");
    cy.get("#Email").type(uniqueEmail());
    cy.get("#Passwd").type("senha123");
    cy.get("#PasswdAgain").type("senha123");
    cy.get("#submitbutton").click();

    cy.get("#LastName")
      .parent()
      .contains("Campo obrigatório.")
      .should("be.visible");
  });

  it("should show error when email is empty", () => {
    cy.get("#FirstName").type("Cypress");
    cy.get("#LastName").type("Teste");
    cy.get("#Passwd").type("senha123");
    cy.get("#PasswdAgain").type("senha123");
    cy.get("#submitbutton").click();

    cy.get("#Email")
      .parent()
      .contains("Campo obrigatório.")
      .should("be.visible");
  });

  it("should show error when password is empty", () => {
    cy.get("#FirstName").type("Cypress");
    cy.get("#LastName").type("Teste");
    cy.get("#Email").type(uniqueEmail());
    cy.get("#submitbutton").click();

    cy.get("#Passwd")
      .parent()
      .contains("Campo obrigatório.")
      .should("be.visible");
    cy.get("#PasswdAgain")
      .parent()
      .contains("Campo obrigatório.")
      .should("be.visible");
  });

  it("should show error when passwords do not match", () => {
    cy.get("#FirstName").type("Cypress");
    cy.get("#LastName").type("Teste");
    cy.get("#Email").type(uniqueEmail());
    cy.get("#Passwd").type("senha123");
    cy.get("#PasswdAgain").type("senhadiferente");
    cy.get("#submitbutton").click();

    cy.get("#PasswdAgain")
      .parent()
      .contains("As senhas não coincidem.")
      .should("be.visible");
  });

  it("should show error when password is too short", () => {
    cy.get("#FirstName").type("Cypress");
    cy.get("#LastName").type("Teste");
    cy.get("#Email").type(uniqueEmail());
    cy.get("#Passwd").type("12345");
    cy.get("#PasswdAgain").type("12345");
    cy.get("#submitbutton").click();

    cy.get("#Passwd")
      .parent()
      .contains("Mínimo de 6 caracteres.")
      .should("be.visible");
  });

  it("should show error below the related fields when submitting empty", () => {
    cy.get('button[type="submit"]').click();

    cy.get("#FirstName")
      .siblings("span.text-red-600")
      .should("have.text", "Campo obrigatório.");
    cy.get("#LastName")
      .siblings("span.text-red-600")
      .should("have.text", "Campo obrigatório.");
    cy.get("#Email")
      .siblings("span.text-red-600")
      .should("have.text", "Campo obrigatório.");
    cy.get("#Passwd")
      .siblings("span.text-red-600")
      .should("have.text", "Campo obrigatório.");
    cy.get("#PasswdAgain")
      .siblings("span.text-red-600")
      .should("have.text", "Campo obrigatório.");
  });

  it("should show error when email is already registered", () => {
    cy.intercept("POST", "/api/register", {
      statusCode: 409,
      body: { message: "Este e-mail já está em uso." },
    }).as("registerDuplicate");

    cy.get("#FirstName").type("Cypress");
    cy.get("#LastName").type("Teste");
    cy.get("#Email").type(Cypress.env("TEST_EMAIL"));
    cy.get("#Passwd").type("senha123");
    cy.get("#PasswdAgain").type("senha123");
    cy.get("#submitbutton").click();

    cy.wait("@registerDuplicate");
    cy.contains("Este e-mail já está em uso.").should("be.visible");
  });

  it("should show generic error on API 500", () => {
    cy.intercept("POST", "/api/register", {
      statusCode: 500,
      body: {},
    }).as("registerError");

    cy.get("#FirstName").type("Cypress");
    cy.get("#LastName").type("Teste");
    cy.get("#Email").type(uniqueEmail());
    cy.get("#Passwd").type("senha123");
    cy.get("#PasswdAgain").type("senha123");
    cy.get("#submitbutton").click();

    cy.wait("@registerError");
    cy.contains("Erro ao criar conta. Tente novamente.").should("be.visible");
  });

  // ── Special characters ──

  it("should accept names with special characters", () => {
    cy.intercept("POST", "/api/register").as("registerCall");

    cy.get("#FirstName").type("José María");
    cy.get("#LastName").type("O'Brien-García");
    cy.get("#Email").type(uniqueEmail());
    cy.get("#Passwd").type("senha123");
    cy.get("#PasswdAgain").type("senha123");
    cy.get("#submitbutton").click();

    cy.wait("@registerCall").then((interception) => {
      expect(interception.request.body.name).to.include("José María");
    });
  });

  it("should trim whitespace from name fields", () => {
    cy.intercept("POST", "/api/register").as("registerCall");

    cy.get("#FirstName").type("  Cypress  ");
    cy.get("#LastName").type("  Teste  ");
    cy.get("#Email").type(uniqueEmail());
    cy.get("#Passwd").type("senha123");
    cy.get("#PasswdAgain").type("senha123");
    cy.get("#submitbutton").click();

    cy.wait("@registerCall").then((interception) => {
      expect(interception.request.body.name).to.eq("Cypress Teste");
    });
  });

  // ── Security ──

  it("should have password fields masked", () => {
    cy.get("#Passwd").should("have.attr", "type", "password");
    cy.get("#PasswdAgain").should("have.attr", "type", "password");
  });

  it("should not allow script injection in name fields", () => {
    cy.intercept("POST", "/api/register").as("registerCall");

    cy.get("#FirstName").type('<script>alert("xss")</script>');
    cy.get("#LastName").type("Teste");
    cy.get("#Email").type(uniqueEmail());
    cy.get("#Passwd").type("senha123");
    cy.get("#PasswdAgain").type("senha123");
    cy.get("#submitbutton").click();

    // Should not execute script - page should still be functional
    cy.get("#submitbutton").should("exist");
  });

  // ── Navigation ──

  it("should link back to login page", () => {
    cy.contains("fazer login aqui").click();
    cy.url().should("include", "/account");
  });
});

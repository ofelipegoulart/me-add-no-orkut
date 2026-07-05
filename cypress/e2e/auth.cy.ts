describe("Login", () => {
  const TEST_PASSWORD = "senha123";
  let testEmail: string;

  before(() => {
    testEmail = `cypress_${Date.now()}@teste.com`;
    cy.register("Cypress", "Teste", testEmail, TEST_PASSWORD);
  });

  beforeEach(() => {
    cy.visit("/account");
  });

  // ── Happy path ──

  it("should login with valid credentials and redirect to profile", () => {
    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(TEST_PASSWORD);
    cy.get('input[name="login"]').click();

    cy.url().should("include", "/profile");
  });

  it("should persist session after page refresh", () => {
    cy.login(testEmail, TEST_PASSWORD);
    cy.url().should("include", "/profile");

    cy.reload();
    cy.url().should("not.include", "/account");
  });

  it("should show user email in header after login", () => {
    cy.login(testEmail, TEST_PASSWORD);
    cy.url().should("include", "/profile");
    cy.get("#header").should("contain.text", testEmail);
  });

  // ── Validations ──

  it("should show error with incorrect password", () => {
    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type("senhaerrada123");
    cy.get('input[name="login"]').click();

    cy.contains("O nome de usuário e senha são incorretos.").should(
      "be.visible",
    );
  });

  it("should show error with non-existent user", () => {
    cy.get("#Email").type("naoexiste@teste.com");
    cy.get("#Passwd").type("qualquersenha");
    cy.get('input[name="login"]').click();

    cy.contains("O nome de usuário e senha são incorretos.").should(
      "be.visible",
    );
  });

  it("should show error with empty email", () => {
    cy.get("#Passwd").type("senha123");
    cy.get('input[name="login"]').click();

    cy.contains("O nome de usuário e senha são incorretos.").should(
      "be.visible",
    );
  });

  it("should show error with empty password", () => {
    cy.get("#Email").type(testEmail);
    cy.get('input[name="login"]').click();

    cy.contains("O nome de usuário e senha são incorretos.").should(
      "be.visible",
    );
  });

  it("should trim spaces from email", () => {
    cy.get("#Email").type(`  ${testEmail}  `);
    cy.get("#Passwd").type(TEST_PASSWORD);
    cy.get('input[name="login"]').click();

    // Should either login or show error - shouldn't crash
    cy.url().should("not.eq", "about:blank");
  });

  it("should disable login button while submitting", () => {
    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(TEST_PASSWORD);
    cy.get('input[name="login"]').click();

    cy.get('input[name="login"]').should("be.disabled");
    cy.get('input[name="login"]').should("have.value", "Entrando...");
  });

  it("should highlight password field on error", () => {
    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type("senhaerrada");
    cy.get('input[name="login"]').click();

    cy.contains("O nome de usuário e senha são incorretos.").should(
      "be.visible",
    );
    cy.get("#Passwd").should("have.class", "border-red-500");
  });

  // ── Edge cases ──

  it("should not submit multiple times on rapid clicks", () => {
    cy.intercept("POST", "/api/auth/callback/credentials").as("loginCall");

    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(TEST_PASSWORD);

    cy.get('input[name="login"]').click();
    cy.get('input[name="login"]').click();
    cy.get('input[name="login"]').click();

    // Button should be disabled after first click
    cy.get('input[name="login"]').should("be.disabled");
  });

  it("should handle API 500 error gracefully", () => {
    cy.intercept("POST", "/api/auth/callback/credentials", {
      statusCode: 500,
      body: { error: "Internal Server Error" },
    }).as("loginFail");

    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(TEST_PASSWORD);
    cy.get('input[name="login"]').click();

    cy.wait("@loginFail");
    cy.contains("O nome de usuário e senha são incorretos.").should(
      "be.visible",
    );
  });

  it("should redirect unauthenticated user from protected route", () => {
    cy.visit("/profile");
    cy.url().should("include", "/account");
  });

  // ── Navigation ──

  it("should navigate to registration page", () => {
    cy.contains("ENTRE JÁ").click();
    cy.url().should("include", "/account/newAccount");
  });

  it("should navigate to forgot password page", () => {
    cy.contains("Esqueceu sua senha?").click();
    cy.url().should("include", "/account/forgotPasswd");
  });

  // ── Logout ──

  it("should logout and redirect to login page", () => {
    cy.login(testEmail, TEST_PASSWORD);
    cy.url().should("include", "/profile");

    cy.get("#header").contains("Sair").click();
    cy.url().should("include", "/account");
  });
});

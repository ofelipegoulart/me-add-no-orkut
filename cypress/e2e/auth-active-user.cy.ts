describe("Auth - Active User Login", () => {
  const envEmail = Cypress.env("ACTIVE_USER_EMAIL");
  const envPassword = Cypress.env("ACTIVE_USER_PASSWORD");
  const testEmail = envEmail || `cypress_${Date.now()}@teste.com`;
  const testPassword = envPassword || "senha123";
  const isExistingActiveUser = Boolean(envEmail && envPassword);

  before(() => {
    if (isExistingActiveUser) {
      // Use a pre-existing active user account from environment.
      return;
    }

    // Register and complete onboarding for an active user
    cy.visit("/account/newAccount");
    cy.get("#FirstName").type("Cypress");
    cy.get("#LastName").type("Ativo");
    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(testPassword);
    cy.get("#PasswdAgain").type(testPassword);
    cy.get("#submitbutton").click();

    // Login and complete SignUp
    cy.visit("/account");
    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(testPassword);
    cy.get('input[name="login"]').click();

    // Complete onboarding
    cy.url().should("include", "/SignUp");
    cy.get('input[type="number"]').first().clear().type("15");
    cy.get('select').first().select("4");
    cy.get('input[placeholder="ano"]').type("1990");
    cy.contains("masculino").click();
    cy.get('input[type="checkbox"]').check();
    cy.contains("tudo certo, pode criar minha conta!").click();

    // Now the user is ready - logout for clean state
    cy.visit("/profile");
    cy.get("#header").contains("Sair").click();
  });

  beforeEach(() => {
    cy.visit("/account");
  });

  // ── Happy path ──

  it("should login with valid credentials and redirect to profile", () => {
    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(testPassword);
    cy.get('input[name="login"]').click();

    cy.url().should("include", "/profile");
  });

  it("should persist session after page refresh", () => {
    cy.login(testEmail, testPassword);
    cy.url().should("include", "/profile");

    cy.reload();
    cy.url().should("not.include", "/account");
  });

  it("should show user email in header after login", () => {
    cy.login(testEmail, testPassword);
    cy.url().should("include", "/profile");
    cy.get("#header").should("contain.text", testEmail);
  });

  it("should bypass SignUp and go directly to profile", () => {
    cy.login(testEmail, testPassword);

    // Should NOT see SignUp page
    cy.url().should("not.include", "/SignUp");
    cy.url().should("include", "/profile");
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
    cy.get("#Email").clear();
    cy.get("#Passwd").type("senha123");
    cy.get('input[name="login"]').as("loginButton").click();

    cy.contains("O nome de usuário e senha são incorretos.").should(
      "be.visible",
    );
  });

  it("should show error with empty password", () => {
    cy.get("#Email").clear().type(testEmail);
    cy.get("#Passwd").clear();
    cy.get('input[name="login"]').as("loginButton").click();

    cy.contains("O nome de usuário e senha são incorretos.").should(
      "be.visible",
    );
  });

  it("should trim spaces from email", () => {
    cy.get("#Email").type(`  ${testEmail}  `);
    cy.get("#Passwd").type(testPassword);
    cy.get('input[name="login"]').click();

    // Should either login or show error - shouldn't crash
    cy.url().should("not.eq", "about:blank");
  });

  it("should disable login button while submitting", () => {
    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(testPassword);
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

  it("should disable the login button after first submit", () => {
    let loginCount = 0;

    cy.intercept(
      { method: "POST", url: "/api/auth/callback/credentials" },
      (req) => {
        loginCount += 1;
        req.continue();
      },
    ).as("loginCall");

    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(testPassword);
    cy.get('input[name="login"]').click();

    cy.get('input[name="login"]').should("be.disabled");
    cy.wait("@loginCall").then(() => {
      expect(loginCount).to.eq(1);
    });
  });

  it("should handle API 500 error gracefully", () => {
    cy.intercept(
      { method: "POST", url: /\/api\/auth\/callback\/credentials(\?.*)?$/ },
      {
        statusCode: 500,
        body: { error: "Internal Server Error" },
      },
    ).as("loginFail");

    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(testPassword);
    cy.get('input[name="login"]').click();

    cy.wait("@loginFail", { timeout: 10000 });
    cy.contains("O nome de usuário e senha são incorretos.").should(
      "be.visible",
    );
    cy.url().should("include", "/account");
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
    cy.login(testEmail, testPassword);
    cy.url().should("include", "/profile");

    cy.get("#header").contains("Sair").click();
    cy.url().should("include", "/account");
  });

  it("should show correct user info after logout and login again", () => {
    cy.login(testEmail, testPassword);
    cy.get("#header").should("contain.text", testEmail);

    cy.get("#header").contains("Sair").click();
    cy.url().should("include", "/account");

    cy.login(testEmail, testPassword);
    cy.get("#header").should("contain.text", testEmail);
  });
});

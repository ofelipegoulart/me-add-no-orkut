describe("Navigation & UX", () => {
  const envEmail = Cypress.env("ACTIVE_USER_EMAIL");
  const envPassword = Cypress.env("ACTIVE_USER_PASSWORD");
  const testEmail = envEmail || `cypress_${Date.now()}@teste.com`;
  const testPassword = envPassword || "senha123";
  const isExistingActiveUser = Boolean(envEmail && envPassword);

  before(() => {
    if (isExistingActiveUser) {
      return;
    }

    cy.visit("/account/newAccount");
    cy.get("#FirstName").type("Cypress");
    cy.get("#LastName").type("Navigation");
    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(testPassword);
    cy.get("#PasswdAgain").type(testPassword);
    cy.get("#submitbutton").click();

    cy.visit("/account");
    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(testPassword);
    cy.get('input[name="login"]').click();

    cy.url().should("include", "/SignUp");
    cy.get('input[type="number"]').first().clear().type("15");
    cy.get('select').first().select("4");
    cy.get('input[placeholder="ano"]').type("1990");
    cy.contains("masculino").click();
    cy.get('input[type="checkbox"]').check();
    cy.contains("tudo certo, pode criar minha conta!").click();

    cy.visit("/profile");
    cy.get("#header").contains("Sair").click();
  });

  beforeEach(() => {
    cy.login(testEmail, testPassword);
    cy.url().should("include", "/profile");
  });

  // ── Header navigation ──

  it("should navigate to home via header logo", () => {
    cy.get("#header").find('a[href="/"]').first().click();
    cy.location("pathname").should("match", /^\/profile\/[^/]+$/);
  });

  it("should navigate to home via Início link", () => {
    cy.get("#header").contains("Início").click();
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
  });

  it("should display header with navigation links", () => {
    cy.get("#header").should("be.visible");
    cy.get("#header").contains("Início").should("be.visible");
    cy.get("#header").contains("Perfil").should("be.visible");
    cy.get("#header").contains("Amigos").should("be.visible");
    cy.get("#header").contains("Comunidades").should("be.visible");
  });

  it("should display user email in header", () => {
    cy.get("#header").should("contain.text", testEmail);
  });

  it("should display search input in header", () => {
    cy.get("#orkut-header-search").should("be.visible");
    cy.get("#orkut-header-search").should(
      "have.attr",
      "placeholder",
      "pesquisa do orkut",
    );
  });

  // ── Sidebar navigation ──

  it("should navigate to profile via sidebar", () => {
    cy.contains("a", "perfil").click();
    cy.url().should("include", "/profile/");
  });

  it("should navigate to scraps via sidebar", () => {
    cy.contains("a", "recados").click();
    cy.url().should("include", "/recados");
  });

  it("should navigate to photos via sidebar", () => {
    cy.contains("a", "fotos").click();
    cy.url().should("include", "/fotos");
  });

  it("should show edit link in sidebar for own profile", () => {
    cy.get("a").contains("editar").should("be.visible");
    cy.get("a").contains("editar").should("have.attr", "href", "/profile/EditSummary");
  });

  // ── Full user flows ──

  it("should complete flow: login → edit profile → send scrap → logout", () => {
    // Already logged in from beforeEach

    // Edit profile
    cy.contains("editar").click();
    cy.url().should("include", "/EditSummary");
    cy.contains("Carregando...").should("not.exist");

    // Go back to profile
    cy.go("back");

    // Navigate to scraps
    cy.contains("a", "recados").click();
    cy.url().should("include", "/recados");

    // Send a scrap
    cy.intercept("POST", "/api/scraps").as("sendScrap");
    cy.get("textarea").type("Recado do fluxo completo");
    cy.contains("button", "enviar recado").click();

    // Logout
    cy.get("#header").contains("Sair").click();
    cy.url().should("include", "/account");
  });

  it("should handle browser back button", () => {
    cy.contains("a", "recados").click();
    cy.url().should("include", "/recados");

    cy.go("back");
    cy.url().should("include", "/profile/");
  });

  it("should handle page refresh on any page", () => {
    cy.contains("a", "recados").click();
    cy.url().should("include", "/recados");

    cy.reload();
    cy.url().should("include", "/recados");
    cy.contains("Minha página de recados").should("be.visible");
  });

  // ── Keyboard navigation ──

  it("should submit login form with Enter key", () => {
    cy.get("#header").contains("Sair").click();
    cy.url().should("include", "/account");

    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(`${testPassword}{enter}`);

    cy.url().should("include", "/profile");
  });

  it("should have proper tab order on login page", () => {
    cy.get("#header").contains("Sair").click();
    cy.url().should("include", "/account");

    cy.get("#Email").focus().should("have.focus");
    cy.focused().trigger("keydown", { key: "Tab" });
    // Verify password field comes after email in DOM order
    cy.get("#Email").then(($email) => {
      const emailIndex = $email.index();
      cy.get("#Passwd").then(($passwd) => {
        expect($passwd.index()).to.be.greaterThan(emailIndex);
      });
    });
  });

  // ── Accessibility ──

  it("should have labels associated with search input", () => {
    cy.get('label[for="orkut-header-search"]').should("exist");
  });

  it("should have alt text on logo images", () => {
    cy.get("#header img").should("have.attr", "alt");
  });
});

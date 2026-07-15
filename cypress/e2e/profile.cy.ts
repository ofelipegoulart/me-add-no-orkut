describe("Edit Profile", () => {
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
    cy.get("#LastName").type("Profile");
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

    cy.visit("/Profile");
    cy.get("#header").contains("Sair").click();
  });

  beforeEach(() => {
    cy.login(testEmail, testPassword);
    cy.url().should("include", "/Profile");
  });

  // ── Happy path ──

  it("should navigate to edit profile page", () => {
    cy.contains("editar").click();
    cy.url().should("include", "/EditSummary");
    cy.contains("Editar perfil").should("be.visible");
  });

  it("should load edit profile with existing data", () => {
    cy.contains("editar").click();

    // Wait for loading to finish
    cy.contains("Carregando...").should("not.exist");
    cy.get('input[name="firstName"]').should("exist");
  });

  it("should update first name and save", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.intercept("PATCH", "/api/profile/general").as("saveGeneral");

    cy.get('input[name="firstName"]').clear().type("NomeAtualizado");
    cy.contains("button", "atualizar").click();

    cy.wait("@saveGeneral").its("response.statusCode").should("be.oneOf", [200, 204]);
  });

  it("should update city and save", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.intercept("PATCH", "/api/profile/general").as("saveGeneral");

    cy.get('input[name="city"]').clear().type("São Paulo");
    cy.contains("button", "atualizar").click();

    cy.wait("@saveGeneral");
  });

  it("should update relationship status", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.intercept("PATCH", "/api/profile/general").as("saveGeneral");

    cy.get('select[name="relationshipStatus"]').select("namorando");
    cy.contains("button", "atualizar").click();

    cy.wait("@saveGeneral");
  });

  it("should persist changes after page refresh", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.intercept("PATCH", "/api/profile/general").as("saveGeneral");

    const cityName = `Cidade${Date.now()}`;
    cy.get('input[name="city"]').clear().type(cityName);
    cy.contains("button", "atualizar").click();
    cy.wait("@saveGeneral");

    cy.reload();
    cy.contains("Carregando...").should("not.exist");
    cy.get('input[name="city"]').should("have.value", cityName);
  });

  // ── Tab navigation ──

  it("should switch between profile tabs", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.contains("button", "social").click();
    cy.get('textarea[name="aboutMe"]').should("exist");

    cy.contains("button", "contato").click();
    cy.get('input[name="primaryEmail"]').should("exist");

    cy.contains("button", "profissional").click();
    cy.get('input[name="profession"]').should("exist");

    cy.contains("button", "pessoal").click();
    cy.get('select[name="eyeColor"]').should("exist");

    cy.contains("button", "geral").click();
    cy.get('input[name="firstName"]').should("exist");
  });

  it("should update social tab about me", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.contains("button", "social").click();
    cy.intercept("PATCH", "/api/profile/social").as("saveSocial");

    cy.get('textarea[name="aboutMe"]').clear().type("Olá, eu sou um teste do Cypress!");
    cy.contains("button", "atualizar").click();

    cy.wait("@saveSocial");
  });

  it("should cancel changes and revert to original values", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.get('input[name="firstName"]').invoke("val").then((originalValue) => {
      cy.get('input[name="firstName"]').clear().type("ValorTemporario");
      cy.contains("button", "cancelar").click();

      cy.get('input[name="firstName"]').should("have.value", originalValue);
    });
  });

  // ── Validations ──

  it("should show error when first name is empty", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.get('input[name="firstName"]').clear();
    cy.contains("button", "atualizar").click();

    cy.contains("Este campo é obrigatório.").should("be.visible");
  });

  it("should show error when last name is empty", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.get('input[name="lastName"]').clear();
    cy.contains("button", "atualizar").click();

    cy.contains("Este campo é obrigatório.").should("be.visible");
  });

  it("should show saving state on update button", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.intercept("PATCH", "/api/profile/general", (req) => {
      req.reply({ delay: 1000, statusCode: 200, body: {} });
    }).as("slowSave");

    cy.get('input[name="city"]').clear().type("Teste");
    cy.contains("button", "atualizar").click();

    cy.contains("button", "salvando...").should("be.visible");
    cy.contains("button", "salvando...").should("be.disabled");
  });

  // ── Special characters ──

  it("should accept emojis in text fields", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.contains("button", "social").click();
    cy.intercept("PATCH", "/api/profile/social").as("saveSocial");

    cy.get('textarea[name="aboutMe"]').clear().type("Olá! 😊🎉🌟");
    cy.contains("button", "atualizar").click();

    cy.wait("@saveSocial").then((interception) => {
      expect(interception.request.body.aboutMe).to.include("😊");
    });
  });

  it("should accept line breaks in textarea fields", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.contains("button", "social").click();
    cy.intercept("PATCH", "/api/profile/social").as("saveSocial");

    cy.get('textarea[name="aboutMe"]').clear().type("Linha 1{enter}Linha 2{enter}Linha 3");
    cy.contains("button", "atualizar").click();

    cy.wait("@saveSocial").then((interception) => {
      expect(interception.request.body.aboutMe).to.include("\n");
    });
  });

  // ── Security ──

  it("should not execute script tags in text fields", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.contains("button", "social").click();

    cy.get('textarea[name="aboutMe"]')
      .clear()
      .type('<script>alert("xss")</script>');
    cy.contains("button", "atualizar").click();

    // Page should remain functional
    cy.get('textarea[name="aboutMe"]').should("exist");
    cy.on("window:alert", () => {
      throw new Error("XSS alert was triggered!");
    });
  });

  it("should not render HTML in text fields", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.contains("button", "social").click();

    cy.get('textarea[name="aboutMe"]')
      .clear()
      .type('<img src=x onerror="alert(1)">');
    cy.contains("button", "atualizar").click();

    cy.on("window:alert", () => {
      throw new Error("XSS via onerror was triggered!");
    });
  });

  // ── Error handling ──

  it("should show error on save failure", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.intercept("PATCH", "/api/profile/general", {
      statusCode: 500,
      body: {},
    }).as("saveFail");

    cy.get('input[name="city"]').clear().type("Teste");
    cy.contains("button", "atualizar").click();

    cy.wait("@saveFail");
    cy.contains("Erro ao salvar. Tente novamente.").should("be.visible");
  });

  it("should show connection error message", () => {
    cy.contains("editar").click();
    cy.contains("Carregando...").should("not.exist");

    cy.intercept("PATCH", "/api/profile/general", { forceNetworkError: true }).as("networkError");

    cy.get('input[name="city"]').clear().type("Teste");
    cy.contains("button", "atualizar").click();

    cy.contains("Erro de conexão. Tente novamente.").should("be.visible");
  });
});

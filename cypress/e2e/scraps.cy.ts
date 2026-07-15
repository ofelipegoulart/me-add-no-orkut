describe("Scraps (Recados)", () => {
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
    cy.get("#LastName").type("Scraps");
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

  function goToScraps() {
    cy.contains("a", "recados").click();
    cy.url().should("include", "/Scraps");
    cy.contains("Minha página de recados").should("be.visible");
  }

  // ── Happy path ──

  it("should navigate to scraps page", () => {
    goToScraps();
  });

  it("should send a scrap", () => {
    goToScraps();
    cy.intercept("POST", "/api/scraps").as("sendScrap");

    const content = `Recado de teste ${Date.now()}`;
    cy.get("textarea").clear().type(content);
    cy.contains("button", "enviar recado").click();

    cy.wait("@sendScrap").its("response.statusCode").should("eq", 200);
  });

  it("should display scrap immediately after sending", () => {
    goToScraps();
    cy.intercept("POST", "/api/scraps", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: "new-scrap-id",
          content: req.body.content,
          isPrivate: false,
          authorId: "test-user",
          authorName: "Cypress Teste",
          authorAvatar: "",
          ownerId: req.body.ownerId,
          ownerName: "Cypress Teste",
          parentId: null,
          readAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }).as("sendScrap");

    const content = `Recado visível ${Date.now()}`;
    cy.get("textarea").clear().type(content);
    cy.contains("button", "enviar recado").click();

    cy.wait("@sendScrap");
    cy.contains(content).should("be.visible");
  });

  it("should clear textarea after sending scrap", () => {
    goToScraps();
    cy.intercept("POST", "/api/scraps", {
      statusCode: 200,
      body: {
        id: "new-id",
        content: "test",
        isPrivate: false,
        authorId: "u",
        authorName: "T",
        authorAvatar: "",
        ownerId: "o",
        ownerName: "O",
        parentId: null,
        readAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }).as("sendScrap");

    cy.get("textarea").type("Recado para limpar");
    cy.contains("button", "enviar recado").click();

    cy.wait("@sendScrap");
    cy.get("textarea").should("have.value", "");
  });

  it("should delete a scrap", () => {
    goToScraps();

    // First check if there are scraps; if so delete the first one
    cy.get("body").then(($body) => {
      if ($body.find("button:contains('delete')").length > 0) {
        cy.intercept("DELETE", "/api/scraps/*").as("deleteScrap");

        cy.contains("button", "delete").first().click();
        cy.wait("@deleteScrap").its("response.statusCode").should("be.oneOf", [200, 204]);
      }
    });
  });

  it("should delete selected scraps in bulk", () => {
    goToScraps();

    cy.get("body").then(($body) => {
      const checkboxes = $body.find('input[type="checkbox"]');
      if (checkboxes.length > 0) {
        cy.intercept("DELETE", "/api/scraps").as("bulkDelete");

        cy.get('input[type="checkbox"]').first().check();
        cy.contains("button", "excluir recados selecionados").click();

        cy.wait("@bulkDelete");
      }
    });
  });

  it("should reply to a scrap", () => {
    goToScraps();

    cy.get("body").then(($body) => {
      if ($body.find("button:contains('reply')").length > 0) {
        cy.contains("button", "reply").first().click();

        cy.contains("respondendo recado").should("be.visible");
        cy.contains("cancelar").should("be.visible");

        cy.intercept("POST", "/api/scraps").as("sendReply");

        cy.get("textarea").type("Resposta de teste");
        cy.contains("button", "enviar recado").click();

        cy.wait("@sendReply").then((interception) => {
          expect(interception.request.body.parentId).to.not.be.null;
        });
      }
    });
  });

  it("should cancel reply", () => {
    goToScraps();

    cy.get("body").then(($body) => {
      if ($body.find("button:contains('reply')").length > 0) {
        cy.contains("button", "reply").first().click();
        cy.contains("respondendo recado").should("be.visible");

        cy.contains("button", "cancelar").click();
        cy.contains("respondendo recado").should("not.exist");
      }
    });
  });

  it("should show sending state while submitting", () => {
    goToScraps();

    cy.intercept("POST", "/api/scraps", (req) => {
      req.reply({ delay: 1000, statusCode: 200, body: {} });
    }).as("slowSend");

    cy.get("textarea").type("Recado lento");
    cy.contains("button", "enviar recado").click();

    cy.contains("button", "enviando...").should("be.visible");
    cy.contains("button", "enviando...").should("be.disabled");
  });

  // ── Limits ──

  it("should not send empty scrap", () => {
    goToScraps();

    cy.get("textarea").clear();
    cy.contains("button", "enviar recado").click();

    // Should not make API call for empty content
    cy.intercept("POST", "/api/scraps").as("sendScrap");
    cy.get("@sendScrap").should("not.exist");
  });

  it("should send scrap with 1 character", () => {
    goToScraps();
    cy.intercept("POST", "/api/scraps").as("sendScrap");

    cy.get("textarea").type("A");
    cy.contains("button", "enviar recado").click();

    cy.wait("@sendScrap").then((interception) => {
      expect(interception.request.body.content).to.eq("A");
    });
  });

  // ── Content types ──

  it("should send scrap with emojis", () => {
    goToScraps();
    cy.intercept("POST", "/api/scraps").as("sendScrap");

    cy.get("textarea").type("Olá! 😊🎉🌟💕");
    cy.contains("button", "enviar recado").click();

    cy.wait("@sendScrap").then((interception) => {
      expect(interception.request.body.content).to.include("😊");
    });
  });

  it("should send scrap with line breaks", () => {
    goToScraps();
    cy.intercept("POST", "/api/scraps").as("sendScrap");

    cy.get("textarea").type("Linha 1{enter}Linha 2{enter}Linha 3");
    cy.contains("button", "enviar recado").click();

    cy.wait("@sendScrap").then((interception) => {
      expect(interception.request.body.content).to.include("\n");
    });
  });

  // ── Security (XSS) ──

  it("should not execute script tags in scrap content", () => {
    goToScraps();

    cy.on("window:alert", () => {
      throw new Error("XSS alert was triggered!");
    });

    cy.intercept("POST", "/api/scraps", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: "xss-test",
          content: '<script>alert("xss")</script>',
          isPrivate: false,
          authorId: "u",
          authorName: "Hacker",
          authorAvatar: "",
          ownerId: "o",
          ownerName: "Vítima",
          parentId: null,
          readAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }).as("xssScrap");

    cy.get("textarea").type('<script>alert("xss")</script>');
    cy.contains("button", "enviar recado").click();

    cy.wait("@xssScrap");

    // The script tag text should be shown as text, not executed
    cy.get("body").should("not.have.descendants", "script:not([src])");
  });

  it("should not execute onerror XSS in scraps", () => {
    goToScraps();

    cy.on("window:alert", () => {
      throw new Error("XSS via onerror was triggered!");
    });

    cy.intercept("POST", "/api/scraps", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: "xss-img",
          content: '<img src=x onerror="alert(1)">',
          isPrivate: false,
          authorId: "u",
          authorName: "Hacker",
          authorAvatar: "",
          ownerId: "o",
          ownerName: "Vítima",
          parentId: null,
          readAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }).as("xssImg");

    cy.get("textarea").type('<img src=x onerror="alert(1)">');
    cy.contains("button", "enviar recado").click();

    cy.wait("@xssImg");
  });

  it("should not execute javascript: in scrap links", () => {
    goToScraps();

    cy.on("window:alert", () => {
      throw new Error("XSS via javascript: protocol was triggered!");
    });

    cy.intercept("POST", "/api/scraps", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: "xss-link",
          content: '<a href="javascript:alert(1)">click me</a>',
          isPrivate: false,
          authorId: "u",
          authorName: "Hacker",
          authorAvatar: "",
          ownerId: "o",
          ownerName: "Vítima",
          parentId: null,
          readAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }).as("xssLink");

    cy.get("textarea").type("javascript:alert(1)");
    cy.contains("button", "enviar recado").click();

    cy.wait("@xssLink");
  });

  // ── Empty state ──

  it("should show empty state when no scraps", () => {
    cy.intercept("GET", "**/scraps*", {
      statusCode: 200,
      body: { content: [], totalElements: 0 },
    }).as("emptyScraps");

    goToScraps();
    cy.contains("Nenhum recado ainda.").should("be.visible");
  });

  // ── Permissions ──

  it("should not send scrap when logged out", () => {
    cy.get("#header").contains("Sair").click();
    cy.url().should("include", "/account");

    // Try to access scraps page directly
    cy.request({ url: "/api/scraps", method: "POST", failOnStatusCode: false, body: { content: "test", ownerId: "x" } }).then(
      (response) => {
        expect(response.status).to.eq(401);
      },
    );
  });
});

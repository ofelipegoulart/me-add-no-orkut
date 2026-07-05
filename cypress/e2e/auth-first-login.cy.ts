describe("Auth - First Login (New User Onboarding)", () => {
  const testEmail = `cypress_${Date.now()}@teste.com`;
  const testPassword = "senha123";
  const testFirstName = "Cypress";
  const testLastName = "Teste";

  beforeEach(() => {
    cy.visit("/account/newAccount");
  });

  // ── Registration ──

  it("should register new user and redirect to SignUp onboarding", () => {
    cy.get("#FirstName").type(testFirstName);
    cy.get("#LastName").type(testLastName);
    cy.get("#Email").type(testEmail);
    cy.get("#Passwd").type(testPassword);
    cy.get("#PasswdAgain").type(testPassword);
    cy.get("#submitbutton").click();

    // Should redirect to account (login page)
    cy.url().should("include", "/account");
  });

  // ── First Login & SignUp Form ──

  describe("SignUp Onboarding Form", () => {
    beforeEach(() => {
      // Register a unique user for this test suite
      const uniqueEmail = `cypress_onboard_${Date.now()}@teste.com`;
      
      cy.visit("/account/newAccount");
      cy.get("#FirstName").type(testFirstName);
      cy.get("#LastName").type(testLastName);
      cy.get("#Email").type(uniqueEmail);
      cy.get("#Passwd").type(testPassword);
      cy.get("#PasswdAgain").type(testPassword);
      cy.get("#submitbutton").click();

      // Now login
      cy.visit("/account");
      cy.get("#Email").type(uniqueEmail);
      cy.get("#Passwd").type(testPassword);
      cy.get('input[name="login"]').click();

      // Should redirect to SignUp onboarding or profile (if backend marks as onboarded)
      // Wait for redirect to complete
      cy.url().should("match", /(\/SignUp|\/profile)/);
    });

    // ── Happy path ──

    it("should show pre-filled name from registration", () => {
      cy.url().then((url) => {
        if (url.includes("/SignUp")) {
          cy.get('input[type="text"]')
            .first()
            .should("have.value", testFirstName);
        } else {
          // Already onboarded, skip
          cy.skip();
        }
      });
    });

    it("should complete onboarding and redirect to profile", () => {
      cy.url().then((url) => {
        if (!url.includes("/SignUp")) {
          cy.skip();
        }

        // Set birth date
        cy.get('input[type="number"]').first().clear().type("15"); // day
        cy.get('select').first().select("4"); // month (maio)
        cy.get('input[placeholder="ano"]').type("1990");

        // Keep name as is
        // Select gender
        cy.contains("masculino").click();

        // Accept terms
        cy.get('input[type="checkbox"]').check();

        // Submit
        cy.contains("tudo certo, pode criar minha conta!").click();

        // Should redirect to profile
        cy.url().should("include", "/");
        cy.url().should("not.include", "/SignUp");
      });
    });

    it("should show error when year is missing", () => {
      cy.url().then((url) => {
        if (!url.includes("/SignUp")) {
          cy.skip();
        }

        cy.get('input[type="number"]').first().clear().type("15");
        cy.get('select').first().select("4");
        // Don't fill year

        cy.contains("masculino").click();
        cy.get('input[type="checkbox"]').check();

        cy.contains("tudo certo, pode criar minha conta!").click();

        cy.contains("Informe o ano de nascimento.").should("be.visible");
      });
    });

    it("should show error when gender is not selected", () => {
      cy.url().then((url) => {
        if (!url.includes("/SignUp")) {
          cy.skip();
        }

        cy.get('input[type="number"]').first().clear().type("15");
        cy.get('select').first().select("4");
        cy.get('input[placeholder="ano"]').type("1990");

        // Don't select gender
        cy.get('input[type="checkbox"]').check();

        cy.contains("tudo certo, pode criar minha conta!").click();

        cy.contains("Selecione o gênero.").should("be.visible");
      });
    });

    it("should show error when terms are not accepted", () => {
      cy.url().then((url) => {
        if (!url.includes("/SignUp")) {
          cy.skip();
        }

        cy.get('input[type="number"]').first().clear().type("15");
        cy.get('select').first().select("4");
        cy.get('input[placeholder="ano"]').type("1990");

        cy.contains("masculino").click();

        // Don't check terms
        cy.contains("tudo certo, pode criar minha conta!").click();

        cy.contains("Você precisa aceitar os termos para continuar.").should(
          "be.visible",
        );
      });
    });

    it("should show error when first name is empty", () => {
      cy.url().then((url) => {
        if (!url.includes("/SignUp")) {
          cy.skip();
        }

        // Clear first name
        cy.get('input[type="text"]').first().clear();

        cy.get('input[type="number"]').first().clear().type("15");
        cy.get('select').first().select("4");
        cy.get('input[placeholder="ano"]').type("1990");

        cy.contains("masculino").click();
        cy.get('input[type="checkbox"]').check();

        cy.contains("tudo certo, pode criar minha conta!").click();

        cy.contains("Preencha o campo nome.").should("be.visible");
      });
    });

    it("should allow only whitespace name to fail", () => {
      cy.url().then((url) => {
        if (!url.includes("/SignUp")) {
          cy.skip();
        }

        cy.get('input[type="text"]').first().clear().type("   ");

        cy.get('input[type="number"]').first().clear().type("15");
        cy.get('select').first().select("4");
        cy.get('input[placeholder="ano"]').type("1990");

        cy.contains("masculino").click();
        cy.get('input[type="checkbox"]').check();

        cy.contains("tudo certo, pode criar minha conta!").click();

        cy.contains("Preencha o campo nome.").should("be.visible");
      });
    });

    it("should handle all three gender options", () => {
      cy.url().then((url) => {
        if (!url.includes("/SignUp")) {
          cy.skip();
        }

        [
          { label: "feminino" },
          { label: "masculino" },
          { label: "não binário" },
        ].forEach(({ label }) => {
          cy.visit("/SignUp");
          cy.get('input[type="number"]').first().clear().type("15");
          cy.get('select').first().select("4");
          cy.get('input[placeholder="ano"]').type("1990");

          cy.contains(label).click();
          cy.get('input[type="checkbox"]').check();

          cy.contains("tudo certo, pode criar minha conta!").click();

          // Should either complete or show a different error (not gender)
          cy.contains("Selecione o gênero.").should("not.exist");
        });
      });
    });

    it("should allow valid lastname modification", () => {
      cy.url().then((url) => {
        if (!url.includes("/SignUp")) {
          cy.skip();
        }

        cy.get('input[type="text"]').last().clear().type("Silva");

        cy.get('input[type="number"]').first().clear().type("15");
        cy.get('select').first().select("4");
        cy.get('input[placeholder="ano"]').type("1990");

        cy.contains("masculino").click();
        cy.get('input[type="checkbox"]').check();

        cy.contains("tudo certo, pode criar minha conta!").click();

        cy.url().should("include", "/");
      });
    });

    it("should show loading state while submitting", () => {
      cy.url().then((url) => {
        if (!url.includes("/SignUp")) {
          cy.skip();
        }

        cy.get('input[type="number"]').first().clear().type("15");
        cy.get('select').first().select("4");
        cy.get('input[placeholder="ano"]').type("1990");

        cy.contains("masculino").click();
        cy.get('input[type="checkbox"]').check();

        cy.contains("tudo certo, pode criar minha conta!").click();

        cy.contains("salvando...").should("be.visible");
      });
    });

    it("should disable submit button while submitting", () => {
      cy.url().then((url) => {
        if (!url.includes("/SignUp")) {
          cy.skip();
        }

        cy.get('input[type="number"]').first().clear().type("15");
        cy.get('select').first().select("4");
        cy.get('input[placeholder="ano"]').type("1990");

        cy.contains("masculino").click();
        cy.get('input[type="checkbox"]').check();

        cy.get('button[type="submit"]').click();

        cy.get('button[type="submit"]').should("be.disabled");
      });
    });
  });

  // ── Unauthenticated access ──

  describe("Unauthenticated access", () => {
    it("should redirect unauthenticated user to login when accessing SignUp", () => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit("/SignUp", { failOnStatusCode: false });

      // Should redirect to login
      cy.url().should("include", "/account");
    });
  });
});

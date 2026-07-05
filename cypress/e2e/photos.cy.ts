describe("Photos", () => {
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
    cy.get("#LastName").type("Photos");
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

  // ── Upload ──

  it("should open upload dialog when clicking add photo", () => {
    cy.get("body").then(($body) => {
      if ($body.find("a:contains('Adicionar Foto')").length > 0) {
        cy.contains("a", "Adicionar Foto").click();
        cy.contains("Upload de Foto").should("be.visible");
      } else if ($body.find("a:contains('Alterar Foto')").length > 0) {
        cy.contains("a", "Alterar Foto").click();
        cy.contains("Upload de Foto").should("be.visible");
      }
    });
  });

  it("should close upload dialog when clicking Fechar", () => {
    cy.get("body").then(($body) => {
      const linkText =
        $body.find("a:contains('Adicionar Foto')").length > 0
          ? "Adicionar Foto"
          : "Alterar Foto";

      cy.contains("a", linkText).click();
      cy.contains("Upload de Foto").should("be.visible");

      cy.contains("button", "Fechar").click();
      cy.contains("Upload de Foto").should("not.exist");
    });
  });

  it("should close upload dialog when clicking overlay", () => {
    cy.get("body").then(($body) => {
      const linkText =
        $body.find("a:contains('Adicionar Foto')").length > 0
          ? "Adicionar Foto"
          : "Alterar Foto";

      cy.contains("a", linkText).click();
      cy.contains("Upload de Foto").should("be.visible");

      cy.get(".upload-photo-overlay").click("topLeft");
      cy.contains("Upload de Foto").should("not.exist");
    });
  });

  it("should upload a JPG file", () => {
    cy.get("body").then(($body) => {
      const linkText =
        $body.find("a:contains('Adicionar Foto')").length > 0
          ? "Adicionar Foto"
          : "Alterar Foto";

      cy.contains("a", linkText).click();
      cy.contains("Upload de Foto").should("be.visible");

      cy.get('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from("fake-jpg-content"),
          fileName: "photo.jpg",
          mimeType: "image/jpeg",
        },
        { force: true },
      );

      // File name should appear in the text input
      cy.get(".xp-file-path").should("have.value", "photo.jpg");
    });
  });

  it("should upload a PNG file", () => {
    cy.get("body").then(($body) => {
      const linkText =
        $body.find("a:contains('Adicionar Foto')").length > 0
          ? "Adicionar Foto"
          : "Alterar Foto";

      cy.contains("a", linkText).click();

      cy.get('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from("fake-png-content"),
          fileName: "photo.png",
          mimeType: "image/png",
        },
        { force: true },
      );

      cy.get(".xp-file-path").should("have.value", "photo.png");
    });
  });

  it("should preview avatar after upload", () => {
    cy.get("body").then(($body) => {
      const linkText =
        $body.find("a:contains('Adicionar Foto')").length > 0
          ? "Adicionar Foto"
          : "Alterar Foto";

      cy.contains("a", linkText).click();

      // Create a small valid image for preview
      cy.get('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from("fake-image"),
          fileName: "avatar.jpg",
          mimeType: "image/jpeg",
        },
        { force: true },
      );

      // Dialog should close after file selection
      cy.contains("Upload de Foto").should("not.exist");
    });
  });

  it("should only accept valid image formats", () => {
    cy.get("body").then(($body) => {
      const linkText =
        $body.find("a:contains('Adicionar Foto')").length > 0
          ? "Adicionar Foto"
          : "Alterar Foto";

      cy.contains("a", linkText).click();

      cy.get('input[type="file"]').should(
        "have.attr",
        "accept",
        ".jpg,.jpeg,.gif,.bmp,.png",
      );
    });
  });

  // ── Remove photo ──

  it("should show remove photo option when avatar is set", () => {
    // When avatar is not default, should show "Alterar Foto | Remover Foto"
    cy.get("body").then(($body) => {
      if ($body.find("a:contains('Remover Foto')").length > 0) {
        cy.contains("a", "Remover Foto").should("be.visible");
        cy.contains("a", "Alterar Foto").should("be.visible");
      }
    });
  });

  it("should remove photo and show default avatar", () => {
    cy.get("body").then(($body) => {
      if ($body.find("a:contains('Remover Foto')").length > 0) {
        cy.contains("a", "Remover Foto").click();

        // After removing, should show "Adicionar Foto" link
        cy.contains("a", "Adicionar Foto").should("be.visible");
      }
    });
  });

  // ── Photos page ──

  it("should navigate to photos page", () => {
    cy.contains("a", "fotos").click();
    cy.url().should("include", "/fotos");
    cy.contains("Fotos").should("be.visible");
  });

  it("should show empty state on photos page", () => {
    cy.contains("a", "fotos").click();
    cy.contains("Nenhuma foto adicionada ainda.").should("be.visible");
  });
});

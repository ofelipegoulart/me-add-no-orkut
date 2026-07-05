import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    env: {
      TEST_EMAIL: "cypress@teste.com",
      TEST_PASSWORD: "senha123",
      TEST_FIRST_NAME: "Cypress",
      TEST_LAST_NAME: "Teste",
      ACTIVE_USER_EMAIL: process.env.ACTIVE_USER_EMAIL,
      ACTIVE_USER_PASSWORD: process.env.ACTIVE_USER_PASSWORD,
    },
  },
});

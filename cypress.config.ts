import { defineConfig } from "cypress";
import { createUser, getUserByEmail } from "./src/data-access/users";
import { deleteUserCase, registerUser } from "./src/use-cases/user";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8000",
    setupNodeEvents(on, config) {
      on("task", { 
        "user:createTestUser": async () => {
          const user = await getUserByEmail("test@email.com");

          if (user) {
            return user;
          }

          return registerUser({
              email: "test@email.com",
              password: "password",
              name: "Test",
              lastName: "User",
              about: "I am a test user",
            }).catch((e) => {
              console.error(e);
            });
        },
        "user:deleteTestUser": async () => {
          const user = await getUserByEmail("test@email.com");

          if (user) {
            return deleteUserCase(user.id);
          }

          return null;
        }
    });
    },
  },
});

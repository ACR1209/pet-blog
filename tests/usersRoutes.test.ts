import request from "supertest";
import express from "express";
import userRouter from "../src/routes/users";
import {
    getAllUsers,
    getUserPublicInfo,
    registerUser,
    updateUserInfo,
    deleteUserCase,
} from "../src/use-cases/user";
import {
    capitalizeLastNameInUsers,
    getUsersWithFilter,
    groupUsersByPrefix,
    orderUsersByName,
} from "../src/utils/users";
import { expect } from '@jest/globals';

jest.mock("../src/use-cases/user");

describe("User Routes", () => {
    const mockUsers = [
        {
            id: "1",
            name: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            about: "A test user",
            encryptedPassword: "hashedPassword",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "Jane",
            lastName: "Doe",
            email: "john.doe@example.com",
            about: "A test user",
            encryptedPassword: "hashedPassword",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "3",
            name: "Arthur",
            lastName: "Mark",
            email: "ar.mark@example.com",
            about: "A test user",
            encryptedPassword: "hashedPassword",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "4",
            name: "Bob",
            lastName: "Young",
            email: "bob@example.com",
            about: "A test user",
            encryptedPassword: "hashedPassword",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "5",
            name: "Carlos",
            lastName: "Aigster",
            email: "carlosaig@example.com",
            about: "A test user",
            encryptedPassword: "hashedPassword",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
    ];

    const mockUsersOrdered = [
        {
            id: "3",
            name: "Arthur",
            lastName: "Mark",
            email: "ar.mark@example.com",
            about: "A test user",
            encryptedPassword: "hashedPassword",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "4",
            name: "Bob",
            lastName: "Young",
            email: "bob@example.com",
            about: "A test user",
            encryptedPassword: "hashedPassword",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "5",
            name: "Carlos",
            lastName: "Aigster",
            email: "carlosaig@example.com",
            about: "A test user",
            encryptedPassword: "hashedPassword",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        {
          id: "2",
          name: "Jane",
          lastName: "Doe",
          email: "john.doe@example.com",
          about: "A test user",
          encryptedPassword: "hashedPassword",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            id: "1",
            name: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            about: "A test user",
            encryptedPassword: "hashedPassword",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    const app = express();
    
    beforeEach(() => {
        jest.clearAllMocks();
        app.use(express.json());
        app.set("view engine", "pug");
        app.set("views", __dirname.replace("tests", "src") + "/views");
        app.use("/users", userRouter);
    });

    describe("GET /users with no filter", () => {
        it("should return all users", async () => {
            (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

            const response = await request(app).get("/users")
            

            expect(response.status).toBe(200);
            expect(response.text).toContain("John Doe");
            expect(response.text).toContain("Jane Doe");
        });
    });

    describe("GET /users with alphabetical filter", () => {
        it("should return users ordered alphabetically by name with capitalized last names", async () => {
            (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

            const response = await request(app).get("/users").query({ filter: "alphabetical" });
            
            expect(response.status).toBe(200);
            expect(response.text).toContain("Jane Doe");
            expect(response.text).toContain("John Doe");
        });
    });

    describe("GET /users with prefix filter", () => {
        it("should return users grouped by prefix", async () => {
            (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

            const response = await request(app).get("/users").query({ filter: "withPrefix" });

            const expectedLetters = ["a", "b", "c"];
            const expectedUsers = ["Arthur Mark", "Bob Young", "Carlos Aigster"];
            const notExpectedUsers = ["Jane Doe", "John Doe"];

            expect(response.status).toBe(200);

            expectedLetters.forEach(letter => {
                expect(response.text).toContain(letter);
            });

            expectedUsers.forEach(user => {
                expect(response.text).toContain(user);
            });

            notExpectedUsers.forEach(user => {
                expect(response.text).not.toContain(user);
            });
        });
    });

    describe("GET /users/profile/:id", () => {
        it("should return user profile", async () => {
            const mockUser = { id: "1", name: "John", lastName: "Doe", email: "john@example.com", about: "A test user" };
            (getUserPublicInfo as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app).get("/users/profile/1");

            expect(response.status).toBe(200);
            expect(response.text).toContain("John Doe");
            expect(response.text).toContain("john@example.com");
            expect(response.text).toContain("A test user");
            expect(getUserPublicInfo).toHaveBeenCalledWith("1");
        });

        it("should return 404 if user not found", async () => {
            (getUserPublicInfo as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/users/profile/1");

            expect(response.status).toBe(404);
            expect(response.text).toBe("User not found");
        });
    });

    describe("POST /users/user", () => {
        it("should create a new user", async () => {
            const newUser = { name: "John", lastName: "Doe", email: "john@example.com" };
            const createdUser = { id: "1", ...newUser };
            (registerUser as jest.Mock).mockResolvedValue(createdUser);

            const response = await request(app).post("/users/user").send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdUser);
            expect(registerUser).toHaveBeenCalledWith(newUser);
        });

        it("should return 400 if user creation fails", async () => {
            const newUser = { name: "John", lastName: "Doe", email: "john@example.com" };
            (registerUser as jest.Mock).mockRejectedValue(new Error("User creation failed"));

            const response = await request(app).post("/users/user").send(newUser);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("User creation failed");
        });
    });

    describe("PUT /users/user/:id", () => {
        it("should update user info", async () => {
            const updatedUser = { id: "1", name: "John", lastName: "Doe", email: "john@example.com" };
            (updateUserInfo as jest.Mock).mockResolvedValue(updatedUser);

            const response = await request(app).put("/users/user/1").send(updatedUser);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedUser);
            expect(updateUserInfo).toHaveBeenCalledWith("1", updatedUser);
        });
    });

    describe("DELETE /users/user/:id", () => {
        it("should delete user", async () => {
            const response = await request(app).delete("/users/user/1");

            expect(response.status).toBe(204);
            expect(deleteUserCase).toHaveBeenCalledWith("1");
        });
    });
});
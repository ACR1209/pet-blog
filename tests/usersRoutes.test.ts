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
jest.mock("../src/utils/users");

describe("User Routes", () => {
    const mockUsers = [
        { id: "1", name: "John", lastName: "Doe", email: "john@example.com" },
        { id: "2", name: "Jane", lastName: "Smith", email: "jane@example.com" },
    ];

    const mockUsersOrdered = [
        { id: "2", name: "Jane", lastName: "Smith", email: "jane@example.com" },
        { id: "1", name: "John", lastName: "Doe", email: "john@example.com" },
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
            //(getUsersWithFilter as jest.Mock).mockReturnValue(mockUsersOrdered);
            //(orderUsersByName as jest.Mock).mockReturnValue(mockUsersOrdered);
            //(capitalizeLastNameInUsers as jest.Mock).mockReturnValue(mockUsersOrdered);

            const response = await request(app).get("/users")
            

            expect(response.status).toBe(200);
            expect(response.text).toContain("John Doe");
        });
    });

    describe("GET /users with alphabetical filter", () => {
        it("should return users ordered alphabetically by name with capitalized last names", async () => {
            (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
            (getUsersWithFilter as jest.Mock).mockReturnValue(mockUsersOrdered);
            (orderUsersByName as jest.Mock).mockReturnValue(mockUsersOrdered);
            (capitalizeLastNameInUsers as jest.Mock).mockReturnValue(mockUsersOrdered);

            const response = await request(app).get("/users").query({ filter: "alphabetical" });

            expect(response.status).toBe(200);
            expect(response.text).toContain("John Doe");
            expect(orderUsersByName).toHaveBeenCalled();
            expect(capitalizeLastNameInUsers).toHaveBeenCalledWith(mockUsers);
        });
    });

    describe("GET /users with prefix filter", () => {
        it("should return users grouped by prefix", async () => {
            (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
            (groupUsersByPrefix as jest.Mock).mockReturnValue(mockUsers);

            const response = await request(app).get("/users").query({ filter: "withPrefix" });

            expect(response.status).toBe(200);
            expect(response.body.users).toEqual(mockUsers);
            expect(groupUsersByPrefix).toHaveBeenCalledWith(mockUsers, ["a", "b", "c"]);
        });
    });

    describe("GET /users/profile/:id", () => {
        it("should return user profile", async () => {
            const mockUser = { id: "1", name: "John", lastName: "Doe", email: "john@example.com" };
            (getUserPublicInfo as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app).get("/users/profile/1");

            expect(response.status).toBe(200);
            expect(response.body.user).toEqual(mockUser);
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
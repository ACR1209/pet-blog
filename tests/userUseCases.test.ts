import { User } from "@prisma/client";
import { comparePassword, hashPassword } from "../src/utils/passwords";
import { validateEmail } from "../src/utils/email";
import { CreateUser } from "../src/types/users";
import { addUser, deleteUserCase, getAllUsers, getUserPublicInfo, loginUser, registerUser, updateUserInfo } from "../src/use-cases/user";
import { createUser, deleteUser, getUser, getUserByEmail, getUsers, updateUser } from "../src/data-access/users";
import { expect } from '@jest/globals';


jest.mock("../src/data-access/users");
jest.mock("../src/utils/passwords");
jest.mock("../src/utils/email");

describe("User Use Cases", () => {
    const mockUser: User = {
        id: "test",
        email: "test@example.com",
        encryptedPassword: "hashedPassword",
        name: "John",
        lastName: "Doe",
        about: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockCreateUser: CreateUser = {
        email: "test@example.com",
        password: "password",
        name: "John",
        lastName: "Doe",
        about: "",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("#registerUser", () => {
        it("should throw an error if email is invalid", async () => {
            (validateEmail as jest.Mock).mockReturnValue(false);

            await expect(registerUser(mockCreateUser)).rejects.toThrow("Invalid email");
        });

        it("should throw an error if user already exists", async () => {
            (validateEmail as jest.Mock).mockReturnValue(true);
            (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

            await expect(registerUser(mockCreateUser)).rejects.toThrow("User with that email already exists");
        });

        it("should create a new user", async () => {
            (validateEmail as jest.Mock).mockReturnValue(true);
            (getUserByEmail as jest.Mock).mockResolvedValue(null);
            (hashPassword as jest.Mock).mockResolvedValue("hashedPassword");
            (createUser as jest.Mock).mockResolvedValue(mockUser);

            const result = await registerUser(mockCreateUser);

            expect(result).toEqual(mockUser);
        });
    });

    describe("#loginUser", () => {
        it("should throw an error if user does not exist", async () => {
            (getUserByEmail as jest.Mock).mockResolvedValue(null);

            await expect(loginUser("test@example.com", "password")).rejects.toThrow("Invalid credentials");
        });

        it("should throw an error if password is invalid", async () => {
            (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            (comparePassword as jest.Mock).mockResolvedValue(false);

            await expect(loginUser("test@example.com", "password")).rejects.toThrow("Invalid credentials");
        });

        it("should return the user if credentials are valid", async () => {
            (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            (comparePassword as jest.Mock).mockResolvedValue(true);

            const result = await loginUser("test@example.com", "password");

            expect(result).toEqual(mockUser);
        });
    });

    describe("#getUserPublicInfo", () => {
        it("should return the user public info", async () => {
            (getUser as jest.Mock).mockResolvedValue(mockUser);

            const result = await getUserPublicInfo("test");

            expect(result).toEqual(mockUser);
        });
    });

    describe("#updateUserInfo", () => {
        it("should throw an error if user does not exist", async () => {
            (getUser as jest.Mock).mockResolvedValue(null);

            await expect(updateUserInfo("test", { name: "Jane" })).rejects.toThrow("User not found");
        });

        it("should update the user info", async () => {
            (getUser as jest.Mock).mockResolvedValue(mockUser);
            (updateUser as jest.Mock).mockResolvedValue({ ...mockUser, name: "Jane" });

            const result = await updateUserInfo("test", { name: "Jane" });

            expect(result.name).toBe("Jane");
        });
    });

    describe("#deleteUserCase", () => {
        it("should throw an error if user does not exist", async () => {
            (getUser as jest.Mock).mockResolvedValue(null);

            await expect(deleteUserCase("test")).rejects.toThrow("User not found");
        });

        it("should delete the user", async () => {
            (getUser as jest.Mock).mockResolvedValue(mockUser);
            (deleteUser as jest.Mock).mockResolvedValue(mockUser);

            const result = await deleteUserCase("test");

            expect(result).toEqual(mockUser);
        });
    });

    describe("#getAllUsers", () => {
        it("should return all users", async () => {
            (getUsers as jest.Mock).mockResolvedValue([mockUser]);

            const result = await getAllUsers();

            expect(result).toEqual([mockUser]);
        });
    });

});
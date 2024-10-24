import prisma from "../src/utils/prisma";
import { CreateUser, PublicUser } from "../src/types/users";
import { User } from "@prisma/client";
import { getUser, getUserById, getUserByEmail, getUsers, createUser, updateUser, deleteUser } from "../src/data-access/users";
import { expect } from '@jest/globals';

jest.mock("../src/utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("User Data Access", () => {
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

  describe("#getUser", () => {
    const mockUser = {
      id: "test-id",
      name: "Test Name",
      email: "test@example.com",
      about: "Test About",
      createdAt: new Date(),
      lastName: "Test LastName",
    };
    
    it("should return the user public info", async () => {
          (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    
          const result = await getUser("test-id");
    
          expect(result).toEqual({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            about: mockUser.about,
            createdAt: mockUser.createdAt,
            lastName: mockUser.lastName,
          });
    
          expect(result).toEqual({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            about: mockUser.about,
            createdAt: mockUser.createdAt,
            lastName: mockUser.lastName,
          });
    });

    it("should return null if user does not exist", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getUser("test");

      expect(result).toBeNull();
    
    });
  });

  describe("#getUserById", () => {
    it("should return the user", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserById("test");

      expect(result).toEqual(mockUser);
    });

    it("should return null if user does not exist", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getUserById("test");

      expect(result).toBeNull();
    });
  });

  describe("#getUserByEmail", () => {
    it("should return the user", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserByEmail("test@example.com");

      expect(result).toEqual(mockUser);
    });

    it("should return null if user does not exist", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getUserByEmail("test@example.com");

      expect(result).toBeNull();
    });
  });

  describe("#getUsers", () => {
    it("should return all users", async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);

      const result = await getUsers();

      expect(result).toEqual([mockUser]);
    });
  });

  describe("#createUser", () => {
    it("should create a new user", async () => {
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await createUser(mockCreateUser);

      expect(result).toEqual(mockUser);
    });
  });

  describe("#updateUser", () => {
    it("should update the user info", async () => {
      const updatedUser = { ...mockUser, name: "Jane" };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await updateUser("test", { name: "Jane" });

      expect(result).toEqual(updatedUser);
    });
  });

  describe("#deleteUser", () => {
    it("should delete the user", async () => {
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const result = await deleteUser("test");

      expect(result).toEqual(mockUser);
    });
  });
});
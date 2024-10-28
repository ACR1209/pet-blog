import prisma from "../src/utils/prisma";
import { CreateUser, PublicUser } from "../src/types/users";
import { User } from "@prisma/client";
import { getUser, getUserById, getUserByEmail, getUsers, createUser, updateUser, deleteUser, makeUserFollowUser, makeUserUnfollowUser, getUserFollowers, getUserFollowing, isUserFollowerOfUser } from "../src/data-access/users";
import { expect } from '@jest/globals';

jest.mock("../src/utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  follows: {
    create: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  }
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

  describe("#makeUserFollowUser", () => {
    it("should make a user follow another user", async () => {
      const userToFollowId = "test-id";
      (prisma.follows.create as jest.Mock).mockResolvedValue({});

      const result = await makeUserFollowUser("test", userToFollowId);

      expect(result).toEqual({});
      expect(prisma.follows.create).toHaveBeenCalledWith({ data: { followerId: "test", followingId: userToFollowId } });
    })
  })

  describe("#makeUserUnfollowUser", () => {
    it("should make a user unfollow another user", async () => {
      const userToUnfollowId = "test-id";
      (prisma.follows.delete as jest.Mock).mockResolvedValue({});

      const result = await makeUserUnfollowUser("test", userToUnfollowId);

      expect(result).toEqual({});
      expect(prisma.follows.delete).toHaveBeenCalledWith({ where: { followerId_followingId: { followerId: "test", followingId: userToUnfollowId } } });
    })
  });

  describe("#getUserFollowers", () => {
    it("should return the user followers", async () => {
      const follower = {
        id: "test-follower-id",
        email: ""
        };
        (prisma.follows.findMany as jest.Mock).mockResolvedValue([{ follower }]);
        const result = await getUserFollowers("test");
        expect(result).toEqual([follower]);
    })
  })

  describe("#getUserFollowing", () => {
    it("should return the user following", async () => {
      const following = {
        id: "test-following-id",
        email: ""
        };
        (prisma.follows.findMany as jest.Mock).mockResolvedValue([{ following }]);
        const result = await getUserFollowing("test");
        expect(result).toEqual([following]);
    })
  })

  describe("#isUserFollowerOfUser", () => {
    it("should return true if user is a follower of another user", async () => {
      const followerId = "test-follower-id";
      const followedId = "test-followed-id";
      (prisma.follows.findMany as jest.Mock).mockResolvedValue([{ followerId, followingId: followedId }]);
      const result = await isUserFollowerOfUser(followerId, followedId);
      expect(result).toBe(true);
    });

    it("should return false if user is not a follower of another user", async () => {
      const followerId = "test-follower-id";
      const followedId = "test-followed-id";
      (prisma.follows.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await isUserFollowerOfUser(followerId, followedId);
      expect(result).toBe(false);
    });
  });
});
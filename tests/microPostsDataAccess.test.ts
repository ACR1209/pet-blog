import {
    createMicroPost,
    deleteMicroPost,
    getAmountOfMicroposts,
    getMicroPostById,
    getMicroPosts,
    getMicroPostsForUser,
    getMicroPostsPage,
    updateMicroPost,
} from "../src/data-access/microPosts";
import { MicroPost, User } from "@prisma/client";
import prisma from "../src/utils/prisma";
import { expect } from '@jest/globals';


jest.mock("../src/utils/prisma", () => ({
    microPost: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
}));

describe("MicroPosts Data Access", () => {
    const mockMicroPost: MicroPost = {
        id: "1",
        title: "Test title",
        content: "Test content",
        authorId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockUser: User = {
        id: "1",
        name: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        encryptedPassword: "hashedPassword",
        about: "A test user",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockMicroPostWithAuthor = {
        ...mockMicroPost,
        author: {
            id: mockUser.id,
            name: mockUser.name,
            lastName: mockUser.lastName,
        },
    };

    describe("#getAmountOfMicroposts", () => {
        it("should get the amount of microposts", async () => {
            (prisma.microPost.count as jest.Mock).mockResolvedValue(5);
            const count = await getAmountOfMicroposts();
            expect(count).toBe(5);
        });
    });

    describe("#getMicroPostsForUser", () => {
        it("should get microposts for a user", async () => {
            (prisma.microPost.findMany as jest.Mock).mockResolvedValue([mockMicroPostWithAuthor]);
            const posts = await getMicroPostsForUser("1");
            expect(posts).toEqual([mockMicroPostWithAuthor]);
        });
    })

    describe("#getMicroPostsPage", () => {
        it("should get all microposts", async () => {
            (prisma.microPost.findMany as jest.Mock).mockResolvedValue([mockMicroPostWithAuthor]);
            const posts = await getMicroPosts();
            expect(posts).toEqual([mockMicroPostWithAuthor]);
        });
    })

    describe("#getMicroPostsPage", () => {
        it("should get microposts with pagination", async () => {
            (prisma.microPost.findMany as jest.Mock).mockResolvedValue([mockMicroPostWithAuthor]);
            const posts = await getMicroPostsPage(1, 1);
            expect(posts).toEqual([mockMicroPostWithAuthor]);
            expect(prisma.microPost.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                include: { author: { select: { id: true, name: true, lastName: true } } },
                skip: 0,
                take: 1,
            });
        });

        it("should get microposts with pagination with 30 per page and page 1 as default", async () => {
            (prisma.microPost.findMany as jest.Mock).mockResolvedValue([mockMicroPostWithAuthor]);
            
            const posts = await getMicroPostsPage();
            expect(posts).toEqual([mockMicroPostWithAuthor]);
            expect(prisma.microPost.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: 'desc' },
                include: { author: { select: { id: true, name: true, lastName: true } } },
                skip: 0,
                take: 30,
            });
        }); 
    });

    describe("#getMicroPostById", () => {
        it("should get a micropost by id", async () => {
            (prisma.microPost.findUnique as jest.Mock).mockResolvedValue(mockMicroPostWithAuthor);
            const post = await getMicroPostById("1");
            expect(post).toEqual(mockMicroPostWithAuthor);
        });

        it("should return null if the micropost does not exist", async () => {
            (prisma.microPost.findUnique as jest.Mock).mockResolvedValue(null);
            const post = await getMicroPostById("1");
            expect(post).toBeNull();
        });
    });


    describe("#createMicroPost", () => {
        it("should create a new micropost", async () => {
            (prisma.microPost.create as jest.Mock).mockResolvedValue(mockMicroPostWithAuthor);
            const post = await createMicroPost({ title: "title", content: "Test content", authorId: "1" });
            expect(post).toEqual(mockMicroPostWithAuthor);
        });
    });

    describe("#updateMicroPost", () => {
        it("should update a micropost", async () => {
            (prisma.microPost.update as jest.Mock).mockResolvedValue(mockMicroPostWithAuthor);
            const post = await updateMicroPost("1", { content: "Updated content" });
            expect(post).toEqual(mockMicroPostWithAuthor);
        });
    });

    describe("#deleteMicroPost", () => {
        it("should delete a micropost", async () => {
            (prisma.microPost.delete as jest.Mock).mockResolvedValue(mockMicroPost);
            const post = await deleteMicroPost("1");
            expect(post).toEqual(mockMicroPost);
        });
    });
});
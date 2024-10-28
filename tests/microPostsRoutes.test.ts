import request from "supertest";
import express from "express";
import microPostRouter from "../src/routes/microPosts";
import { userHasAccessToMicroPost } from "../src/utils/microPosts";
import { expect } from '@jest/globals';
import { createMicroPostUseCase, deleteMicroPostUseCase, getMicroPostsPaginated, getMicroPostUseCase, updateMicroPostUseCase } from "../src/use-cases/microPosts";
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { getUserById } from "../src/data-access/users";
import { User } from "@prisma/client";

jest.mock("../src/use-cases/microPosts");
jest.mock("../src/utils/microPosts");
jest.mock('../src/data-access/users');
jest.mock('jsonwebtoken');
declare global {
    namespace Express {
      interface Request {
        user?: User;
      }
    }
  }

const app = express();
app.use(express.json());
app.set("view engine", "pug");
app.set("views", __dirname.replace("tests", "src") + "/views");
app.use((req: Request, res: Response, next) => {
    req.user = { id: "1", name: "Jane", lastName: "Doe", email: "jdoe@example.com", about: "A test user", encryptedPassword: "hashedPassword", createdAt: new Date(), updatedAt: new Date() };
    next()
})
app.use("/posts", microPostRouter);

describe("MicroPost Routes", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            cookies: {}
        };
        res = {};
        next = jest.fn();

    });

describe("GET /posts", () => {
    it("should return paginated micro posts", async () => {
        const mockPageData = { data: [{
            id: "1",
            title: "Test Post",
            content: "Test Content",
            authorId: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
            author: {
                id: "1",
                name: "John",
                lastName: "Doe",
            }
        }], nextPage: 2,  totalPages: 2, currentPage: 1 };
        (getMicroPostsPaginated as jest.Mock).mockResolvedValue(mockPageData);

        const response = await request(app).get("/posts").query({ page: 1 });

        expect(response.status).toBe(200);
        expect(response.text).toContain("Test Post");
        expect(getMicroPostsPaginated).toHaveBeenCalledWith(1, 16);
    });
});

describe("GET /posts/post/:id", () => {
    it("should return a micro post", async () => {
        const mockMicroPost = { id: "1", title: "Test Post", content: "Test Content", authorId: "1", createdAt: new Date(), updatedAt: new Date(), author: { id: "1", name: "John", lastName: "Doe" } };
        (getMicroPostUseCase as jest.Mock).mockResolvedValue(mockMicroPost);

        const response = await request(app).get("/posts/post/1");

        expect(response.status).toBe(200);
        expect(response.text).toContain("John Doe");
        expect(response.text).toContain("Test Post");
        expect(getMicroPostUseCase).toHaveBeenCalledWith("1");
    });

    it("should return 404 if micro post not found", async () => {
        (getMicroPostUseCase as jest.Mock).mockResolvedValue(null);

        const response = await request(app).get("/posts/post/1");

        expect(response.status).toBe(404);
        expect(response.text).toBe("MicroPost not found");
    });
});

describe("GET /posts/new", () => {
    it("should render new post form if user is logged in", async () => {

        app.use((req, res, next) => {
            req.user = { id: "1", name: "John Doe", email: "jdoe@ex.com", "about": "A test user", "createdAt": new Date(), "updatedAt": new Date(), encryptedPassword: "hashedPassword", lastName: "Doe" };
            next();
        });

        const response = await request(app).get("/posts/new");

        expect(response.status).toBe(200);
        expect(response.text).toContain("New Micro Post");
        
    });
});

describe("POST /posts/new", () => {
    it("should create a new micro post", async () => {
        const newMicroPost = { title: "New Post", content: "New Content", authorId: "1" };
        const createdMicroPost = { id: "1", ...newMicroPost };

        (userHasAccessToMicroPost as jest.Mock).mockResolvedValue(true);
        (jwt.verify as jest.Mock).mockReturnValue(req.user);
        (getUserById as jest.Mock).mockResolvedValue(req.user);
        (createMicroPostUseCase as jest.Mock).mockResolvedValue(createdMicroPost);

   
        const response = await request(app).post("/posts/new").send(newMicroPost);

        expect(response.status).toBe(302);
    });


});

describe("GET /posts/:id/edit", () => {
    it("should return 404 if micro post not found", async () => {
        (getMicroPostUseCase as jest.Mock).mockResolvedValue(null);

        const response = await request(app).get("/posts/1/edit");

        expect(response.status).toBe(404);
        expect(response.text).toBe("MicroPost not found");
    });

    it("should return 401 if user is not authorized", async () => {
        const mockMicroPost = { id: "1", title: "Test Post", content: "Test Content" };
        (getMicroPostUseCase as jest.Mock).mockResolvedValue(mockMicroPost);
        (userHasAccessToMicroPost as jest.Mock).mockResolvedValue(false);

        const response = await request(app).get("/posts/1/edit");

        expect(response.status).toBe(401);
        expect(response.text).toBe("Unauthorized to edit this micro post");
    });

    it("should render edit form if user is authorized", async () => {
        const mockMicroPost = { id: "1", title: "Test Post", content: "Test Content" };
        (getMicroPostUseCase as jest.Mock).mockResolvedValue(mockMicroPost);
        (userHasAccessToMicroPost as jest.Mock).mockResolvedValue(true);

   
        const response = await request(app).get("/posts/1/edit");

        expect(response.status).toBe(200);
        expect(response.text).toContain("Test Post");
    });
});

describe("PATCH /posts/:id/edit", () => {
    it("should update a micro post", async () => {
        const updatedMicroPost = { id: "1", title: "Updated Post", content: "Updated Content" };
        (getMicroPostUseCase as jest.Mock).mockResolvedValue(updatedMicroPost);
        (userHasAccessToMicroPost as jest.Mock).mockResolvedValue(true);
        (updateMicroPostUseCase as jest.Mock).mockResolvedValue(updatedMicroPost);

        const response = await request(app).patch("/posts/1/edit").send(updatedMicroPost);

        expect(response.status).toBe(302);
        expect(response.header.location).toBe(`/posts/post/1`);
        expect(updateMicroPostUseCase).toHaveBeenCalled();
    });

    it("should return 404 if micro post not found", async () => {
        (getMicroPostUseCase as jest.Mock).mockResolvedValue(null);

        const response = await request(app).patch("/posts/1/edit").send({ title: "Updated Post", content: "Updated Content" });

        expect(response.status).toBe(404);
        expect(response.text).toBe("MicroPost not found");
    });

    it("should return 401 if user is not authorized", async () => {
        const mockMicroPost = { id: "1", title: "Test Post", content: "Test Content" };
        (getMicroPostUseCase as jest.Mock).mockResolvedValue(mockMicroPost);
        (userHasAccessToMicroPost as jest.Mock).mockResolvedValue(false);

        const response = await request(app).patch("/posts/1/edit").send({ title: "Updated Post", content: "Updated Content" });

        expect(response.status).toBe(401);
        expect(response.text).toBe("Unauthorized to edit this micro post");
    });
});

describe("DELETE /posts/:id/delete", () => {
        it("should delete a micro post", async () => {
            const mockMicroPost = { id: "1", title: "Test Post", content: "Test Content" };
            (getMicroPostUseCase as jest.Mock).mockResolvedValue(mockMicroPost);
            (userHasAccessToMicroPost as jest.Mock).mockResolvedValue(true);

            const response = await request(app).delete("/posts/1/delete");

            expect(response.status).toBe(302);
            expect(deleteMicroPostUseCase).toHaveBeenCalled();
        });

        it("should return 404 if micro post not found", async () => {
            (getMicroPostUseCase as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete("/posts/1/delete");

            expect(response.status).toBe(404);
            expect(response.text).toBe("MicroPost not found");
        });

        it("should return 401 if user is not authorized", async () => {
            const mockMicroPost = { id: "1", title: "Test Post", content: "Test Content" };
            (getMicroPostUseCase as jest.Mock).mockResolvedValue(mockMicroPost);
            (userHasAccessToMicroPost as jest.Mock).mockResolvedValue(false);

            const response = await request(app).delete("/posts/1/delete");

            expect(response.status).toBe(401);
            expect(response.text).toBe("Unauthorized to delete this micro post");
        });
    });
});
import request from "supertest";
import express from "express";
import authRouter from "../src/routes/auth";
import { loginUser, registerUser } from "../src/use-cases/user";
import jwt from "jsonwebtoken";
import { expect } from '@jest/globals';

jest.mock("../src/use-cases/user");
jest.mock("jsonwebtoken");

describe("Auth Routes", () => {

  const mockUser = {
    id: "test",
    email: "test@example.com",
    encryptedPassword: "hashedPassword",
    name: "John",
    lastName: "Doe",
    about: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const app = express();


  beforeEach(() => {
    jest.clearAllMocks();
    app.use(express.json());
    app.set("view engine", "pug");
    app.set("views", __dirname.replace("tests", "src") + "/views");
    app.use("/auth", authRouter);
  });

  describe("GET /auth/login", () => {
    it("should render login page", async () => {
      const response = await request(app).get("/auth/login");

      expect(response.status).toBe(200);
      expect(response.text).toContain("Login");
    });
  });

  describe("GET /auth/register", () => {
    it("should render register page", async () => {
      const response = await request(app).get("/auth/register");

      expect(response.status).toBe(200);
      expect(response.text).toContain("Register");
    });
  });

  describe("DELETE /auth/logout", () => {
    it("should clear cookie and redirect to home page", async () => {
        const response = await request(app)
          .delete("/auth/logout")
          .set("Cookie", "authToken=mockAccessToken");

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe("/");
        expect(response.headers['set-cookie'][0]).toContain("authToken=;"); 
    });
  });

  describe("POST /auth/login", () => {
    it("should return accessToken on successful login", async () => {
      (loginUser as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("mockAccessToken");

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password" });

      expect(response.status).toBe(302);
      expect(response.headers['set-cookie'][0]).toContain("authToken=mockAccessToken");
      expect(loginUser).toHaveBeenCalled();
    });

    it("should return error message on failed login", async () => {
      (loginUser as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "wrongpassword" });
      

      expect(response.status).toBe(200);
      expect(response.text).toContain("Invalid credentials");
    });
  });

  describe("POST /auth/register", () => {
    it("should return accessToken on successful registration", async () => {
      (registerUser as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("mockAccessToken");

      const response = await request(app)
        .post("/auth/register")
        .send({
          email: "test@example.com",
          password: "password",
          name: "John",
          lastName: "Doe",
          about: "",
        });

      expect(response.status).toBe(302);
      expect(response.headers['set-cookie'][0]).toContain("authToken=mockAccessToken");
    });

    it("should return error message on failed registration", async () => {
      (registerUser as jest.Mock).mockRejectedValue(new Error("User with that email already exists"));

      const response = await request(app)
        .post("/auth/register")
        .send({
          email: "test@example.com",
          password: "password",
          name: "John",
          lastName: "Doe",
          about: "",
        });

      expect(response.status).toBe(200);
      expect(response.text).toContain("User with that email already exists");
    });
  });
});
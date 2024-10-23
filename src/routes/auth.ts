import express from "express";
import { loginUser, registerUser } from "../use-cases/user";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

authRouter.get("/login", (req, res) => {
  res.render("auth/login");
});

authRouter.get("/register", (req, res) => {
  res.render("auth/register");
});

authRouter.post("/login", async (req, res) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const user = await loginUser(email, password);
    const accessToken = jwt.sign(
      JSON.stringify(user),
      process.env.TOKEN_SECRET!,
    );

    res.cookie('authToken', accessToken, {
      httpOnly: true,  
      secure: true,  
      maxAge: 60 * 60 * 1000 
    });
  
    res.json({ accessToken, user: user });
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
});

authRouter.post("/register", async (req, res) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const addedUser = await registerUser(email, password);
    res.redirect(`/users/profile/${addedUser.id}`);
  } catch (e: any) {
    res.render("auth/register", { alert: e.message });
  }
});

export default authRouter;

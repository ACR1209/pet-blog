import express from "express";
import { loginUser, registerUser } from "../use-cases/user";

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
    res.redirect(`/users/profile/${user.id}`);
  } catch (e: any) {
    res.render("auth/login", { alert: e.message });
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

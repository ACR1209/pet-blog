import express from "express";
import {
  deleteUserCase,
  getAllUsers,
  getUserPublicInfo,
  registerUser,
  updateUserInfo,
} from "../use-cases/user";

const userRouter = express.Router();

userRouter.get("/profile/:id", async (req, res) => {
  const user = await getUserPublicInfo(req.params.id);
  if (!user) {
    res.status(404).send("User not found");
    return
  }

  res.render("users/profile", { user, currentUser: req.user });
});

userRouter.get("/profile/:id/edit", async (req, res) => {
  if (!req.user  || req.user.id !== req.params.id) {
    res.status(401).send("Unauthorized");
    return;
  }
  
  const user = await getUserPublicInfo(req.params.id);
  res.render("users/edit", { user, currentUser: req.user });
});


userRouter.patch("/profile/:id/edit", async (req, res) => {
  if (!req.user  || req.user.id !== req.params.id) {
    res.status(401).send("Unauthorized");
    return;
  }

  await updateUserInfo(req.params.id, req.body);
  
  res.redirect(`/users/profile/${req.params.id}`);
});



userRouter.get("/users", async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

userRouter.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await getUserPublicInfo(userId);
  res.json(user);
});

userRouter.post("/user", async (req, res) => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    const addedUser = await registerUser(email, password);
    res.status(201).json(addedUser);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

userRouter.put("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;
  const updatedUser = await updateUserInfo(userId, updatedUserData);
  res.json(updatedUser);
});

userRouter.delete("/user/:id", async (req, res) => {
  const userId = req.params.id;

  await deleteUserCase(userId);
  res.status(204).send();
});

export default userRouter;

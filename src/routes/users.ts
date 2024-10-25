import express from "express";
import {
  deleteUserCase,
  getAllUsers,
  getUserPublicInfo,
  registerUser,
  updateUserInfo,
} from "../use-cases/user";
import { CreateUser } from "../types/users";
import { getUsersWithFilter } from "../utils/render";
import { getUserFollowers, getUserFollowing, isUserFollowerOfUser } from "../data-access/users";
import { toggleFollow } from "../use-cases/follows";

const userRouter = express.Router();

userRouter.get("/profile/:id", async (req, res) => {
  const user = await getUserPublicInfo(req.params.id);
  
  if (!user) {
    res.status(404).send("User not found");
    return
  }
  
  const follows = await getUserFollowing(req.params.id);
  const followed = await getUserFollowers(req.params.id);
  const isCurrentUserAlreadyFollower = req.user ? await isUserFollowerOfUser(req.user.id, user.id) : false

  res.render("users/profile", { user, followed, isCurrentUserAlreadyFollower, follows, currentUser: req.user });
});

userRouter.post("/profile/:id/toggleFollow", async (req, res) => {
  const user = await getUserPublicInfo(req.params.id);
  
  if (!user || !req.user) {
    res.status(404).send("Follower/Followed not found");
    return
  }
  
  await toggleFollow(req.user.id, user.id)

  res.redirect(`/users/profile/${user.id}`)
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



userRouter.get("/", async (req, res) => {
  const users = await getAllUsers();
  const { filter } = req.query;

  const usersDisplayed = getUsersWithFilter(users, filter as string);

  res.render("users/index", { users: usersDisplayed, currentUser: req.user });
});

userRouter.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await getUserPublicInfo(userId);
  res.json(user);
});

userRouter.post("/user", async (req, res) => {
  const user: CreateUser = req.body;

  try {
    const addedUser = await registerUser(user);
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

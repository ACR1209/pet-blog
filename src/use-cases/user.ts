import { User } from "@prisma/client";
import {
  createUser,
  deleteUser,
  getUser,
  getUserByEmail,
  getUsers,
  updateUser,
} from "../data-access/users";
import { comparePassword, hashPassword } from "../utils/passwords";
import { CreateUser } from "../types/users";
import { validateEmail } from "../utils/email";

export async function registerUser(email: string, password: string) {
  if (!validateEmail(email)) {
    throw new Error("Invalid email");
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw new Error("User with that email already exists");
  }

  const hashedPassword = await hashPassword(password);

  return createUser({
    email,
    encryptedPassword: hashedPassword,
    name: null,
    about: null,
  });
}

export async function loginUser(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.encryptedPassword);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // TODO: Generate JWT token
  return user;
}

export async function getUserPublicInfo(user_id: string) {
  return getUser(user_id);
}

export async function updateUserInfo(user_id: string, user: Partial<User>) {
  const dbUser = await getUser(user_id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  return updateUser(user_id, user);
}

export async function deleteUserCase(user_id: string) {
  const dbUser = await getUser(user_id);

  if (!dbUser) {
    throw new Error("User not found");
  }

  return deleteUser(user_id);
}

export async function getAllUsers() {
  return getUsers();
}

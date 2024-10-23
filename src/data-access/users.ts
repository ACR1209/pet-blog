import prisma from "../utils/prisma";
import { CreateUser, PublicUser } from "../types/users";
import { User } from "@prisma/client";

export async function getUser(user_id: string): Promise<PublicUser | null> {
  return await prisma.user.findUnique({
    where: { id: user_id },
    select: { id: true, name: true, email: true, about: true, createdAt: true },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function createUser(user: CreateUser) {
  return await prisma.user.create({ data: user });
}

export async function updateUser(user_id: string, user: Partial<User>) {
  return await prisma.user.update({ where: { id: user_id }, data: user });
}

export async function deleteUser(user_id: string) {
  return await prisma.user.delete({ where: { id: user_id } });
}

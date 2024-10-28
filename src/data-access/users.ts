import prisma from "../utils/prisma";
import { CreateUser, PublicUser } from "../types/users";
import { User } from "@prisma/client";

export async function getUser(user_id: string): Promise<PublicUser | null> {
  return await prisma.user.findUnique({
    where: { id: user_id },
    select: { id: true, name: true, email: true, about: true, createdAt: true, lastName: true },
  });
}

export async function getUserById(user_id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id: user_id } });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function createUser(user: CreateUser) {
  return await prisma.user.create({ data: { name: user.name, lastName: user.lastName, email: user.email, about: user.about , encryptedPassword: user.password } });
}

export async function updateUser(user_id: string, user: Partial<User>) {
  return await prisma.user.update({ where: { id: user_id }, data: user });
}

export async function deleteUser(user_id: string) {
  return await prisma.user.delete({ where: { id: user_id } });
}

export async function makeUserFollowUser(user_id: string, userToFollowId: string) {
  return await prisma.follows.create({
    data: {
      followerId: user_id,
      followingId: userToFollowId,
    },
  });
}

export async function makeUserUnfollowUser(user_id: string, userToUnfollowId: string) {
  return await prisma.follows.delete({
    where: {
      followerId_followingId: {
        followerId: user_id,
        followingId: userToUnfollowId,
      },
    },
  });
}

export async function getUserFollowers(user_id: string) {
  const dbFollowers = await prisma.follows.findMany({ where: { followingId: user_id}, include: {follower: true} }) || [];

  return dbFollowers.map((follow) => follow.follower);
}

export async function getUserFollowing(user_id: string) {
  const dbFollowers = await prisma.follows.findMany({ where: { followerId: user_id}, include: {following: true} }) || [];

  return dbFollowers.map((follow) => follow.following);
}

export async function isUserFollowerOfUser(followerId: string, followedId: string) {
  const followModel = await prisma.follows.findUnique({
    where: {followerId_followingId: { followerId, followingId: followedId }}
  })

  return followModel !== null;
}
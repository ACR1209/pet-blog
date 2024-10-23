import { User } from "@prisma/client";

export type CreateUser = Omit<User, "id" | "createdAt" | "updatedAt">;
export type PublicUser = Omit<User, "encryptedPassword" | "updatedAt">;

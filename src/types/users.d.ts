import { User } from "@prisma/client";

export type CreateUser = { password: string  } & Omit<User, "id" | "createdAt" | "updatedAt" | "encryptedPassword">;
export type PublicUser = Omit<User, "encryptedPassword" | "updatedAt">;

import { MicroPost, User } from "@prisma/client";



export type MicroPostWithAuthor = MicroPost & { author: Omit<User, "encryptedPassword" | "updatedAt", "email"> };
export type CreateMicropost = Omit<MicroPost, "id" | "createdAt" | "updatedAt"> 
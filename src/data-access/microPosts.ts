import { MicroPost } from "@prisma/client";
import { CreateMicropost, MicroPostWithAuthor } from "../types/microPosts";
import prisma from "../utils/prisma";

export function getAuthorPublicFields(){
    return { select: { id: true, name: true, lastName: true} }
}


export function getAmountOfMicroposts(){
    return prisma.microPost.count();
}


export async function getMicroPostsForUser(user_id: string){
    return await prisma.microPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author:  getAuthorPublicFields() },
        where: { authorId: user_id }
    });
}

export async function getMicroPosts(): Promise<MicroPostWithAuthor[]> {
    return await prisma.microPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author:  getAuthorPublicFields() },
    });
}

export async function getMicroPostsPage(page = 1, per_page = 30 ): Promise<MicroPostWithAuthor[]> {
    const skip = (page - 1) * per_page;
    return await prisma.microPost.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author: getAuthorPublicFields() },
        skip: skip,
        take: per_page,
    });
}

export async function getMicroPostById(id: string): Promise<MicroPostWithAuthor | null>{
    return await prisma.microPost.findUnique({ 
        where: { id },
        include: { author: getAuthorPublicFields() },
    });
}

export async function createMicroPost(post: CreateMicropost): Promise<MicroPostWithAuthor> {
    return await prisma.microPost.create({
        data: post,
        include: { author: getAuthorPublicFields() },
    })
}

export async function updateMicroPost(post_id: string, post: Partial<CreateMicropost>) {
    return await prisma.microPost.update({
        where: {id: post_id},
        data: post,
        include: { author: getAuthorPublicFields() }
    })
}

export async function deleteMicroPost(post_id: string) {
    return await prisma.microPost.delete({
        where: {id: post_id}
    })
}


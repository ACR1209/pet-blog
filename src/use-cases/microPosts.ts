import { createMicroPost, deleteMicroPost, getAmountOfMicroposts, getMicroPostById, getMicroPosts, getMicroPostsPage, updateMicroPost } from "../data-access/microPosts";
import { CreateMicropost } from "../types/microPosts";
import { userHasAccessToMicroPost } from "../utils/microPosts";
import { getPaginationData } from "../utils/pagination";

export async function getMicroPostsUseCase(){
    return await getMicroPosts();
}

export async function getMicroPostsPaginated(page = 1, perPage = 30){
    const numberOfMicroPosts = await getAmountOfMicroposts();
    const currentPage = await getMicroPostsPage(page, perPage) 
    const paginationData = getPaginationData(page, perPage, numberOfMicroPosts);

    return {  ...paginationData,  data: currentPage};
}

export async function getMicroPostUseCase(id: string){
    return await getMicroPostById(id);
} 

export async function createMicroPostUseCase(microPost: CreateMicropost){
    return await createMicroPost(microPost);
}

export async function updateMicroPostUseCase(userId: string, microPostId: string, microPost: CreateMicropost){
    if(!await userHasAccessToMicroPost(userId, microPostId)){
        throw new Error("404: User not authorized to update this microPost");
    }

    return await updateMicroPost(microPostId, microPost);
}

export async function deleteMicroPostUseCase(userId: string, microPostId: string){
    if(!await userHasAccessToMicroPost(userId, microPostId)){
        throw new Error("404: User not authorized to delete this microPost");
    }

    return await deleteMicroPost(microPostId);
}
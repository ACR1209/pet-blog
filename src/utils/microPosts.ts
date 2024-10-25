import { getMicroPostById } from "../data-access/microPosts";

export async function userHasAccessToMicroPost(microPostId: string, userId?: string){
    if(!userId){
        return false;
    }

    const microPost = await getMicroPostById(microPostId);
    
    if(!microPost){
        return false;
    }

    if(microPost.authorId === userId){
        return true;
    }

    return false;
}
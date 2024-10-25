import { getMicroPostById } from "../data-access/microPosts";

export async function userHasAccessToMicroPost(userId: string, microPostId: string){
    const microPost = await getMicroPostById(microPostId);
    
    if(!microPost){
        return false;
    }

    if(microPost.authorId === userId){
        return true;
    }

    return false;
}
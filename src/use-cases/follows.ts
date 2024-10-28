import { isUserFollowerOfUser, makeUserFollowUser, makeUserUnfollowUser } from "../data-access/users";

export async function toggleFollow(followerId: string, followedId: string) {
    const alreadyFollower = await isUserFollowerOfUser(followerId, followedId)


    if(alreadyFollower){
        await makeUserUnfollowUser(followerId, followedId)
        return;
    }

    await makeUserFollowUser(followerId, followedId)
}
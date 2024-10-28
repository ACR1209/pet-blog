import { toggleFollow } from "../src/use-cases/follows";
import { expect } from '@jest/globals';
import { isUserFollowerOfUser, makeUserFollowUser, makeUserUnfollowUser } from "../src/data-access/users";

jest.mock("../src/data-access/users", () => ({
    isUserFollowerOfUser: jest.fn(),
    makeUserFollowUser: jest.fn(),
    makeUserUnfollowUser: jest.fn(),
}));

describe("Follows Use Cases", () => {
    describe("toggleFollow", () => {
        const followerId = "test-follower-id";
        const followedId = "test-followed-id";

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should unfollow if already a follower", async () => {
            (isUserFollowerOfUser as jest.Mock).mockResolvedValue(true);

            await toggleFollow(followerId, followedId);

            expect(isUserFollowerOfUser).toHaveBeenCalledWith(followerId, followedId);
            expect(makeUserUnfollowUser).toHaveBeenCalledWith(followerId, followedId);
            expect(makeUserFollowUser).not.toHaveBeenCalled();
        });

        it("should follow if not already a follower", async () => {
            (isUserFollowerOfUser as jest.Mock).mockResolvedValue(false);

            await toggleFollow(followerId, followedId);

            expect(isUserFollowerOfUser).toHaveBeenCalledWith(followerId, followedId);
            expect(makeUserFollowUser).toHaveBeenCalledWith(followerId, followedId);
            expect(makeUserUnfollowUser).not.toHaveBeenCalled();
        });
    });
});
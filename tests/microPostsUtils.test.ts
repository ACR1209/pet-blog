import { expect } from '@jest/globals';
import { userHasAccessToMicroPost } from '../src/utils/microPosts';
import { getMicroPostById } from '../src/data-access/microPosts';

jest.mock("../src/data-access/microPosts")

describe("MicroPosts Utils", () => {
    describe("#userHasAccessToMicroPost", () => {
        test("should return false if the micro post does not exist", async () => {
            (getMicroPostById as jest.Mock).mockResolvedValue(null);

            const result = await userHasAccessToMicroPost("1", "1");

            expect(result).toBe(false);
            expect(getMicroPostById).toHaveBeenCalledWith("1");
        });

        test("should return true if the user is the author of the micro post", async () => {
            (getMicroPostById as jest.Mock).mockResolvedValue({ authorId: "1" });

            const result = await userHasAccessToMicroPost("1", "1");

            expect(result).toBe(true);
            expect(getMicroPostById).toHaveBeenCalledWith("1");
        })

        test("should return false if the user is not the author of the micro post", async () => {
            (getMicroPostById as jest.Mock).mockResolvedValue({ authorId: "2" });

            const result = await userHasAccessToMicroPost("1", "1");

            expect(result).toBe(false);
            expect(getMicroPostById).toHaveBeenCalledWith("1");
        });
    });
})
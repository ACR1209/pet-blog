import { createMicroPost, deleteMicroPost, getAmountOfMicroposts, getMicroPostById, getMicroPosts, getMicroPostsPage, updateMicroPost } from "../src/data-access/microPosts";
import { expect } from '@jest/globals';
import { createMicroPostUseCase, deleteMicroPostUseCase, getMicroPostsPaginated, getMicroPostsUseCase, getMicroPostUseCase, updateMicroPostUseCase } from "../src/use-cases/microPosts";
import { getPaginationData } from "../src/utils/pagination";
import { CreateMicropost } from "../src/types/microPosts";
import { userHasAccessToMicroPost } from "../src/utils/microPosts";

    
jest.mock("../src/data-access/microPosts");
jest.mock("../src/utils/microPosts");
jest.mock("../src/utils/pagination");

describe("MicroPosts Use Cases", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("#getMicroPostsUseCase", () => {
        it("should return all microPosts", async () => {
            const mockMicroPosts = [{ id: "1", content: "Test microPost" }];
            (getMicroPosts as jest.Mock).mockResolvedValue(mockMicroPosts);

            const result = await getMicroPostsUseCase();

            expect(result).toEqual(mockMicroPosts);
            expect(getMicroPosts).toHaveBeenCalled();
        });
    });

    describe("#getMicroPostsPaginated", () => {
        it("should return paginated microPosts", async () => {
            const mockMicroPosts = [{ id: "1", content: "Test microPost" }];
            const mockPaginationData = { totalItems: 1, totalPages: 1, currentPage: 1, perPage: 30 };
            (getAmountOfMicroposts as jest.Mock).mockResolvedValue(1);
            (getMicroPostsPage as jest.Mock).mockResolvedValue(mockMicroPosts);
            (getPaginationData as jest.Mock).mockReturnValue(mockPaginationData);

            const result = await getMicroPostsPaginated(1, 30);

            expect(result).toEqual({ ...mockPaginationData, data: mockMicroPosts });
            expect(getAmountOfMicroposts).toHaveBeenCalled();
            expect(getMicroPostsPage).toHaveBeenCalledWith(1, 30);
            expect(getPaginationData).toHaveBeenCalledWith(1, 30, 1);
        });

        it("should return paginated microPosts with default values", async () => {
            const mockMicroPosts = [{ id: "1", content: "Test microPost" }];
            const mockPaginationData = { totalItems: 1, totalPages: 1, currentPage: 1, perPage: 30 };
            (getAmountOfMicroposts as jest.Mock).mockResolvedValue(1);
            (getMicroPostsPage as jest.Mock).mockResolvedValue(mockMicroPosts);
            (getPaginationData as jest.Mock).mockReturnValue(mockPaginationData);

            const result = await getMicroPostsPaginated();

            expect(result).toEqual({ ...mockPaginationData, data: mockMicroPosts });
            expect(getAmountOfMicroposts).toHaveBeenCalled();
            expect(getMicroPostsPage).toHaveBeenCalledWith(1, 30);
            expect(getPaginationData).toHaveBeenCalledWith(1, 30, 1);
        });
    });

    describe("#getMicroPostUseCase", () => {
        it("should return a microPost by ID", async () => {
            const mockMicroPost = { id: "1", content: "Test microPost" };
            (getMicroPostById as jest.Mock).mockResolvedValue(mockMicroPost);

            const result = await getMicroPostUseCase("1");

            expect(result).toEqual(mockMicroPost);
            expect(getMicroPostById).toHaveBeenCalledWith("1");
        });
    });

    describe("#createMicroPostUseCase", () => {
        it("should create a new microPost", async () => {
            const newMicroPost: CreateMicropost = { title: "test", authorId: "id", content: "New microPost" };
            const createdMicroPost = { id: "1", ...newMicroPost };
            (createMicroPost as jest.Mock).mockResolvedValue(createdMicroPost);

            const result = await createMicroPostUseCase(newMicroPost);

            expect(result).toEqual(createdMicroPost);
            expect(createMicroPost).toHaveBeenCalledWith(newMicroPost);
        });
    });

    describe("#updateMicroPostUseCase", () => {
        it("should update a microPost if user has access", async () => {
            const updatedMicroPost = { content: "Updated microPost" };
            const mockUpdatedMicroPost = { id: "1", ...updatedMicroPost };
            (userHasAccessToMicroPost as jest.Mock).mockResolvedValue(true);
            (updateMicroPost as jest.Mock).mockResolvedValue(mockUpdatedMicroPost);

            const result = await updateMicroPostUseCase( "1", updatedMicroPost, "user1");

            expect(result).toEqual(mockUpdatedMicroPost);
            expect(userHasAccessToMicroPost).toHaveBeenCalledWith( "1", "user1");
            expect(updateMicroPost).toHaveBeenCalledWith("1", updatedMicroPost);
        });

        it("should throw an error if user does not have access", async () => {
            (userHasAccessToMicroPost as jest.Mock).mockResolvedValue(false);

            await expect(updateMicroPostUseCase("user1", { content: "Updated microPost" }, "1"))
                .rejects
                .toThrow("404: User not authorized to update this microPost");

            expect(userHasAccessToMicroPost).toHaveBeenCalledWith("user1", "1");
            expect(updateMicroPost).not.toHaveBeenCalled();
        });
    });

    describe("#deleteMicroPostUseCase", () => {
        it("should delete a microPost if user has access", async () => {
            (userHasAccessToMicroPost as jest.Mock).mockResolvedValue(true);
            (deleteMicroPost as jest.Mock).mockResolvedValue(true);

            const result = await deleteMicroPostUseCase("user1", "1");

            expect(result).toBe(true);
            expect(userHasAccessToMicroPost).toHaveBeenCalledWith("1", "user1");
            expect(deleteMicroPost).toHaveBeenCalledWith("1");
        });

        it("should throw an error if user does not have access", async () => {
            (userHasAccessToMicroPost as jest.Mock).mockResolvedValue(false);

            await expect(deleteMicroPostUseCase("user1", "1"))
                .rejects
                .toThrow("404: User not authorized to delete this microPost");

            expect(userHasAccessToMicroPost).toHaveBeenCalledWith("1", "user1");
            expect(deleteMicroPost).not.toHaveBeenCalled();
        });
    });
});
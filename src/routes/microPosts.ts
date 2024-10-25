import express from "express";
import { getMicroPostsPaginated, getMicroPostsUseCase, getMicroPostUseCase } from "../use-cases/microPosts";

const microPostRouter = express.Router();

microPostRouter.get("/", async (req, res) => {
    const { page } = req.query;
    const perPage = 16;
    const pageToFetch = parseInt(page as string) || 1;

    const pageData = await getMicroPostsPaginated(pageToFetch, perPage);

    res.render("microPosts/index", { pageData });
});

microPostRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const microPost = await getMicroPostUseCase(id);

    if (!microPost) {
        res.status(404).send("MicroPost not found");
        return;
    }

    res.render("microPosts/show", { post: microPost, currentUser: req.user });
});



export default microPostRouter;
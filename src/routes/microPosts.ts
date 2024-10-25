import express from "express";
import { getMicroPostsPaginated, getMicroPostsUseCase } from "../use-cases/microPosts";

const microPostRouter = express.Router();

microPostRouter.get("/", async (req, res) => {
    const { page } = req.query;
    const perPage = 16;
    const pageToFetch = parseInt(page as string) || 1;

    const pageData = await getMicroPostsPaginated(pageToFetch, perPage);

    res.render("microPosts/index", { pageData });
});




export default microPostRouter;
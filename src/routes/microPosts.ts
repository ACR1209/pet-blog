import express from "express";
import { createMicroPostUseCase, getMicroPostsPaginated, getMicroPostsUseCase, getMicroPostUseCase } from "../use-cases/microPosts";

const microPostRouter = express.Router();

microPostRouter.get("/", async (req, res) => {
    const { page } = req.query;
    const perPage = 16;
    const pageToFetch = parseInt(page as string) || 1;

    const pageData = await getMicroPostsPaginated(pageToFetch, perPage);

    res.render("microPosts/index", { pageData });
});

microPostRouter.get("/post/:id", async (req, res) => {
    const { id } = req.params;
    const microPost = await getMicroPostUseCase(id);

    if (!microPost) {
        res.status(404).send("MicroPost not found");
        return;
    }

    res.render("microPosts/show", { post: microPost, currentUser: req.user });
});

microPostRouter.get("/new", (req, res) => {
    if (!req.user) {
        res.redirect("/auth/login");
        return;
    }

    res.render("microPosts/new");
});

microPostRouter.post("/new", async (req, res) => {
    if (!req.user) {
        res.status(401).send("Unauthorized to create a micro post without being logged in");
        return;
    }

    const { title, content } = req.body;
    const authorId = req.user.id;

    const microPost = await createMicroPostUseCase({ title, content, authorId });

    res.redirect(`/posts/post/${microPost.id}`);
});



export default microPostRouter;
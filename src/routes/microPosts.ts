import express from "express";
import { createMicroPostUseCase, deleteMicroPostUseCase, getMicroPostsPaginated, getMicroPostsUseCase, getMicroPostUseCase, updateMicroPostUseCase } from "../use-cases/microPosts";
import { userHasAccessToMicroPost } from "../utils/microPosts";

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
        res.redirect("/auth/login");
        return;
    }

    const { title, content } = req.body;
    const authorId = req.user?.id;

    const microPost = await createMicroPostUseCase({ title, content, authorId });

    res.redirect(`/posts/post/${microPost.id}`);
});

microPostRouter.get("/:id/edit", async (req, res) => {
    const { id } = req.params;
    const microPost = await getMicroPostUseCase(id);

    if (!microPost) {
        res.status(404).send("MicroPost not found");
        return;
    }

    if (!(await userHasAccessToMicroPost( id, req.user?.id))) {
        res.status(401).send("Unauthorized to edit this micro post");
        return;
    }

    res.render("microPosts/edit", { post: microPost });
})

microPostRouter.patch("/:id/edit", async (req, res) => {
    const { id } = req.params;
    const microPost = await getMicroPostUseCase(id);

    if (!microPost) {
        res.status(404).send("MicroPost not found");
        return;
    }

    if (!(await userHasAccessToMicroPost( id, req.user?.id))) {
        res.status(401).send("Unauthorized to edit this micro post");
        return;
    }

    const { title, content } = req.body;

    await updateMicroPostUseCase( id, { title, content }, req.user?.id);

    res.redirect(`/posts/post/${id}`);
})

microPostRouter.delete("/:id/delete", async (req, res) => {
    const { id } = req.params;
    const microPost = await getMicroPostUseCase(id);

    if (!microPost) {
        res.status(404).send("MicroPost not found");
        return;
    }

    if (!(await userHasAccessToMicroPost(id, req.user?.id ))) {
        res.status(401).send("Unauthorized to delete this micro post");
        return;
    }

    await deleteMicroPostUseCase(req.user?.id!, id);

    res.redirect("/posts");
})


export default microPostRouter;
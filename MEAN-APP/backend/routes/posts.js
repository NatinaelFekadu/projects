import express from "express";

import { checkAuth } from "../middlewares/check-auth.js";
import { postsController } from "../controllers/posts.js";
import extractFile from "../middlewares/file.js";

export const postsRouter = express.Router();

postsRouter.post("", checkAuth, extractFile, postsController.createPost);

postsRouter.get("", postsController.getPosts);

postsRouter.get("/:id", postsController.getPost);

postsRouter.put("/:id", extractFile, checkAuth, postsController.editPost);

postsRouter.delete("/:id", checkAuth, postsController.deletePost);

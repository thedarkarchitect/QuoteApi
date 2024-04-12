import { Router } from "express";
import { getAuthors, createAuthor, getAuthor, updateAuthor, deleteAutor } from "../controllers/authors.controller.js";

const authorRouter = Router();

authorRouter.get("/", getAuthors);

authorRouter.post("/", createAuthor);

authorRouter.get("/:id", getAuthor);

authorRouter.patch("/:id", updateAuthor);

authorRouter.delete("/:id", deleteAutor);

export default authorRouter;
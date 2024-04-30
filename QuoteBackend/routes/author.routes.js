import { Router } from "express";
import { getAuthors, createAuthor, getAuthor, updateAuthor, deleteAutor, loginAuthor } from "../controllers/authors.controller.js";
import { validate, authorSchema } from "../utils/data-validator.js";
import { verifyToken } from "../utils/token-handler.js";

const authorRouter = Router();

authorRouter.get("/", verifyToken, getAuthors);

authorRouter.post("/register", validate(authorSchema), createAuthor);

authorRouter.post("/login", loginAuthor);

authorRouter.get("/:id", verifyToken, getAuthor);

authorRouter.patch("/:id", verifyToken, updateAuthor);

authorRouter.delete("/:id", verifyToken, deleteAutor);

export default authorRouter;
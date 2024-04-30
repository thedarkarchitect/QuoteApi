import { Router } from "express";
import { verifyToken } from "../utils/token-handler.js";
import { getQuotes, createQuote, updateQuote, getQuote, deleteQuote } from "../controllers/quotes.controller.js";


const quoteRouter = Router();

quoteRouter.get("/", verifyToken, getQuotes);

quoteRouter.post("/", verifyToken, createQuote);

quoteRouter.get("/:id", verifyToken, getQuote);

quoteRouter.patch("/:id", verifyToken, updateQuote);

quoteRouter.delete("/:id", verifyToken, deleteQuote);


export default quoteRouter;
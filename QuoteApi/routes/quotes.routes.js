import { Router } from "express";
import { getQuotes, createQuote, updateQuote, getQuote, deleteQuote } from "../controllers/quotes.controller.js";


const quoteRouter = Router();

quoteRouter.get("/", getQuotes);

quoteRouter.post("/", createQuote);

quoteRouter.get("/:id", getQuote);

quoteRouter.patch("/:id", updateQuote);

quoteRouter.delete("/:id", deleteQuote);


export default quoteRouter;
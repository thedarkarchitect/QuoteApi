import { Router } from "express";
import { getQuotes } from "../controllers/quotes.controller.js";


const quoteRouter = Router();

quoteRouter.get("/", getQuotes);



export default quoteRouter;
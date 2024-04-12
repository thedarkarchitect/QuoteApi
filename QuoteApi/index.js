import express from "express";
import morgan from "morgan";
import authorRouter from "./routes/author.routes.js";
import quoteRouter from "./routes/quotes.routes.js";

const app = express();
const PORT = 3300;

//middleware
app.use(express.json())
app.use(morgan("dev"))
app.use("/authors/", authorRouter);
app.use("/quotes/", quoteRouter);

app.listen(PORT, () => {console.log(`Server started on port ${PORT}`)});
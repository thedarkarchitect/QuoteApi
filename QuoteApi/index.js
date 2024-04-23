import app from "./server.js";

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {console.log(`Server started on port ${PORT}`)});
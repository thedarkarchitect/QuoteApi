import express from "express";
import morgan from "morgan";

const app = express();
const PORT = 3030;

//middleware
app.use(express.json())
app.use(morgan("dev"))

let quotes = [
    {
        id: 1,
        quote: "You cannot find peace by avoiding life",
        author: "Virginia Woolf"
    }
];

//read quote
app.get('/quotes', (req, res) => {
   res.send(quotes);
})

//create quote
app.post('/quotes', (req, res) => {
    const quote = req.body
    quotes.push(quote)
    res.send(quotes);
 }
)

//update quote
app.patch('/quotes/:id', (req, res) => {
    const id = +req.params.id //changing it to a number

    quotes.find((quote) => {
        if(quote.id === id) {
            quote.author = req.body.author
            quote.quote = req.body.quote
            console.log(quotes)
            res.send("Updated Array")
        } else {
            res.send("Author or quote not found")
        }
    })

})

//delete quote
app.delete('/quotes/:id', (req, res) => {
    const id = +req.params.id //changing it to a number

    quotes.find((quote) => {
        if(quote.id === id) {
            quotes.splice(id -1)
            console.log(quotes)
            res.send("Deleted quote")
        } else {
            res.send("Quote not deleted")
        }
    })
})
//TODO : CONSOLE LOG OUTPUT


app.listen(PORT,() => {console.log(`Server started on port ${PORT}`)});
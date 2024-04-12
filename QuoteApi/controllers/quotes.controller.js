import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getQuotes = async (req, res) => {
    try{
        const quotes = prisma.quote.findMany()
        res.json({
            quotes: quotes
        })
    } catch(err) {
        res.json({message: "There are no quotes"})
    }
};



export {getQuotes};
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getQuotes = async (req, res) => {
	try {
		const quotes = await prisma.quote.findMany({
			include: {
				author: true
			}
		});
		res.json({
			quotes: quotes,
		});
	} catch (err) {
		res.json({ message: "Can't get Quotes!", err: err });
	}
};

const createQuote = async (req, res) => {
	try {
		const newQuote = await prisma.quote.create({
			data: {
				...req.body,
				authorId: +req.body.authorId,
			},
		});

		res.json({ 
			messgae: "Quote created", 
			quote: newQuote 
		});
	} catch (err) {
		res.json({ message: "Quote not created!" });
	}
};

const updateQuote = async (req, res) => {
	try{
		const id = +req.params.id;
		const updatedQuote = await prisma.quote.update({
			where: {
				id: id
			},
			data: {
				...req.body, authorId: +req.body.authorId
			}
		});
		res.json({message: "Quote updated", quote: updatedQuote})
	}catch(err){
	res.json({message: "Quote not updated!"})
	}
};

const getQuote = async (req, res) => {
	try{
		const id = +req.params.id
		const quote = await prisma.quote.findUnique({
			where: {
				id: id
			},
			include:{
				author: true
			}
		})
		res.json({
			message: "Quote got successfully",
			quote: quote
		})
	}catch(err){
	res.json({message: "Can't get quote!"})
	}
}

const deleteQuote = async (req, res) => {
	try{	
		const id = +req.params.id
		const deletedQuote = await prisma.quote.delete({
			where: {
				id: id
			}
		});
		res.json({
			message: "Quote Deleted successfully",
			quote: deletedQuote
		})
	}catch(err){
		res.json({message: "Quote not deleted"})
	}
}

export { getQuotes, createQuote, updateQuote, getQuote, deleteQuote };

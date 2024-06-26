import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

const getQuotes = async (req, res) => {
	try {
		const quotes = await prisma.quote.findMany({
			include: {
				author: true,
			},
		});
		res.status(StatusCodes.OK).json({
			quotes: quotes,
		});
	} catch (err) {
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "Can't get Quotes!", err: err });
	}
};

const createQuote = async (req, res) => {
	try {
		const newQuote = await prisma.quote.create({
			data: {
				...req.body,
				authorId: +req.body.authorId,
			},
			include: {
				author: true,
			},
		});

		if (newQuote) {
			res.status(StatusCodes.CREATED).json({
				messgae: "Quote created",
				quote: newQuote,
			});
		} else {
			res.status(StatusCodes.NOT_IMPLEMENTED).json({
				messgae: "Quote not created",
				quote: newQuote,
			});
		}
	} catch (err) {
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "Quote not created!", err });
	}
};

const updateQuote = async (req, res) => {
	try {
		const id = +req.params.id;
		const updatedQuote = await prisma.quote.update({
			where: {
				id: id,
			},
			data: {
				...req.body,
				authorId: +req.body.authorId,
			},
			include: {
				author: true,
			},
		});
		res
			.status(StatusCodes.CREATED)
			.json({ message: "Quote updated", quote: updatedQuote });
	} catch (err) {
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "Quote not updated!", err });
	}
};

const getQuote = async (req, res) => {
	try {
		const id = +req.params.id;
		const quote = await prisma.quote.findUnique({
			where: {
				id: id,
			},
			include: {
				author: true,
			},
		});
		if (quote) {
			res.status(StatusCodes.OK).json({
				message: "Quote got successfully",
				quote: quote,
			});
		} else {
			res.status(StatusCodes.NOT_FOUND).json({
				message: "Quote id doesn't exist",
			});
		}
	} catch (error) {
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "Can't get quote!", error });
	}
};

const deleteQuote = async (req, res) => {
	try {
		const id = +req.params.id;
		const deletedQuote = await prisma.quote.delete({
			where: {
				id: id,
			},
		});

		res.status(StatusCodes.OK).json({
			message: "Quote Deleted successfully",
			quote: deletedQuote,
		});
	} catch (err) {
		res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: "Quote not deleted", err });
	}
};

export { getQuotes, createQuote, updateQuote, getQuote, deleteQuote };

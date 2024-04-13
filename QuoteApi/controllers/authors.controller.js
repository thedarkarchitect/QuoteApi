import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAuthors = async (req, res) => {
	try {
		const allAuthors = await prisma.author.findMany();

		res.json({
			authors: allAuthors,
		});
	} catch (err) {
		res.json({ message: "Can't get Authors!" });
	}
};

const getAuthor = async (req, res) => {
	try {
		const id = +req.params.id;

		const author = await prisma.author.findUnique({
			where: {
				id: id,
			},
		});
		res.json({
			message: "Author got Successfully",
			author: author,
		});
	} catch (err) {
		res.json({ message: "id doesn't exist" });
	}
};

const createAuthor = async (req, res) => {
	try {
		const newAuthor = await prisma.author.create({
			data: {
				...req.body,
				age: +req.body.age,
			},
		});
		res.json({
			message: "Author created",
			author: newAuthor,
		});
	} catch (err) {
		res.json({ message: "author not added!" });
	}
};

const updateAuthor = async (req, res) => {
	try {
		const id = +req.params.id;
		const updatedAuthor = await prisma.author.update({
			where: {
				id: id,
			},
			data: {
				...req.body,
				age: +req.body.age,
			},
		});
		res.json({ message: "Author has been updated", data: updatedAuthor });
	} catch (err) {
		res.json({ message: "author not updated" });
	}
};

const deleteAutor = async (req, res) => {
	const id = +req.params.id;

	try {
		const deleteAuthor = await prisma.author.delete({
			where: {
				id: id,
			},
		});
		res.json({ message: "Deleted Author", data: deleteAuthor });
	} catch (err) {
		res.json({ message: "Author Not Deleted", data: err });
	}
};

export { getAuthors, getAuthor, createAuthor, updateAuthor, deleteAutor };

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { createJWTToken } from "../utils/token-handler.js";

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
		const { email } = req.body;

		const author = await prisma.author.findUnique({
			where: {
				email: email
			}
		})

		if(author != null && author.email === email){
			res.status(StatusCodes.BAD_REQUEST).json({message: "Author with email already exists"});
		} else {
			let hash = await bcrypt.hash(req.body.password, 10);

			const registerAuthor = await prisma.author.create({
				data: {...req.body, age: +req.body.age, password: hash}
			});

			res.status(StatusCodes.CREATED).json({message: "User registered Successfully"});
		}
	} catch (err) {
		res.json({ message: "author not added!" });
	}
};

const loginAuthor =  async (req, res) => {
	try {
		const {email, password} = req.body;

		const author = await prisma.author.findUnique({
			where: {
				email: email,
			},
		});

		const verifyPassword = bcrypt.compareSync(password, author.password);

		if(verifyPassword){
			let data = { authorId: author.id, authorName: author.name, }
			const token = createJWTToken(data);
			res.status(StatusCodes.CREATED).json({message: "Author LoggedIn", token: token});
		}
	} catch (err) {
		res.status(StatusCodes.BAD_REQUEST).json({error: "Password or Email entered is incorrect. Login again"})
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

export { getAuthors, getAuthor, createAuthor, updateAuthor, deleteAutor, loginAuthor };

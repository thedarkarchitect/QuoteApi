import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { createJWTToken } from "../utils/token-handler.js";

const prisma = new PrismaClient();

const getAuthors = async (req, res) => {
	try {
		const allAuthors = await prisma.author.findMany();

		res.status(StatusCodes.OK).json({
			authors: allAuthors,
		});
	} catch (err) {
		res.json({ message: "Can't get Authors!", err });
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
		if(author){
			res.status(StatusCodes.OK).json({
				message: "Author got Successfully",
				author: author,
			});
		} else {
			res.status(StatusCodes.NOT_FOUND).json({
				message: "Author id doesn't exist"
			})
		}
	} catch (err) {
		res.status(StatusCodes.BAD_REQUEST).json({ message: "id doesn't exist", err });
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
			res.status(StatusCodes.NOT_ACCEPTABLE).json({message: "Author with email already exists"});
		} else {
			let hash = await bcrypt.hash(req.body.password, 10);

			const registerAuthor = await prisma.author.create({
				data: {...req.body, age: +req.body.age, password: hash}
			});

			res.status(StatusCodes.CREATED).json({message: "Author registered Successfully", registerAuthor});
		}
	} catch (err) {
		res.status(StatusCodes.BAD_REQUEST).json({ message: "Author not added!", err });
	}
};

const loginAuthor =  async (req, res) => {
	try {
		const {email, password} = req.body;

		if(!email || !password) {
			return res.status(StatusCodes.NOT_FOUND).json({message: "Provide email and password"})
		}

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
		} else {
			res
		}
	} catch (err) {
		await prisma.$disconnect()
		res.status(StatusCodes.BAD_REQUEST).json({message: "Password or Email entered is incorrect. Login again"})
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
		if(updateAuthor){
			res.status(StatusCodes.CREATED).json({ message: "Author has been updated", data: updatedAuthor });
		} else {
			res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: "Author has not been updated"})
		}
		
	} catch (error) {
		res.status(StatusCodes.BAD_REQUEST).json({ message: "Author not updated", error});
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

		if(deleteAuthor){
			res.status(StatusCodes.NOT_FOUND)
		}
		
		res.status(StatusCodes.OK).json({ message: "Deleted Author", data: deleteAuthor });
		
	} catch (error) {
		res.status(StatusCodes.BAD_REQUEST).json({ message: "Author Not Deleted", error: error });
	}
};

export { getAuthors, getAuthor, createAuthor, updateAuthor, deleteAutor, loginAuthor };

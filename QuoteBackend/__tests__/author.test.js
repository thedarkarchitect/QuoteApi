import app from "../server.js";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import request from "supertest";

const prisma = new PrismaClient();

let token;

describe("Register author", () => {
	it("route should return 201", async () => {
		const result = await request(app)
			.post("/authors/register")
			.send({
				name: "Mart",
				email: "mart@gmail.com",
				password: "12345",
				age: 28,
			});

		expect(result.status).toBe(StatusCodes.CREATED);
		expect(result.body.message).toBe("Author registered Successfully");
	});

	it("route should return 502 ", async () => {
		const result = await request(app)
			.post("/authors/register")
			.send({
				name: "Mart",
				email: "mart@gmail.com",
				password: "12345",
				age: 28,
			});

		expect(result.status).toBe(StatusCodes.NOT_ACCEPTABLE);
		expect(result.body.message).toBe("Author with email already exists");
	});

	it("route should return 502 ", async () => {
		const result = await request(app)
			.post("/authors/register")
			.send({
				name: "Reynold",
				email: "reynold@gmail.com",
				password: "1234",
				age: 23,
			});

		expect(result.status).toBe(StatusCodes.NOT_ACCEPTABLE);
		expect(result.body.message).toBe("Author with email already exists");
	});
});

describe("Author Login", () => {
	it("empty field", async () => {
		const response = await request(app).post("/authors/login").send({});

		expect(response.status).toBe(StatusCodes.NOT_FOUND);
		expect(response.body.message).toBe("Provide email and password");
	});

	it("should return token and 201", async () => {
		const response = await request(app)
			.post("/authors/login")
			.send({ email: "dorian@gmail.com", password: "1234" });

		expect(response.status).toBe(StatusCodes.CREATED);
		expect(response.body.message).toBe("Author LoggedIn");
		expect(response.body.token).toBeDefined();
		token = response.body.token;
	});
});

describe("get all authors", () => {
	it("will return all authors", async () => {
		const response = await request(app)
			.get(/authors/)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(StatusCodes.OK);
		expect(response.body.authors).toEqual(
			expect.arrayContaining([
				{
					id: expect.any(Number),
					name: expect.any(String),
					email: expect.any(String),
					password: expect.any(String),
					age: expect.any(Number),
				},
			])
		);
	});
});

describe("get author by id", () => {
	it("will return author", async () => {
		//we need to an author from db to provide an id
		const author = await prisma.author.findFirst();
		const response = await request(app)
			.get(`/authors/${author.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(StatusCodes.OK);
		expect(response.body.author).toBeDefined();
	});

	it("return 404 if id does not exit", async () => {
		const response = await request(app)
			.get("/authors/898")
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(StatusCodes.NOT_FOUND);
	});
});

describe("Update the author information", () => {
	it("Failed to update author", async () => {
		const updateAuthor = {
			age: 98,
		};

		const response = await request(app)
			.patch("/authors/87")
			.send(updateAuthor)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(StatusCodes.BAD_REQUEST);
		expect(response.body.message).toBe("Author not updated");
	});

	it("update author by id", async () => {
		const author = await prisma.author.findFirst();

		const updateAuthor = {
			//update information
			age: 98,
		};

		const response = await request(app)
			.patch(`/authors/${author.id}`)
			.send(updateAuthor)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(StatusCodes.CREATED);
		expect(response.body.message).toBe("Author has been updated");
	});
});

describe("Delete author", () => {
	it("Fail to delete author by id", async () => {
		const response = await request(app)
			.delete("/author/897")
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(StatusCodes.NOT_FOUND);
	});

	it("should delete the author with the given id", async () => {
		const author = await prisma.author.findFirst({
			orderBy: {
				id: "desc",
			},
		});

		const response = await request(app)
			.delete(`/authors/${author.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(StatusCodes.OK);
		expect(response.body.message).toBe("Deleted Author");

		//verify the author is deleted
		const deletedAuthor = await prisma.author.findUnique({
			where: {
				id: author.id,
			},
		});
		expect(deletedAuthor).toBeNull();
	});
});

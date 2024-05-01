import app from "../server.js";
import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import request from "supertest";

const prisma = new PrismaClient();
let token;

test("get the token", async () => {
	const response = await request(app)
		.post("/authors/login")
		.send({ email: "dorian@gmail.com", password: "1234" });

	expect(response.status).toBe(StatusCodes.CREATED);
	expect(response.body.token).toBeDefined();
	token = response.body.token;
	console.log(token);
});

describe("Get all the quotes in the db", () => {
	it("no quotes returned", async () => {
		const response = await request(app)
            .get("/quotes/");

		expect(response.status).toBe(StatusCodes.BAD_REQUEST);
	});

	it("return all the quotes", async () => {
		const response = await request(app)
			.get("/quotes/")
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(StatusCodes.OK);
		expect("application/json");
	});
});

describe("test the creation of a quote", () =>{
    it("create a quote", async () => {
        const response = await request(app)
            .post("/quotes/")
            .send({text: "What is a weed? A plant whose virtues have not yet been discovered.", authorId: 2})
            .set("Authorization",  `Bearer ${token}`);
        
        expect(response.status).toBe(StatusCodes.CREATED);
    });
});



describe("get a quote by id", () => {
    it("give an id that doesn't exists", async () => {
        const response = await request(app)
            .get("/quotes/6565")
            .set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("give an id that exists", async () => {
        const quote = await prisma.quote.findFirst();
        const response = await request(app)
            .get(`/quotes/${quote.id}`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(StatusCodes.OK)
        expect(response.body.quote).toBeDefined()
    });
});

describe("testing update route of quote", () => {
    it("wrong id update", async () => {
        const response = await request(app)
            .patch("/quotes/8686")
            .set("Authorization", `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("correct id update", async () => {
        const quote = await prisma.quote.findFirst();
        const response = await request(app)
            .patch(`/quotes/${quote.id}`)
            .send({authorId: 3})
            .set("Authorization",  `Bearer ${token}`);
        
        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body.message).toBe("Quote updated")
        expect(response.body.quote).toBeDefined()
    })
});

describe("delete a quote by id", () => {
    it("failed to delete a quote", async () => {
        const response = await request(app)
            .delete("/quotes/5465")
            .set("Authorization", `Bearer ${token}`)
        
        expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("quote delete", async () => {
        const quote = await prisma.quote.findFirst({
            orderBy: {
                id: "desc"
            }
        })
        const response = await request(app)
            .delete(`/quotes/${quote.id}`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.message).toBe("Quote Deleted successfully")
    })
})
import app from "../server.js";
import request from "supertest";

test("get all quotes with 200 status code", async () => {
	const response = await request(app)
        .get("/quotes");
	expect(response.status).toEqual(201);
    expect("application/json")
});

test("get a quote with 200 status code", async () => {
    const response = await request(app)
        .get("/quotes/2");
    expect(response.status).toEqual(201)
    expect("application/json")
});

test("create an author", async () => {

} );

import { response } from "express";
import app from "../server.js";
import { request } from "supertest";

test('get all quotes with 200 status code', async () => {
    let response = await request(app).get("/quotes").expect(response.status).toEqual(200)
});
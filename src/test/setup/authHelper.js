import request from "supertest";
import { createApp } from "../../app.js";

const app = createApp();

export async function loginAndGetToken(email, password) {
  const res = await request(app).post("/api/login").send({ email, password });
  return res.body.token;
}

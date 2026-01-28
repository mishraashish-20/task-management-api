import request from "supertest";
import "../test/setup/globalSetup.js"
import { createApp } from "../app.js";

const app = createApp();

describe("Auth APIs", () => {
  test("POST /api/login should return token for valid credentials", async () => {
    const res = await request(app).post("/api/login").send({
      email: "admin@test.com",
      password: "Admin@123",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("admin@test.com");
  });

  test("POST /api/login should fail for invalid credentials", async () => {
    const res = await request(app).post("/api/login").send({
      email: "admin@test.com",
      password: "wrong",
    });

    expect(res.status).toBe(401);
  });

  test("POST /api/register should create USER role by default", async () => {
    const res = await request(app).post("/api/register").send({
      name: "New User",
      email: "newuser@test.com",
      password: "NewUser@123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("USER");
  });
});

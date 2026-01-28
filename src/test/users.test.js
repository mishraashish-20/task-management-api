import request from "supertest";
import "../test/setup/globalSetup.js";
import { createApp } from "../app.js";
import { loginAndGetToken } from "./setup/authHelper.js";

const app = createApp();

describe("Users APIs (Admin only)", () => {
  let adminToken, managerToken;

  beforeAll(async () => {
    adminToken = await loginAndGetToken("admin@test.com", "Admin@123");
    managerToken = await loginAndGetToken("manager@test.com", "Manager@123");
  });

  test("GET /api/users should work for ADMIN", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  test("GET /api/users should fail for MANAGER (403)", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${managerToken}`);

    expect(res.status).toBe(403);
  });

  test("POST /api/users should create user for ADMIN", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Created User",
        email: "created@test.com",
        password: "Created@123",
        role: "USER",
      });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("created@test.com");
  });

  test("DELETE /api/users/:id should deactivate user (ADMIN)", async () => {
    const created = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "To Delete",
        email: "todelete@test.com",
        password: "Delete@123",
        role: "USER",
      });

    const userId = created.body.user.id;

    const del = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(del.status).toBe(200);
    expect(del.body.deactivated).toBe(true);
  });
});

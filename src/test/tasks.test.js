import request from "supertest";
import "../test/setup/globalSetup.js";
import { createApp } from "../../src/app.js";
import { loginAndGetToken } from "./setup/authHelper.js";
import { seededUsers } from "./setup/globalSetup.js";

const app = createApp();

describe("Tasks APIs", () => {
  let adminToken, managerToken, userToken;
  let taskId;

  beforeAll(async () => {
    adminToken = await loginAndGetToken("admin@test.com", "Admin@123");
    managerToken = await loginAndGetToken("manager@test.com", "Manager@123");
    userToken = await loginAndGetToken("user@test.com", "User@123");
  });

  beforeEach(async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Task for tests",
        description: "Created in beforeEach",
        assignedTo: seededUsers.user.id,
      });

    taskId = res.body.task._id;
  });

  test("USER cannot create task (403)", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "User Task", assignedTo: seededUsers.user.id });

    expect(res.status).toBe(403);
  });

  test("USER can update only status for assigned task", async () => {
    const ok = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ status: "done" });

    expect(ok.status).toBe(200);
    expect(ok.body.task.status).toBe("done");

    const bad = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Not allowed" });

    expect(bad.status).toBe(403);
  });

  test("ADMIN can delete task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.deleted).toBe(true);
  });
});

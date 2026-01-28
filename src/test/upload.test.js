import request from "supertest";
import "../test/setup/globalSetup.js";
import { createApp } from "../../src/app.js";
import { loginAndGetToken } from "./setup/authHelper.js";
import { seededUsers } from "./setup/globalSetup.js";

const app = createApp();

describe("Task Upload API", () => {
  let adminToken;
  let taskId;

  beforeAll(async () => {
    adminToken = await loginAndGetToken("admin@test.com", "Admin@123");
  });

  beforeEach(async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Task for upload",
        assignedTo: seededUsers.user.id,
      });

    taskId = created.body.task._id;
  });

  test("ADMIN can upload attachments", async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/upload`)
      .set("Authorization", `Bearer ${adminToken}`)
      .attach("files", Buffer.from("hello file"), "sample.txt");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.task.attachments)).toBe(true);
    expect(res.body.task.attachments.length).toBeGreaterThan(0);
  });
});

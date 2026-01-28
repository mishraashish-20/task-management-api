import request from "supertest";
import "../test/setup/mockMailer.js";
import "../test/setup/globalSetup.js";
import { createApp } from "../../src/app.js";
import { loginAndGetToken } from "./setup/authHelper.js";
import { seededUsers } from "./setup/globalSetup.js";
import { sendMailMock } from "./setup/mockMailer.js";

const app = createApp();

describe("Notify API", () => {
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
        title: "Task for notify",
        assignedTo: seededUsers.user.id,
      });

    taskId = created.body.task._id;
    sendMailMock.mockClear();
  });

  test("ADMIN can notify assigned user", async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/notify`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.notified).toBe(true);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });
});

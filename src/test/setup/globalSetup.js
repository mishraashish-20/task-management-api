import { connectTestDbs, closeTestDbs, clearMongo } from "./testDb.js";
import { seedBaseUsers } from "./seedUsers.js";

export let seededUsers;

beforeAll(async () => {
  await connectTestDbs();
  seededUsers = await seedBaseUsers();
});

beforeEach(async () => {
  await clearMongo();
});

afterAll(async () => {
  await closeTestDbs();
});

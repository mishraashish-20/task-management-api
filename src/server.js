import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { connectMySQL } from "./db/mysql.js";
import { connectMongo } from "./db/mongo.js";
import { User } from "./models/mysql/User.js"; // ensure model is registered
import { sequelize } from "./db/mysql.js";
import { seedAdminIfNeeded } from "./services/seed.service.js";
import { seedManagerIfNeeded } from "./services/seed.service.js";
import { syncMySQLModels } from "./db/mysql.sync.js";

import "dotenv/config";



async function bootstrap() {
  await connectMySQL();
  await syncMySQLModels();
  await seedAdminIfNeeded();
  await seedManagerIfNeeded()


  await connectMongo();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});

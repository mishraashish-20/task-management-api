import mongoose from "mongoose";
import { sequelize } from "../../db/mysql.js";

export async function connectTestDbs() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  await mongoose.connect(process.env.MONGO_URI);
}

export async function clearMongo() {
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) {
    await c.deleteMany({});
  }
}

export async function closeTestDbs() {
  await sequelize.close();
  await mongoose.disconnect();
}

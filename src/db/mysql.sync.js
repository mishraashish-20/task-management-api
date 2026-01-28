import { sequelize } from "./mysql.js";

import "../models/mysql/User.js";

export async function syncMySQLModels() {
  await sequelize.sync({ alter: false, force: false });
  console.log("MySQL tables synced");
}

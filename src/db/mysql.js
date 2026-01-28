import { Sequelize } from "sequelize";
import "dotenv/config";

function mustGet(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const sequelize = new Sequelize(
  mustGet("MYSQL_DB"),          
  mustGet("MYSQL_USER"),
  mustGet("MYSQL_PASSWORD"),
  {
    host: mustGet("MYSQL_HOST"),
    port: Number(process.env.MYSQL_PORT || 3306),
    dialect: "mysql",
    logging: false,
  }
);

export async function connectMySQL() {
  await sequelize.authenticate();
  console.log("MySQL connected (Sequelize)");
}

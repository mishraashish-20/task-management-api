import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  mysql: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    db: process.env.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },

  mongoUri: process.env.MONGO_URI,

  uploadDir: process.env.UPLOAD_DIR || "uploads",

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM,
  },
};

const required = ["jwtSecret", "mongoUri", "smtp.host", "smtp.user", "smtp.pass"];
if (!env.jwtSecret) throw new Error("Missing env: JWT_SECRET");
if (!env.mongoUri) throw new Error("Missing env: MONGO_URI");

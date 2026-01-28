import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: { user: env.smtp.user, pass: env.smtp.pass },
});

export async function sendTaskNotificationEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
  });
}

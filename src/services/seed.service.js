import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import { User } from "../models/mysql/User.js";

export async function seedAdminIfNeeded() {
  const seedEnabled =
    String(process.env.SEED_ADMIN || "false").toLowerCase() === "true";
  if (!seedEnabled) return;

  if (env.nodeEnv === "production") {
    return;
  }

  const name = process.env.SEED_ADMIN_NAME || "Admin";
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set when SEED_ADMIN=true",
    );
  }

  const existing = await User.findOne({ where: { email } });

  if (existing) {
    if (existing.role !== "ADMIN") {
      await existing.update({ role: "ADMIN" });
      console.log(`Seed Admin: Upgraded existing user to ADMIN -> ${email}`);
    } else {
      console.log(`Seed Admin: Already exists -> ${email}`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await User.create({
    name,
    email,
    passwordHash,
    role: "ADMIN",
    managerId: null,
  });

  console.log(`Seed Admin: Created -> ${admin.email} (password: ${password})`);
}

export async function seedManagerIfNeeded() {
  const seedEnabled =
    String(process.env.SEED_MANAGER || "false").toLowerCase() === "true";
  if (!seedEnabled) return;

  if (env.nodeEnv === "production") {
    return;
  }

  const name = process.env.SEED_MANAGER_NAME || "Default Manager";
  const email = process.env.SEED_MANAGER_EMAIL;
  const password = process.env.SEED_MANAGER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "SEED_MANAGER_EMAIL and SEED_MANAGER_PASSWORD must be set when SEED_MANAGER=true",
    );
  }

  const existing = await User.findOne({ where: { email } });

  if (existing) {
    if (existing.role !== "MANAGER") {
      await existing.update({ role: "MANAGER" });
      console.log(
        `Seed Manager: Upgraded existing user to MANAGER -> ${email}`,
      );
    } else {
      console.log(`Seed Manager: Already exists -> ${email}`);
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const manager = await User.create({
    name,
    email,
    passwordHash,
    role: "MANAGER",
    managerId: null,
  });

  console.log(
    `Seed Manager: Created -> ${manager.email} (password: ${password})`,
  );
}

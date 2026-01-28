import bcrypt from "bcrypt";
import { User } from "../../models/mysql/User.js";

export async function seedBaseUsers() {
  const admin = await User.create({
    name: "Admin",
    email: "admin@test.com",
    passwordHash: await bcrypt.hash("Admin@123", 10),
    role: "ADMIN",
    managerId: null,
  });

  const manager = await User.create({
    name: "Manager",
    email: "manager@test.com",
    passwordHash: await bcrypt.hash("Manager@123", 10),
    role: "MANAGER",
    managerId: null,
  });

  const user = await User.create({
    name: "User",
    email: "user@test.com",
    passwordHash: await bcrypt.hash("User@123", 10),
    role: "USER",
    managerId: manager.id, // user in manager's team
  });

  return { admin, manager, user };
}

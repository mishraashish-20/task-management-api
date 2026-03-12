import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/mysql/User.js";

export async function createUserAdmin(payload) {
  const { name, email, password, role, managerId = null } = payload;

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new ApiError(409, "Email already exists");

  if (managerId) {
    const manager = await User.findByPk(managerId);
    if (!manager || manager.role !== "MANAGER") {
      throw new ApiError(400, "managerId must belong to a MANAGER user");
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    managerId,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    managerId: user.managerId,
  };
}

export async function listUsers() {
  const users = await User.findAll({
    attributes: [
      "id",
      "name",
      "email",
      "role",
      "managerId",
      "createdAt",
      "updatedAt",
    ],
    where: { isActive: true },
  });
  return users;
}

export async function updateUserAdmin(id, payload) {
  const user = await User.findByPk(id);
  if (!user) throw new ApiError(404, "User not found");

  if (payload.managerId) {
    const manager = await User.findByPk(payload.managerId);
    if (!manager || manager.role !== "MANAGER") {
      throw new ApiError(400, "managerId must belong to a MANAGER user");
    }
  }

  await user.update(payload);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    managerId: user.managerId,
  };
}

export async function deactivateUser(userId, performedBy) {
  const user = await User.findByPk(userId);

  if (!user) throw new ApiError(404, "User not found");

  if (Number(userId) === Number(performedBy)) {
    throw new ApiError(400, "Admin cannot deactivate self");
  }

  if (user.role === "ADMIN") {
    const admins = await User.count({
      where: { role: "ADMIN", isActive: true },
    });
    if (admins <= 1)
      throw new ApiError(400, "Cannot deactivate last active admin");
  }

  await user.update({ isActive: false });

  return { deactivated: true };
}

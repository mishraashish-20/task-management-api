import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/mysql/User.js";
import { signJwt } from "../utils/jwt.js";

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new ApiError(409, "Email already registered");
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: "USER" });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ where: { email, isActive: true } });
  if (!user) throw new ApiError(401, "Invalid credentials");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid credentials");
  const token = signJwt({ id: user.id, role: user.role });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUser, loginUser } from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);
  res.json(data);
});

import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createUserAdmin,
  listUsers,
  updateUserAdmin,
  deactivateUser,
} from "../services/users.service.js";

export const createUser = asyncHandler(async (req, res) => {
  const user = await createUserAdmin(req.body);
  res.status(201).json({ user });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await listUsers();
  res.json({ users });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserAdmin(Number(req.params.id), req.body);
  res.json({ user });
});

export async function deleteUserController(req, res, next) {
  try {
    const { id } = req.params;
    const result = await deactivateUser(id, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

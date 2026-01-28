import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createUserSchema, updateUserSchema } from "../validators/users.validators.js";
import { createUser, getUsers, updateUser, deleteUserController } from "../controllers/users.controller.js";

export const usersRouter = Router();

usersRouter.use(requireAuth, allowRoles("ADMIN"));

usersRouter.post("/", validate(createUserSchema), createUser);
usersRouter.get("/", getUsers);
usersRouter.put("/:id", validate(updateUserSchema), updateUser);
usersRouter.delete("/:id", deleteUserController);

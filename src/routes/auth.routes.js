import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
import { register, login } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);

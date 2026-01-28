import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { usersRouter } from "./users.routes.js";
import { tasksRouter } from "./tasks.routes.js";
import { docsRouter } from "./docs.routes.js";

export const router = Router();

router.get("/health", (req, res) => res.json({ ok: true }));

// Docs
router.use(docsRouter);

// API routes
router.use(authRouter);
router.use("/users", usersRouter);
router.use("/tasks", tasksRouter);

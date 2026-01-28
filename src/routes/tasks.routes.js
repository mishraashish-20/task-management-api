import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createTaskSchema, updateTaskSchema, idParamSchema } from "../validators/tasks.validators.js";
import {
  listTasks,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  uploadTaskAttachments,
  notifyAssignee,
} from "../controllers/tasks.controller.js";
import { createTaskUploadMiddleware } from "../services/upload.service.js";
import { allowRoles } from "../middlewares/rbac.middleware.js";

export const tasksRouter = Router();
const upload = createTaskUploadMiddleware();

tasksRouter.use(requireAuth);

tasksRouter.get("/", listTasks);
tasksRouter.post("/", validate(createTaskSchema), createTaskHandler);

tasksRouter.put("/:id", validate(updateTaskSchema), updateTaskHandler);

tasksRouter.delete("/:id", validate(idParamSchema), allowRoles("ADMIN"), deleteTaskHandler);

tasksRouter.post(
  "/:id/upload",
  validate(idParamSchema),
  upload.array("files", 10),
  uploadTaskAttachments
);

tasksRouter.post("/:id/notify", validate(idParamSchema), notifyAssignee);

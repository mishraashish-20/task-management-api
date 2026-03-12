import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  getTasksForUser,
  createTask,
  updateTask,
  deleteTask,
  addAttachments,
  getTaskById,
} from "../services/tasks.service.js";
import { User } from "../models/mysql/User.js";
import { sendTaskNotificationEmail } from "../services/mail.service.js";

export const listTasks = asyncHandler(async (req, res) => {
  const tasks = await getTasksForUser(req.user);
  res.json({ tasks });
});

export const createTaskHandler = asyncHandler(async (req, res) => {
  const task = await createTask(req.user, req.body);
  res.status(201).json({ task });
});

export const updateTaskHandler = asyncHandler(async (req, res) => {
  if (req.user.role === "USER") {
    const keys = Object.keys(req.body);
    const allowed = ["status"];
    const invalid = keys.filter((k) => !allowed.includes(k));
    if (invalid.length) throw new ApiError(403, "User can update only status");
  }

  const task = await updateTask(req.user, req.params.id, req.body);
  res.json({ task });
});

export const deleteTaskHandler = asyncHandler(async (req, res) => {
  const result = await deleteTask(req.user, req.params.id);
  res.json(result);
});

export const uploadTaskAttachments = asyncHandler(async (req, res) => {
  const filePaths = (req.files || []).map((f) => f.path);
  const task = await addAttachments(req.user, req.params.id, filePaths);
  res.json({ task });
});

export const notifyAssignee = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.id);

  if (req.user.role === "ADMIN") {
  } else if (req.user.role === "MANAGER") {
    if (task.createdBy !== req.user.id)
      throw new ApiError(
        403,
        "Manager can notify only for tasks created by them",
      );
  } else {
    throw new ApiError(403, "User cannot send notifications");
  }

  const assignee = await User.findByPk(task.assignedTo);
  if (!assignee) throw new ApiError(400, "Assigned user not found in MySQL");

  await sendTaskNotificationEmail({
    to: assignee.email,
    subject: `Task Assigned/Updated: ${task.title}`,
    html: `
      <h3>${task.title}</h3>
      <p>Status: <b>${task.status}</b></p>
      <p>${task.description || ""}</p>
      <p>Task ID: ${task._id}</p>
    `,
  });

  task.history.push({
    action: "NOTIFIED",
    by: req.user.id,
    meta: { to: assignee.email },
  });
  await task.save();

  res.json({ notified: true });
});

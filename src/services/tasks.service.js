import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/mongo/Task.js";
import { User } from "../models/mysql/User.js";

export async function getTasksForUser(authUser) {
  if (authUser.role === "ADMIN") {
    return Task.find().sort({ createdAt: -1 });
  }

  if (authUser.role === "MANAGER") {
    const teamUsers = await User.findAll({
      where: { managerId: authUser.id },
      attributes: ["id"],
    });
    const teamIds = teamUsers.map((u) => u.id);

    return Task.find({
      $or: [{ createdBy: authUser.id }, { assignedTo: { $in: teamIds } }],
    }).sort({ createdAt: -1 });
  }

  return Task.find({ assignedTo: authUser.id }).sort({ createdAt: -1 });
}

export async function createTask(authUser, { title, description, status, assignedTo }) {
  if (!["ADMIN", "MANAGER"].includes(authUser.role)) {
    throw new ApiError(403, "Only Admin/Manager can create tasks");
  }

  const assignee = await User.findByPk(assignedTo);
  if (!assignee) throw new ApiError(400, "assignedTo user not found");

  if (authUser.role === "MANAGER") {
    if (assignee.managerId !== authUser.id) {
      throw new ApiError(403, "Manager can assign tasks only to their team");
    }
  }

  const task = await Task.create({
    title,
    description,
    status,
    assignedTo,
    createdBy: authUser.id,
    history: [{ action: "CREATED", by: authUser.id, meta: { assignedTo, status } }],
  });

  return task;
}

export async function getTaskById(id) {
  const task = await Task.findById(id);
  if (!task) throw new ApiError(404, "Task not found");
  return task;
}

export async function updateTask(authUser, id, updatePayload) {
  const task = await getTaskById(id);

  if (authUser.role === "ADMIN") {
  } else if (authUser.role === "MANAGER") {
    if (task.createdBy !== authUser.id) {
      throw new ApiError(403, "Manager can update only tasks created by them");
    }
    if (updatePayload.assignedTo) {
      const assignee = await User.findByPk(updatePayload.assignedTo);
      if (!assignee) throw new ApiError(400, "assignedTo user not found");
      if (assignee.managerId !== authUser.id) {
        throw new ApiError(403, "Manager can assign tasks only to their team");
      }
    }
  } else {
    if (task.assignedTo !== authUser.id) {
      throw new ApiError(403, "User can update only their assigned tasks");
    }
  }

  Object.assign(task, updatePayload);

  task.history.push({
    action: "UPDATED",
    by: authUser.id,
    meta: { updatePayload },
  });

  await task.save();
  return task;
}

export async function deleteTask(authUser, id) {
  if (authUser.role !== "ADMIN") {
    throw new ApiError(403, "Only Admin can delete tasks");
  }
  const task = await getTaskById(id);
  await task.deleteOne();
  return { deleted: true };
}

export async function addAttachments(authUser, id, filePaths) {
  const task = await getTaskById(id);

  if (authUser.role === "ADMIN") {
  } else if (authUser.role === "MANAGER") {
    if (task.createdBy !== authUser.id) throw new ApiError(403, "Manager can upload only on tasks created by them");
  } else {
    if (task.assignedTo !== authUser.id) throw new ApiError(403, "User can upload only on tasks assigned to them");
  }

  task.attachments.push(...filePaths);
  task.history.push({ action: "UPLOADED", by: authUser.id, meta: { files: filePaths } });
  await task.save();

  return task;
}

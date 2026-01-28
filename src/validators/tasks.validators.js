import Joi from "joi";

export const createTaskSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(2).max(150).required(),
    description: Joi.string().allow(""),
    status: Joi.string().valid("todo", "in-progress", "done").default("todo"),
    assignedTo: Joi.number().integer().positive().required(),
  }).required(),
});

export const updateTaskSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(2).max(150),
    description: Joi.string().allow(""),
    status: Joi.string().valid("todo", "in-progress", "done"),
    assignedTo: Joi.number().integer().positive(),
  }).required(),
  params: Joi.object({
    id: Joi.string().required(), // Mongo ObjectId as string
  }).required(),
});

export const idParamSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required(),
  }).required(),
});

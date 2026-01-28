import Joi from "joi";

export const createUserSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    role: Joi.string().valid("ADMIN", "MANAGER", "USER").required(),
    managerId: Joi.number().integer().positive().allow(null),
  }).required(),
});

export const updateUserSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100),
    role: Joi.string().valid("ADMIN", "MANAGER", "USER"),
    managerId: Joi.number().integer().positive().allow(null),
  }).required(),
  params: Joi.object({
    id: Joi.number().integer().positive().required(),
  }).required(),
});

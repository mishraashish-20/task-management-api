import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  const status = err instanceof ApiError ? err.statusCode : 500;

  const response = {
    message: err.message || "Internal Server Error",
  };

  if (err instanceof ApiError && err.details) response.details = err.details;

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

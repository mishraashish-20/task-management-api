import { ApiError } from "../utils/ApiError.js";
import { verifyJwt } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid Authorization header"));
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = verifyJwt(token);
    req.user = decoded; 
    next();
  } catch (e) {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

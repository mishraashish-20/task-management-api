import path from "path";
import fs from "fs";
import multer from "multer";
import { env } from "../config/env.js";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function createTaskUploadMiddleware() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const taskId = req.params.id;
      const dest = path.join(env.uploadDir, "tasks", taskId);
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${Date.now()}_${safeName}`);
    },
  });

  return multer({ storage });
}

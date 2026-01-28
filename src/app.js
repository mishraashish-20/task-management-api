import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { router } from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.use("/api", router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

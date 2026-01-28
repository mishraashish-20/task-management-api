import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { loadOpenApiSpec } from "../config/swagger.js";

export const docsRouter = Router();

const spec = loadOpenApiSpec();

docsRouter.use("/docs", swaggerUi.serve);
docsRouter.get("/docs", swaggerUi.setup(spec));

docsRouter.get("/docs/openapi.json", (req, res) => {
  res.json(spec);
});

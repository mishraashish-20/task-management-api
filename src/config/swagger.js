import path from "path";
import fs from "fs";
import YAML from "yaml";

export function loadOpenApiSpec() {
  const specPath = path.resolve(process.cwd(), "src", "docs", "openapi.yaml");
  const file = fs.readFileSync(specPath, "utf8");
  return YAML.parse(file);
}

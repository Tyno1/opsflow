import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const dir = dirname(fileURLToPath(import.meta.url));

export default parse(readFileSync(join(dir, "../openapi.yaml"), "utf8"));

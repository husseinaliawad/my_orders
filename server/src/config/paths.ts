import path from "path";
import { fileURLToPath } from "url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

export const serverRoot = path.resolve(moduleDir, "..", "..");
export const uploadDir = path.join(serverRoot, "uploads");
export const legacyUploadDir = path.join(serverRoot, "src", "uploads");
export const envPath = path.join(serverRoot, ".env");

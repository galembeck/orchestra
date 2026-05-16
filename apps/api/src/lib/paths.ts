import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// apps/api/uploads — two levels up from src/lib/
export const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");

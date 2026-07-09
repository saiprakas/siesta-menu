import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(readFileSync(join(__dirname, "serviceAccountKey.json"), "utf8"));
const app = initializeApp({ credential: cert(serviceAccount) });
const storage = getStorage(app).storageClient; // underlying @google-cloud/storage client

try {
  const [buckets] = await storage.getBuckets();
  console.log("Buckets visible to this service account:");
  buckets.forEach((b) => console.log(" -", b.name));
  if (buckets.length === 0) console.log("(none found — Storage may not be provisioned yet, or this account lacks project-level access)");
} catch (e) {
  console.error("List failed:", e.message);
}

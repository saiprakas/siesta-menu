import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = join(__dirname, "serviceAccountKey.json");
if (!existsSync(KEY_PATH)) {
  console.error(`\nMissing ${KEY_PATH}\n`);
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(KEY_PATH, "utf8"));
const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);
const docRef = db.collection("siesta").doc("data");

const NEW_PASSWORD = "SIESTA26";

async function main() {
  // Dot-notation is required here — passing a nested { settings: {...} }
  // object with merge:true would REPLACE the whole settings map (wiping
  // out name/phone/address/hours/etc), not just update one field inside it.
  await docRef.update({ "settings.opsPassword": NEW_PASSWORD, updatedAt: Date.now() });
  console.log(`Done. Ops password set.`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

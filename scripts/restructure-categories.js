/* ============================================================
   Removes the Cakes category and splits "Shakes & Thickshakes"
   into two separate categories: Shakes (milkshakes) and
   Thickshakes. Reads/writes the LIVE Firestore document, only
   ever touching `categories` (merge:true).
   ============================================================ */

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

async function main() {
  const snap = await docRef.get();
  if (!snap.exists) throw new Error("Live menu document doesn't exist.");
  const data = snap.data();

  // 1. Remove Cakes
  const beforeCount = data.categories.length;
  data.categories = data.categories.filter((c) => c.id !== "cakes");
  if (data.categories.length < beforeCount) {
    console.log("Removed category: Cakes");
  } else {
    console.log("Cakes category not found (already removed?)");
  }

  // 2. Split Shakes & Thickshakes -> Shakes (ms) + Thickshakes (ts)
  const shakesIdx = data.categories.findIndex((c) => c.id === "shakes");
  if (shakesIdx >= 0) {
    const shakesCat = data.categories[shakesIdx];
    const msItems = shakesCat.items.filter((it) => it.id.endsWith("-ms"));
    const tsItems = shakesCat.items.filter((it) => it.id.endsWith("-ts"));
    const otherItems = shakesCat.items.filter((it) => !it.id.endsWith("-ms") && !it.id.endsWith("-ts"));

    shakesCat.name = "Shakes";
    shakesCat.desc = "Classic milkshakes, blended thick and served chilled.";
    shakesCat.items = [...msItems, ...otherItems];

    const thickshakesCat = {
      id: "thickshakes",
      name: "Thickshakes",
      icon: "🥤",
      desc: "Extra-thick indulgence, spoonable and generously topped.",
      addons: [...shakesCat.addons],
      items: tsItems
    };

    data.categories.splice(shakesIdx + 1, 0, thickshakesCat);
    console.log(`Split Shakes -> "Shakes" (${msItems.length + otherItems.length} items) + "Thickshakes" (${tsItems.length} items)`);
  } else {
    console.log("Shakes category not found — skipping split.");
  }

  await docRef.set({ categories: data.categories, updatedAt: Date.now() }, { merge: true });
  console.log(`\nDone. ${data.categories.length} categories now live.`);
}

main().catch((err) => {
  console.error("\nFailed:", err);
  process.exit(1);
});

/* ============================================================
   THIRD BATCH — reconciles against the owner's authoritative menu
   text (Pizza, Pasta, Waffles, Fries/Sides, Paneer Maggie), adds
   "Loaded Korean Bowl" and the new "Fried Rice & Noodles" category,
   and removes Snickers Waffle (not present in the authoritative list).
   Desserts, Shakes/Thickshakes, plain Maggie, Burgers, Sandwiches,
   Eat-Right are untouched -- either already matched or not covered
   by this update.
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

const PRICE_MAP = {
  "tandoori-paneer-pizza": 239,
  "tandoori-paneer-pizza-large": 309,
  "red-sauce-pasta": 199,
  "biscoff-waffle": 100,
  "biscoff-waffle-double": 200,
  "french-fries": 99,
  "peri-peri-fries": 119,
  "loaded-fries": 139,
  "veg-nuggets": 119,
  "cheese-shots": 129,
  "veg-fingers": 129,
  "paneer-maggie": 70,
  "corn-paneer-maggie": 85,
  "paneer-mayo-maggie": 85,
  "peri-peri-paneer-maggie": 85,
  "cheesy-paneer-maggie": 95,
  "schezwan-paneer-maggie": 120,
  "korean-paneer-maggie": 120
};

const REMOVE_IDS = ["snickers-waffle", "snickers-waffle-double"];

const NEW_FRIES_ITEM = {
  id: "loaded-korean-bowl",
  name: "Loaded Korean Bowl",
  price: 149,
  veg: true,
  inStock: true,
  tags: [],
  note: "",
  img: "",
  desc: "A hearty bowl loaded with our signature Korean-style seasoning and toppings."
};

const FRIED_RICE_CATEGORY = {
  id: "fried-rice-noodles",
  name: "Fried Rice & Noodles",
  icon: "🍚",
  desc: "Wok-tossed, smoky and generously loaded.",
  addons: [],
  items: [
    { id: "veg-fried-rice", name: "Vegetable Fried Rice", price: 110, veg: true, inStock: true, tags: [], note: "", img: "", desc: "Wok-tossed rice with crunchy garden vegetables." },
    { id: "corn-fried-rice", name: "Corn Fried Rice", price: 120, veg: true, inStock: true, tags: [], note: "", img: "", desc: "Sweet corn tossed through classic wok-fried rice." },
    { id: "paneer-fried-rice", name: "Paneer Fried Rice", price: 130, veg: true, inStock: true, tags: [], note: "", img: "", desc: "Soft paneer cubes tossed into smoky fried rice." },
    { id: "kaju-fried-rice", name: "Kaju Fried Rice", price: 150, veg: true, inStock: true, tags: [], note: "", img: "", desc: "Crunchy cashews tossed through fragrant fried rice." },
    { id: "kaju-paneer-fried-rice", name: "Kaju Paneer Fried Rice", price: 160, veg: true, inStock: true, tags: [], note: "", img: "", desc: "Cashews and paneer together in wok-tossed rice." },
    { id: "schezwan-fried-rice", name: "Schezwan Fried Rice", price: 160, veg: true, inStock: true, tags: ["spicy"], note: "", img: "", desc: "Fiery schezwan sauce tossed through wok-fried rice." },
    { id: "baby-corn-fried-rice", name: "Baby Corn Fried Rice", price: 160, veg: true, inStock: true, tags: [], note: "", img: "", desc: "Crunchy baby corn tossed into smoky fried rice." },
    { id: "mushroom-fried-rice", name: "Mushroom Fried Rice", price: 170, veg: true, inStock: true, tags: [], note: "", img: "", desc: "Sautéed mushrooms tossed through wok-fried rice." }
  ]
};

async function main() {
  const snap = await docRef.get();
  if (!snap.exists) throw new Error("Live menu document doesn't exist.");
  const data = snap.data();
  let changes = 0;

  console.log("Price corrections:");
  data.categories.forEach((cat) => {
    cat.items.forEach((it) => {
      if (PRICE_MAP[it.id] != null && it.price !== PRICE_MAP[it.id]) {
        console.log(`  ${it.name} (${it.id}): ₹${it.price} -> ₹${PRICE_MAP[it.id]}`);
        it.price = PRICE_MAP[it.id];
        changes++;
      }
    });
  });

  console.log("\nRemovals:");
  data.categories.forEach((cat) => {
    const before = cat.items.length;
    cat.items = cat.items.filter((it) => !REMOVE_IDS.includes(it.id));
    if (cat.items.length < before) {
      console.log(`  Removed ${before - cat.items.length} item(s) from ${cat.name}: ${REMOVE_IDS.join(", ")}`);
      changes += before - cat.items.length;
    }
  });

  console.log("\nAdditions:");
  const friesCat = data.categories.find((c) => c.id === "fries");
  if (friesCat && !friesCat.items.some((it) => it.id === NEW_FRIES_ITEM.id)) {
    friesCat.items.push(NEW_FRIES_ITEM);
    console.log(`  + "${NEW_FRIES_ITEM.name}" @ ₹${NEW_FRIES_ITEM.price} added to ${friesCat.name}`);
    changes++;
  }

  if (!data.categories.some((c) => c.id === FRIED_RICE_CATEGORY.id)) {
    const maggieIdx = data.categories.findIndex((c) => c.id === "maggie");
    const insertAt = maggieIdx >= 0 ? maggieIdx + 1 : data.categories.length;
    data.categories.splice(insertAt, 0, FRIED_RICE_CATEGORY);
    console.log(`  + new category "Fried Rice & Noodles" with ${FRIED_RICE_CATEGORY.items.length} items`);
    changes++;
  }

  if (changes === 0) {
    console.log("\nNothing to change — live data already matches.");
    return;
  }

  await docRef.set({ categories: data.categories, updatedAt: Date.now() }, { merge: true });
  console.log(`\nDone. ${changes} changes written to the live menu.`);
}

main().catch((err) => {
  console.error("\nFailed:", err);
  process.exit(1);
});

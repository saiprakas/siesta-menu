/* ============================================================
   SECOND BATCH — reconciles Sandwiches, Burgers and Pizza against
   more printed-menu photos. Pizza is priced Small/Large on the
   real menu but the app only has one price per pizza — same
   Small/Double-style split used for waffles.

   Also replaces Pizza's add-ons list with the real one (previously
   generic placeholders).

   Reads the LIVE Firestore document, only ever writes `categories`
   (merge:true) — never touches settings or callbacks.
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

const BURGER_PRICES = {
  "aloo-tikka-burger": 119,
  "paneer-tikka-burger": 139,
  "mushroom-plantation": 159
};

const SANDWICH_PRICES = {
  "bombay-sandwich": 99,
  "corn-sandwich": 119,
  "cheese-grilled-sandwich": 129,
  "mushroom-sandwich": 169
  // aloo-tikka-sandwich (149) and paneer-tikka-sandwich (159) and
  // chocolate-sandwich (119) already match the printed menu.
};

/* Pizza: Small/Large split, same pattern as the waffle Single/Double
   split — original id keeps the Small price; a new "-large" id is
   added for the bigger size. */
const PIZZA_SPLIT = {
  "margherita": { small: 99, large: 159 },
  "cheese-corn-pizza": { small: 149, large: 219 },
  "farmhouse": { small: 179, large: 249 },
  "veggie-delight": { small: 189, large: 259 },
  "white-sauce-delight": { small: 229, large: 299 },
  "veggie-supreme": { small: 199, large: 269 },
  "tandoori-paneer-pizza": { small: 229, large: 299 },
  "tandoori-mushroom-pizza": { small: 249, large: 319 }
};

const PIZZA_ADDONS = [
  { name: "Onion", price: 20 },
  { name: "Tomato", price: 20 },
  { name: "Capsicum", price: 20 },
  { name: "Corn", price: 20 },
  { name: "Olives", price: 30 },
  { name: "Paneer", price: 30 },
  { name: "Mushroom", price: 30 },
  { name: "Jalapenos", price: 30 }
];

function applyPriceMap(items, priceMap) {
  let changed = 0;
  items.forEach((it) => {
    if (priceMap[it.id] != null && it.price !== priceMap[it.id]) {
      console.log(`  ${it.name}: ₹${it.price} -> ₹${priceMap[it.id]}`);
      it.price = priceMap[it.id];
      changed++;
    }
  });
  return changed;
}

function splitPizzas(cat) {
  let touched = 0;
  cat.items.forEach((it) => {
    const split = PIZZA_SPLIT[it.id];
    if (!split) return;
    if (it.price !== split.small || it.note !== "Small") {
      console.log(`  ${it.name}: -> Small ₹${split.small}`);
      it.price = split.small;
      it.note = "Small";
      touched++;
    }
    const largeId = `${it.id}-large`;
    if (!cat.items.some((x) => x.id === largeId)) {
      console.log(`  + adding "${it.name} (Large)" @ ₹${split.large}`);
      cat.items.push({
        id: largeId,
        name: it.name,
        price: split.large,
        veg: true,
        inStock: true,
        tags: [...it.tags],
        note: "Large",
        desc: it.desc,
        img: ""
      });
      touched++;
    }
  });
  return touched;
}

async function main() {
  const snap = await docRef.get();
  if (!snap.exists) throw new Error("Live menu document doesn't exist.");
  const data = snap.data();
  const byId = Object.fromEntries(data.categories.map((c) => [c.id, c]));
  let totalChanges = 0;

  console.log("Burgers:");
  totalChanges += applyPriceMap(byId.burgers.items, BURGER_PRICES);

  console.log("\nSandwiches:");
  totalChanges += applyPriceMap(byId.sandwiches.items, SANDWICH_PRICES);

  console.log("\nPizza (Small/Large split):");
  totalChanges += splitPizzas(byId.pizza);

  const oldAddons = JSON.stringify(byId.pizza.addons);
  const newAddons = JSON.stringify(PIZZA_ADDONS);
  if (oldAddons !== newAddons) {
    console.log("\nPizza add-ons updated to match the real list (Onion/Tomato/Capsicum/Corn ₹20, Olives/Paneer/Mushroom/Jalapenos ₹30).");
    byId.pizza.addons = PIZZA_ADDONS;
    totalChanges++;
  }

  if (totalChanges === 0) {
    console.log("\nNothing to change — live data already matches.");
    return;
  }

  await docRef.set({ categories: data.categories, updatedAt: Date.now() }, { merge: true });
  console.log(`\nDone. ${totalChanges} changes written to the live menu.`);
}

main().catch((err) => {
  console.error("\nFailed:", err);
  process.exit(1);
});

/* ============================================================
   ONE-TIME LIVE-DATA CORRECTION — reconciles Maggie, Paneer Maggie,
   Shakes, Waffles and Pasta against the real printed menu prices
   (photographed by the owner), and adds items that were missing.

   Reads the LIVE Firestore document (not the seed file), so it's
   safe even if someone has already made edits via the Ops panel.
   Only ever writes the `categories` field (merge:true) — never
   touches settings or callbacks, same safety rule as the app itself.

   Run once:
     node scripts/apply-price-corrections.js
     (needs scripts/serviceAccountKey.json, same as the photo migration)
   ============================================================ */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = join(__dirname, "serviceAccountKey.json");

if (!existsSync(KEY_PATH)) {
  console.error(`\nMissing ${KEY_PATH} — same service-account key used for the photo migration.\n`);
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(KEY_PATH, "utf8"));
const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);
const docRef = db.collection("siesta").doc("data");

/* id -> new price, per the printed menu photos */
const MAGGIE_PRICES = {
  "masala-maggie": 50,
  "double-masala-maggie": 60,
  "butter-maggie": 60,
  "corn-maggie": 65,
  "mayo-maggie": 65,
  "peri-peri-maggie": 70,
  "butter-peri-peri-maggie": 75,
  "cheesy-maggie": 80,
  "korean-maggie": 90,
  "maggie-masala-pasta": 100,
  "schezwan-maggie": 110,
  "white-sauce-maggie": 120,
  "pesto-maggie": 130,
  "paneer-maggie": 60,
  "corn-paneer-maggie": 65,
  "paneer-mayo-maggie": 70,
  "peri-peri-paneer-maggie": 70,
  "cheesy-paneer-maggie": 80,
  "schezwan-paneer-maggie": 90, // already matched printed menu, no change
  "korean-paneer-maggie": 90
};
const MAGGIE_NEW_ITEMS = [
  { id: "maggie-momo", name: "Maggie Momo", price: 100, veg: true, inStock: true, tags: [], desc: "A fun fusion — momo dumplings tossed in our signature Maggie masala." }
];

const SHAKE_PRICES = {
  "mexican-vanilla-ms": 99,
  "very-berry-ms": 99,
  "blueberry-plunge-ms": 99,
  "crunchy-caramel-ms": 99,
  "nutella-brownie-ms": 129,
  "cookie-cream-ms": 129,
  "nutella-latte-ms": 129,
  "mexican-vanilla-ts": 199,
  "very-berry-ts": 199,
  "blueberry-ts": 199,
  "crunchy-caramel-ts": 199,
  "belgian-chocolate-ts": 220,
  "nutella-brownie-ts": 229,
  "cookie-cream-ts": 229,
  "nutella-latte-ts": 229
};
const SHAKE_NEW_ITEMS = [
  { id: "belgian-chocolate-ms", name: "Belgian Chocolate Milkshake", price: 120, veg: true, inStock: true, tags: [], desc: "Premium Belgian chocolate, blended smooth and rich." }
];

/* Waffles: split every existing flavor into Single/Double, matching the
   printed menu's two-tier pricing. The original id keeps the Single
   price (so its existing photo mapping still applies); a new
   "-double" id is added for the larger size. */
const WAFFLE_SPLIT = {
  "triple-waffle": { single: 80, double: 160 },
  "kitkat-waffle": { single: 90, double: 180 },
  "oreo-waffle": { single: 90, double: 180 },
  "brownie-waffle": { single: 90, double: 180 },
  "biscoff-waffle": { single: 90, double: 180 },
  "almond-waffle": { single: 100, double: 200 },
  "blueberry-waffle": { single: 120, double: 240 },
  "strawberry-waffle": { single: 120, double: 240 },
  "mixed-berry-waffle": { single: 120, double: 240 }
};
const BERRY_NOTE = " (comes with available fruit)";
const WAFFLE_NEW_FLAVOR = {
  id: "snickers-waffle",
  name: "Snickers Waffle",
  desc: "Snickers chunks and caramel drizzle over a fresh golden waffle.",
  tags: [],
  single: 100,
  double: 200
};

const PASTA_PRICES = {
  "red-sauce-pasta": 180,
  "alfredo-pasta": 199,
  "pesto-pasta": 219
};

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

function addMissing(items, newItems) {
  let added = 0;
  newItems.forEach((ni) => {
    if (!items.some((it) => it.id === ni.id)) {
      console.log(`  + adding "${ni.name}" @ ₹${ni.price}`);
      items.push({ note: "", img: "", ...ni });
      added++;
    }
  });
  return added;
}

function splitWaffles(cat) {
  let touched = 0;
  cat.items.forEach((it) => {
    const split = WAFFLE_SPLIT[it.id];
    if (!split) return;
    if (it.price !== split.single || it.note !== "Single") {
      console.log(`  ${it.name}: -> Single ₹${split.single}`);
      it.price = split.single;
      it.note = "Single";
      if (/blueberry-waffle|strawberry-waffle|mixed-berry-waffle/.test(it.id) && !it.desc.includes("available fruit")) {
        it.desc = it.desc.trim() + BERRY_NOTE;
      }
      touched++;
    }
    const doubleId = `${it.id}-double`;
    if (!cat.items.some((x) => x.id === doubleId)) {
      console.log(`  + adding "${it.name} (Double)" @ ₹${split.double}`);
      cat.items.push({
        id: doubleId,
        name: it.name,
        price: split.double,
        veg: true,
        inStock: true,
        tags: [...it.tags],
        note: "Double",
        desc: it.desc,
        img: ""
      });
      touched++;
    }
  });
  if (!cat.items.some((it) => it.id === WAFFLE_NEW_FLAVOR.id)) {
    console.log(`  + adding "${WAFFLE_NEW_FLAVOR.name} (Single)" @ ₹${WAFFLE_NEW_FLAVOR.single}`);
    console.log(`  + adding "${WAFFLE_NEW_FLAVOR.name} (Double)" @ ₹${WAFFLE_NEW_FLAVOR.double}`);
    cat.items.push(
      { id: WAFFLE_NEW_FLAVOR.id, name: WAFFLE_NEW_FLAVOR.name, price: WAFFLE_NEW_FLAVOR.single, veg: true, inStock: true, tags: WAFFLE_NEW_FLAVOR.tags, note: "Single", desc: WAFFLE_NEW_FLAVOR.desc, img: "" },
      { id: `${WAFFLE_NEW_FLAVOR.id}-double`, name: WAFFLE_NEW_FLAVOR.name, price: WAFFLE_NEW_FLAVOR.double, veg: true, inStock: true, tags: WAFFLE_NEW_FLAVOR.tags, note: "Double", desc: WAFFLE_NEW_FLAVOR.desc, img: "" }
    );
    touched += 2;
  }
  return touched;
}

async function main() {
  const snap = await docRef.get();
  if (!snap.exists) throw new Error("Live menu document doesn't exist yet — open the Ops panel once first.");
  const data = snap.data();

  const byId = Object.fromEntries(data.categories.map((c) => [c.id, c]));
  let totalChanges = 0;

  console.log("Maggie:");
  totalChanges += applyPriceMap(byId.maggie.items, MAGGIE_PRICES);
  totalChanges += addMissing(byId.maggie.items, MAGGIE_NEW_ITEMS);

  console.log("\nShakes:");
  totalChanges += applyPriceMap(byId.shakes.items, SHAKE_PRICES);
  totalChanges += addMissing(byId.shakes.items, SHAKE_NEW_ITEMS);

  console.log("\nWaffles:");
  totalChanges += splitWaffles(byId.waffles);

  console.log("\nPasta:");
  totalChanges += applyPriceMap(byId.pasta.items, PASTA_PRICES);

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

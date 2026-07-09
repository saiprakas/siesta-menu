/* ============================================================
   Uploads the owner's real dish photos (named by dish, e.g.
   "French Fries.jpg") from D:\sieast cafe image into Firebase
   Storage, then rewrites the matching entries in itemImages.js
   to point at the new permanent URLs instead of stock photos.

   Waffle flavors get TWO menu items (Single/Double, added by
   apply-price-corrections.js) but only ONE photo — both ids get
   the same uploaded URL.

   Run once:
     node scripts/upload-real-dish-photos.js
     (needs scripts/serviceAccountKey.json + a working Storage bucket)
   ============================================================ */

import { readFileSync, readdirSync, existsSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, basename, extname } from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = join(__dirname, "serviceAccountKey.json");
const PHOTO_DIR = "D:/sieast cafe image";
const BUCKET = "siesta-cafe.firebasestorage.app";
const ITEM_IMAGES_PATH = join(__dirname, "..", "src", "lib", "itemImages.js");

if (!existsSync(KEY_PATH)) {
  console.error(`\nMissing ${KEY_PATH}\n`);
  process.exit(1);
}
if (!existsSync(PHOTO_DIR)) {
  console.error(`\nMissing folder ${PHOTO_DIR}\n`);
  process.exit(1);
}

/* Dish display name (matches the filename, minus extension) -> item id(s).
   Waffle flavors map to both the Single id and its "-double" sibling. */
const NAME_TO_IDS = {
  "French Fries": ["french-fries"],
  "Peri Peri Fries": ["peri-peri-fries"],
  "Loaded Fries": ["loaded-fries"],
  "Veg Nuggets": ["veg-nuggets"],
  "Cheese Shots": ["cheese-shots"],
  "Veg Fingers": ["veg-fingers"],
  "Margherita Pizza": ["margherita"],
  "Cheese & Corn Pizza": ["cheese-corn-pizza"],
  "Farmhouse Pizza": ["farmhouse"],
  "Veggie Delight Pizza": ["veggie-delight"],
  "White Sauce Delight": ["white-sauce-delight"],
  "Veggie Supreme": ["veggie-supreme"],
  "Tandoori Paneer Pizza": ["tandoori-paneer-pizza"],
  "Tandoori Mushroom Pizza": ["tandoori-mushroom-pizza"],
  "Aloo Tikka Burger": ["aloo-tikka-burger"],
  "Paneer Tikka Burger": ["paneer-tikka-burger"],
  "Mushroom Plantation Burger": ["mushroom-plantation"],
  "Triple Chocolate Waffle": ["triple-waffle", "triple-waffle-double"],
  "KitKat Waffle": ["kitkat-waffle", "kitkat-waffle-double"],
  "Oreo Waffle": ["oreo-waffle", "oreo-waffle-double"],
  "Brownie Waffle": ["brownie-waffle", "brownie-waffle-double"],
  "Biscoff Waffle": ["biscoff-waffle", "biscoff-waffle-double"],
  "Almond Waffle": ["almond-waffle", "almond-waffle-double"],
  "Blueberry Waffle": ["blueberry-waffle", "blueberry-waffle-double"],
  "Strawberry Waffle": ["strawberry-waffle", "strawberry-waffle-double"],
  "Mixed Berry Waffle": ["mixed-berry-waffle", "mixed-berry-waffle-double"],
  "Snickers Waffle": ["snickers-waffle", "snickers-waffle-double"]
};

const serviceAccount = JSON.parse(readFileSync(KEY_PATH, "utf8"));
const app = initializeApp({ credential: cert(serviceAccount), storageBucket: BUCKET });
const bucket = getStorage(app).bucket();

async function uploadOne(filePath, id) {
  const path = `dish-photos/defaults/${id}.jpg`;
  const file = bucket.file(path);
  await file.save(readFileSync(filePath), { contentType: "image/jpeg" });
  await file.makePublic();
  return file.publicUrl();
}

async function main() {
  const files = readdirSync(PHOTO_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  const urlById = {};
  let uploaded = 0;
  let skipped = [];

  for (const file of files) {
    const name = basename(file, extname(file)).trim();
    const ids = NAME_TO_IDS[name];
    if (!ids) {
      skipped.push(file);
      continue;
    }
    const fullPath = join(PHOTO_DIR, file);
    console.log(`Uploading "${name}" -> ${ids.join(", ")} ...`);
    const url = await uploadOne(fullPath, ids[0]);
    ids.forEach((id) => (urlById[id] = url));
    uploaded++;
  }

  if (skipped.length) {
    console.log("\nSkipped (no matching item name):");
    skipped.forEach((f) => console.log(" -", f));
  }

  if (uploaded === 0) {
    console.log("\nNothing uploaded — no filenames matched.");
    return;
  }

  // Rewrite the matching ITEM_IMG entries in itemImages.js
  let src = readFileSync(ITEM_IMAGES_PATH, "utf8");
  let updated = 0;
  for (const [id, url] of Object.entries(urlById)) {
    const re = new RegExp(`(["']${id}["']\\s*:\\s*)(?:"[^"]*"|'[^']*')`, "g");
    if (re.test(src)) {
      src = src.replace(re, `$1"${url}"`);
      updated++;
    } else {
      // New id not yet present (e.g. the new waffle-double / Snickers items) — add it
      src = src.replace(
        /const ITEM_IMG = \{/,
        `const ITEM_IMG = {\n  "${id}": "${url}",`
      );
      updated++;
    }
  }
  writeFileSync(ITEM_IMAGES_PATH, src);

  console.log(`\nDone. ${uploaded} photos uploaded, ${updated} itemImages.js entries updated.`);
}

main().catch((err) => {
  console.error("\nFailed:", err);
  process.exit(1);
});

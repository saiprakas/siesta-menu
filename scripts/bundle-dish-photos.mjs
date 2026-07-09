/* ============================================================
   Copies the owner's named dish photos from D:\sieast cafe image
   into public/dish-photos/ (renamed to item ids), and rewrites the
   matching entries in itemImages.js to reference them directly —
   no cloud storage, no billing, just static files shipped with
   the deployed site.
   ============================================================ */

import { readFileSync, readdirSync, existsSync, copyFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, basename, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PHOTO_DIR = process.argv[2] || "D:/sieast cafe image";
const DEST_DIR = join(__dirname, "..", "public", "dish-photos");
const ITEM_IMAGES_PATH = join(__dirname, "..", "src", "lib", "itemImages.js");

if (!existsSync(PHOTO_DIR)) {
  console.error(`\nMissing folder ${PHOTO_DIR}\n`);
  process.exit(1);
}

/* Dish display name (matches filename, minus extension) -> item id(s).
   Waffle flavors map to both the Single id and its "-double" sibling —
   both point at the same photo file. */
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
  "Snickers Waffle": ["snickers-waffle", "snickers-waffle-double"],

  /* ---- Sandwiches (Chocolate/Mushroom also exist under Eat-Right) ---- */
  "Bombay Style Sandwich": ["bombay-sandwich"],
  "Cheese Grilled Sandwich": ["cheese-grilled-sandwich"],
  "Corn Sandwich": ["corn-sandwich"],
  "Aloo Tikka Sandwich": ["aloo-tikka-sandwich"],
  "Paneer Tikka Sandwich": ["paneer-tikka-sandwich"],
  "Chocolate Sandwich": ["chocolate-sandwich", "er-chocolate-sandwich"],
  "Mushroom Sandwich": ["mushroom-sandwich", "er-mushroom-sandwich"],

  /* ---- Pasta ---- */
  "Red Sauce Pasta": ["red-sauce-pasta"],
  "Alfredo Pasta": ["alfredo-pasta"],
  "Pesto Pasta": ["pesto-pasta"],

  /* ---- Desserts ---- */
  "Apricot Delight": ["apricot-delight"],
  "Passion Delight": ["passion-delight"],
  "Tres Leches": ["tres-leches"],
  "Mango Tres Leches": ["mango-tres-leches"],
  "Lotus Biscoff Cheesecake": ["biscoff-cheesecake"],
  "Death by Chocolate Pastry": ["death-by-chocolate"],
  "Nutella Brownie": ["nutella-brownie"],
  "Choco Truffle Brownie": ["choco-truffle-brownie"],
  "Biscoff Brownie": ["biscoff-brownie"],
  "Regular Brownie": ["regular-brownie"],

  /* ---- Shakes ---- */
  "Mexican Vanilla Milkshake": ["mexican-vanilla-ms"],
  "Very Berry Milkshake": ["very-berry-ms"],
  "Blueberry Plunge Milkshake": ["blueberry-plunge-ms"],
  "Crunchy Caramel Milkshake": ["crunchy-caramel-ms"],
  "Nutella Brownie Milkshake": ["nutella-brownie-ms"],
  "Cookies & Cream Milkshake": ["cookie-cream-ms"],
  "Nutella Latte Milkshake": ["nutella-latte-ms"],
  "Belgian Chocolate Milkshake": ["belgian-chocolate-ms"],
  "Mexican Vanilla Thickshake": ["mexican-vanilla-ts"],
  "Very Berry Thickshake": ["very-berry-ts"],
  "Blueberry Thickshake": ["blueberry-ts"],
  "Crunchy Caramel Thickshake": ["crunchy-caramel-ts"],
  "Belgian Chocolate Thickshake": ["belgian-chocolate-ts"],
  "Nutella Brownie Thickshake": ["nutella-brownie-ts"],
  "Cookies & Cream Thickshake": ["cookie-cream-ts"],
  "Nutella Latte Thickshake": ["nutella-latte-ts"],

  /* ---- Maggie ---- */
  "Masala Maggie": ["masala-maggie"],
  "Double Masala Maggie": ["double-masala-maggie"],
  "Butter Maggie": ["butter-maggie"],
  "Corn Maggie": ["corn-maggie"],
  "Mayo Maggie": ["mayo-maggie"],
  "Butter Peri Peri Maggie": ["butter-peri-peri-maggie"],
  "Peri Peri Maggie": ["peri-peri-maggie"],
  "Cheesseyyy Maggie": ["cheesy-maggie"],
  "Korean Style Maggie": ["korean-maggie"],
  "Maggie Masala Pasta": ["maggie-masala-pasta"],
  "Schezwan Maggie": ["schezwan-maggie"],
  "Pesto Maggie": ["pesto-maggie"],
  "Maggie Momo": ["maggie-momo"],
  "Cheesseyyy Paneer Maggie": ["cheesy-paneer-maggie"],
  "Korean Paneer Maggie": ["korean-paneer-maggie"],
  "Schezwan Paneer Maggie": ["schezwan-paneer-maggie"],
  "Peri Peri Paneer Maggie": ["peri-peri-paneer-maggie"],
  "Paneer Mayo Maggie": ["paneer-mayo-maggie"],
  "Corn Paneer Maggie": ["corn-paneer-maggie"],
  "Paneer Maggie": ["paneer-maggie"]
};

const files = readdirSync(PHOTO_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const urlById = {};
let copied = 0;
const skipped = [];

for (const file of files) {
  const name = basename(file, extname(file)).trim();
  const ids = NAME_TO_IDS[name];
  if (!ids) {
    skipped.push(file);
    continue;
  }
  const ext = extname(file).toLowerCase();
  const destName = `${ids[0]}${ext}`;
  copyFileSync(join(PHOTO_DIR, file), join(DEST_DIR, destName));
  const publicPath = `./dish-photos/${destName}`; // relative — must work under any subpath (GitHub Pages, Netlify, etc.)
  ids.forEach((id) => (urlById[id] = publicPath));
  console.log(`"${name}" -> ${publicPath}  (ids: ${ids.join(", ")})`);
  copied++;
}

if (skipped.length) {
  console.log("\nSkipped (no matching item name):");
  skipped.forEach((f) => console.log(" -", f));
}

if (copied === 0) {
  console.log("\nNothing copied — no filenames matched.");
  process.exit(0);
}

let src = readFileSync(ITEM_IMAGES_PATH, "utf8");
let updated = 0;
for (const [id, path] of Object.entries(urlById)) {
  const re = new RegExp(`(["']${id}["']\\s*:\\s*)(?:"[^"]*"|'[^']*')`, "g");
  if (re.test(src)) {
    src = src.replace(re, `$1"${path}"`);
  } else {
    src = src.replace(/const ITEM_IMG = \{/, `const ITEM_IMG = {\n  "${id}": "${path}",`);
  }
  updated++;
}
writeFileSync(ITEM_IMAGES_PATH, src);

console.log(`\nDone. ${copied} photos copied into public/dish-photos/, ${updated} itemImages.js entries updated.`);

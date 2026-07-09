/* ============================================================
   ONE-TIME MIGRATION — copies the default dish photos (currently
   hotlinked from Unsplash) into this project's own Firebase Storage,
   so the menu no longer depends on an outside website staying up.

   Run once:
     1. Firebase console → Project settings (gear icon) → Service accounts
        → Generate new private key → save the downloaded file as
        scripts/serviceAccountKey.json  (already git-ignored)
     2. node scripts/migrate-default-photos.js
     3. It writes scripts/migrated-photo-urls.json with the results —
        hand that back so itemImages.js can be updated to point at
        the new Storage URLs instead of Unsplash.
   ============================================================ */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = join(__dirname, "serviceAccountKey.json");
const OUT_PATH = join(__dirname, "migrated-photo-urls.json");
const BUCKET = "siesta-cafe.firebasestorage.app";

if (!existsSync(KEY_PATH)) {
  console.error(
    `\nMissing ${KEY_PATH}\n` +
      "Get it from: Firebase console -> Project settings (gear icon) -> Service accounts\n" +
      "-> Generate new private key -> save the downloaded file exactly as scripts/serviceAccountKey.json\n"
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(KEY_PATH, "utf8"));
const app = initializeApp({ credential: cert(serviceAccount), storageBucket: BUCKET });
const bucket = getStorage(app).bucket();

const unsplashUrl = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=800&q=78`;

/* ---- Same mapping as src/lib/itemImages.js at time of migration ---- */
const ITEM_IMG = {
  "french-fries": "1573080496219-bb080dd4f877",
  "peri-peri-fries": "1630431341973-02e1b662ec35",
  "loaded-fries": "1585109649139-366815a0d713",
  "veg-nuggets": "1541544741938-0af808871cc0",
  "cheese-shots": "1598679253544-2c97992403ea",
  "veg-fingers": "1619881590738-a111d176d906",
  "margherita": "1595854341625-f33ee10dbf94",
  "cheese-corn-pizza": "1513104890138-7c749659a591",
  "farmhouse": "1574071318508-1cdbab80d002",
  "veggie-delight": "1571407970349-bc81e7e96d47",
  "white-sauce-delight": "1593560708920-61dd98c46a4e",
  "veggie-supreme": "1565299624946-b28f40a0ae38",
  "tandoori-paneer-pizza": "1548369937-47519962c11a",
  "tandoori-mushroom-pizza": "1541592106381-b31e9677c0e5",
  "aloo-tikka-burger": "1553979459-d2229ba7433b",
  "paneer-tikka-burger": "1571091718767-18b5b1457add",
  "mushroom-plantation": "1572802419224-296b0aeee0d9",
  "triple-waffle": "1620921575116-fb8902865f81",
  "kitkat-waffle": "1621743478914-cc8a86d7e7b5",
  "oreo-waffle": "1568051243858-533a607809a5",
  "brownie-waffle": "1504754524776-8f4f37790ca0",
  "biscoff-waffle": "1558584673-c834fb1cc3ca",
  "almond-waffle": "1513442542250-854d436a73f2",
  "blueberry-waffle": "1498557850523-fd3d118b962e",
  "strawberry-waffle": "1464965911861-746a04b4bca6",
  "mixed-berry-waffle": "1562376552-0d160a2f238d",
  "vanilla-cake": "1535141192574-5d4897c12636",
  "pineapple-cake": "1616690710400-a16d146927c5",
  "blueberry-cake": "1464349095431-e9a21285b5f3",
  "mango-cake": "1553279768-865429fa0078",
  "butterscotch-cake": "1606890737304-57a1ca8a5b62",
  "chocolate-cake": "1578985545062-69928b1d9587",
  "honey-almond-cake": "1588195538326-c5b1e9f80a1b",
  "black-forest-cake": "1535254973040-607b474cb50d",
  "white-forest-cake": "1586040140378-b5634cb4c8fc",
  "kitkat-cake": "1557925923-cd4648e211a0",
  "oreo-cake": "1519869325930-281384150729",
  "red-velvet-cake": "1562440499-64c9a111f713",
  "tiramisu-cake": "1571115177098-24ec42ed204d",
  "passion-delight-cake": "1565958011703-44f9829ba187",
  "apricot-delight-cake": "1586788680434-30d324b2d46f",
  "bombay-sandwich": "1475090169767-40ed8d18f67d",
  "cheese-grilled-sandwich": "1539252554453-80ab65ce3586",
  "corn-sandwich": "1567234669003-dce7a7a88821",
  "aloo-tikka-sandwich": "1553909489-cd47e0907980",
  "paneer-tikka-sandwich": "1528735602780-2552fd46c7af",
  "chocolate-sandwich": "1528736235302-52922df5c122",
  "mushroom-sandwich": "1481070555726-e2fe8357725c",
  "red-sauce-pasta": "1621996346565-e3dbc646d9a9",
  "alfredo-pasta": "1626844131082-256783844137",
  "pesto-pasta": "1611270629569-8b357cb88da9",
  "apricot-delight": "1551106652-a5bcf4b29ab6",
  "passion-delight": "1488900128323-21503983a07e",
  "tres-leches": "1571877227200-a0d98ea607e9",
  "mango-tres-leches": "1542124948-dc391252a940",
  "biscoff-cheesecake": "1524351199678-941a58a3df50",
  "death-by-chocolate": "1564355808539-22fda35bed7e",
  "nutella-brownie": "1607920591413-4ec007e70023",
  "choco-truffle-brownie": "1590080875515-8a3a8dc5735e",
  "biscoff-brownie": "1611625618313-68b87aaa0626",
  "regular-brownie": "1587668178277-295251f900ce",
  "mexican-vanilla-ms": "1568901839119-631418a3910d",
  "very-berry-ms": "1600718374662-0483d2b9da44",
  "blueberry-plunge-ms": "1610970881699-44a5587cabec",
  "crunchy-caramel-ms": "1579954115545-a95591f28bfc",
  "nutella-brownie-ms": "1572490122747-3968b75cc699",
  "cookie-cream-ms": "1541658016709-82535e94bc69",
  "nutella-latte-ms": "1638176066666-ffb2f013c7dd",
  "mexican-vanilla-ts": "1568901839119-631418a3910d",
  "very-berry-ts": "1600718374662-0483d2b9da44",
  "blueberry-ts": "1610970881699-44a5587cabec",
  "crunchy-caramel-ts": "1579954115545-a95591f28bfc",
  "belgian-chocolate-ts": "1577805947697-89e18249d767",
  "nutella-brownie-ts": "1572490122747-3968b75cc699",
  "cookie-cream-ts": "1541658016709-82535e94bc69",
  "nutella-latte-ts": "1638176066666-ffb2f013c7dd",
  "masala-maggie": "1612929633738-8fe44f7ec841",
  "double-masala-maggie": "1585032226651-759b368d7246",
  "butter-maggie": "1569718212165-3a8278d5f624",
  "corn-maggie": "1552611052-33e04de081de",
  "mayo-maggie": "1617093727343-374698b1b08d",
  "butter-peri-peri-maggie": "1634864572865-1cf8ff8bd23d",
  "peri-peri-maggie": "1607330289024-1535c6b4e1c1",
  "cheesy-maggie": "1591814468924-caf88d1232e1",
  "korean-maggie": "1612929633738-8fe44f7ec841",
  "maggie-masala-pasta": "1608756687911-aa1599ab3bd9",
  "schezwan-maggie": "1585032226651-759b368d7246",
  "white-sauce-maggie": "1645112411341-6c4fd023714a",
  "pesto-maggie": "1473093295043-cdd812d0e601",
  "paneer-maggie": "1569718212165-3a8278d5f624",
  "corn-paneer-maggie": "1552611052-33e04de081de",
  "paneer-mayo-maggie": "1617093727343-374698b1b08d",
  "peri-peri-paneer-maggie": "1607330289024-1535c6b4e1c1",
  "schezwan-paneer-maggie": "1634864572865-1cf8ff8bd23d",
  "korean-paneer-maggie": "1591814468924-caf88d1232e1",
  "cheesy-paneer-maggie": "1612929633738-8fe44f7ec841",
  "er-chocolate-sandwich": "1528736235302-52922df5c122",
  "er-mushroom-sandwich": "1481070555726-e2fe8357725c"
};

const POOLS = {
  fries: ["1573080496219-bb080dd4f877", "1585109649139-366815a0d713", "1541592106381-b31e9677c0e5"],
  pizza: ["1513104890138-7c749659a591", "1574071318508-1cdbab80d002", "1565299624946-b28f40a0ae38"],
  burgers: ["1568901346375-23c9450c58cd", "1571091718767-18b5b1457add", "1550547660-d9450f859349"],
  waffles: ["1562376552-0d160a2f238d", "1504754524776-8f4f37790ca0", "1513442542250-854d436a73f2"],
  cakes: ["1578985545062-69928b1d9587", "1565958011703-44f9829ba187", "1464349095431-e9a21285b5f3"],
  sandwiches: ["1528735602780-2552fd46c7af", "1553909489-cd47e0907980", "1481070555726-e2fe8357725c"],
  pasta: ["1621996346565-e3dbc646d9a9", "1563379926898-05f4575a45d8", "1555949258-eb67b1ef0ceb"],
  desserts: ["1551024506-0bccd828d307", "1563805042-7684c019e1cb", "1488477181946-6428a0291777"],
  shakes: ["1572490122747-3968b75cc699", "1579954115545-a95591f28bfc", "1600718374662-0483d2b9da44"],
  maggie: ["1612929633738-8fe44f7ec841", "1585032226651-759b368d7246", "1569718212165-3a8278d5f624"],
  eatright: ["1540189549336-e6e99c3679fe", "1546069901-ba9599a7e63c"]
};

/* ---- Collect every UNIQUE unsplash id referenced above ---- */
const uniqueIds = new Set([...Object.values(ITEM_IMG), ...Object.values(POOLS).flat()]);

async function migrateOne(unsplashId) {
  const path = `dish-photos/defaults/${unsplashId}.jpg`;
  const file = bucket.file(path);

  const [exists] = await file.exists();
  if (!exists) {
    const res = await fetch(unsplashUrl(unsplashId));
    if (!res.ok) throw new Error(`download failed (${res.status}) for ${unsplashId}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    await file.save(buffer, { contentType: "image/jpeg" });
  }
  await file.makePublic();
  return file.publicUrl();
}

async function main() {
  console.log(`Migrating ${uniqueIds.size} unique default photos to gs://${BUCKET}/dish-photos/defaults/ ...\n`);
  const idToUrl = {};
  let done = 0;
  for (const id of uniqueIds) {
    try {
      idToUrl[id] = await migrateOne(id);
      done++;
      console.log(`[${done}/${uniqueIds.size}] ok  ${id}`);
    } catch (err) {
      console.error(`[${done + 1}/${uniqueIds.size}] FAILED  ${id}  —  ${err.message}`);
    }
  }

  const itemImg = Object.fromEntries(
    Object.entries(ITEM_IMG).map(([id, unsplashId]) => [id, idToUrl[unsplashId] || null])
  );
  const pools = Object.fromEntries(
    Object.entries(POOLS).map(([cat, ids]) => [cat, ids.map((id) => idToUrl[id] || null)])
  );

  writeFileSync(OUT_PATH, JSON.stringify({ itemImg, pools }, null, 2));
  console.log(`\nDone. ${Object.keys(idToUrl).length}/${uniqueIds.size} unique photos migrated.`);
  console.log(`Results written to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("\nMigration failed:", err);
  process.exit(1);
});

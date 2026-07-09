/* ============================================================
   DEDICATED dish images for the QR menu — every item has its
   own mapped photo (all URLs verified).
   Priority: 1) Image URL set in Ops panel (item.img)
             2) The dedicated image below (by item id)
             3) Category pool (for new items added later)
             4) Drawn gold tile with category icon (never broken)
   Replace any of these with your OWN dish photos anytime via
   Ops → Menu → edit item → Dish Photo URL.
   ============================================================ */

const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=200&h=200&q=70`;

/* item id → dedicated photo */
const ITEM_IMG = {
  "maggie-momo": "./dish-photos/maggie-momo.jpg",
  "belgian-chocolate-ms": "./dish-photos/belgian-chocolate-ms.jpg",
  "triple-waffle-double": "./dish-photos/triple-waffle.jpg",
  "strawberry-waffle-double": "./dish-photos/strawberry-waffle.jpg",
  "snickers-waffle-double": "./dish-photos/snickers-waffle.jpg",
  "snickers-waffle": "./dish-photos/snickers-waffle.jpg",
  "oreo-waffle-double": "./dish-photos/oreo-waffle.jpg",
  "mixed-berry-waffle-double": "./dish-photos/mixed-berry-waffle.jpg",
  "kitkat-waffle-double": "./dish-photos/kitkat-waffle.jpg",
  "brownie-waffle-double": "./dish-photos/brownie-waffle.jpg",
  "blueberry-waffle-double": "./dish-photos/blueberry-waffle.jpg",
  "biscoff-waffle-double": "./dish-photos/biscoff-waffle.jpg",
  "almond-waffle-double": "./dish-photos/almond-waffle.jpg",
  /* ---- Fries & Snacks ---- */
  "french-fries": "./dish-photos/french-fries.jpg",
  "peri-peri-fries": "./dish-photos/peri-peri-fries.jpg",
  "loaded-fries": "./dish-photos/loaded-fries.jpg",
  "veg-nuggets": "./dish-photos/veg-nuggets.jpg",
  "cheese-shots": "./dish-photos/cheese-shots.jpg",
  "veg-fingers": "./dish-photos/veg-fingers.jpg",

  /* ---- Pizza (Small id keeps the base photo; Large mirrors it) ---- */
  "margherita": "./dish-photos/margherita.jpg",
  "margherita-large": "./dish-photos/margherita.jpg",
  "cheese-corn-pizza": "./dish-photos/cheese-corn-pizza.jpg",
  "cheese-corn-pizza-large": "./dish-photos/cheese-corn-pizza.jpg",
  "farmhouse": "./dish-photos/farmhouse.jpg",
  "farmhouse-large": "./dish-photos/farmhouse.jpg",
  "veggie-delight": "./dish-photos/veggie-delight.jpg",
  "veggie-delight-large": "./dish-photos/veggie-delight.jpg",
  "white-sauce-delight": "./dish-photos/white-sauce-delight.jpg",
  "white-sauce-delight-large": "./dish-photos/white-sauce-delight.jpg",
  "veggie-supreme": "./dish-photos/veggie-supreme.jpg",
  "veggie-supreme-large": "./dish-photos/veggie-supreme.jpg",
  "tandoori-paneer-pizza": "./dish-photos/tandoori-paneer-pizza.jpg",
  "tandoori-paneer-pizza-large": "./dish-photos/tandoori-paneer-pizza.jpg",
  "tandoori-mushroom-pizza": "./dish-photos/tandoori-mushroom-pizza.jpg",
  "tandoori-mushroom-pizza-large": "./dish-photos/tandoori-mushroom-pizza.jpg",

  /* ---- Burgers ---- */
  "aloo-tikka-burger": "./dish-photos/aloo-tikka-burger.jpg",
  "paneer-tikka-burger": "./dish-photos/paneer-tikka-burger.jpg",
  "mushroom-plantation": "./dish-photos/mushroom-plantation.jpg",

  /* ---- Waffles ---- */
  "triple-waffle": "./dish-photos/triple-waffle.jpg",
  "kitkat-waffle": "./dish-photos/kitkat-waffle.jpg",
  "oreo-waffle": "./dish-photos/oreo-waffle.jpg",
  "brownie-waffle": "./dish-photos/brownie-waffle.jpg",
  "biscoff-waffle": "./dish-photos/biscoff-waffle.jpg",
  "almond-waffle": "./dish-photos/almond-waffle.jpg",
  "blueberry-waffle": "./dish-photos/blueberry-waffle.jpg",
  "strawberry-waffle": "./dish-photos/strawberry-waffle.jpg",
  "mixed-berry-waffle": "./dish-photos/mixed-berry-waffle.jpg",

  /* ---- Cakes ---- */
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

  /* ---- Sandwiches ---- */
  "bombay-sandwich": "./dish-photos/bombay-sandwich.jpg",
  "cheese-grilled-sandwich": "./dish-photos/cheese-grilled-sandwich.jpg",
  "corn-sandwich": "./dish-photos/corn-sandwich.jpg",
  "aloo-tikka-sandwich": "./dish-photos/aloo-tikka-sandwich.jpg",
  "paneer-tikka-sandwich": "./dish-photos/paneer-tikka-sandwich.jpg",
  "chocolate-sandwich": "./dish-photos/chocolate-sandwich.jpg",
  "mushroom-sandwich": "./dish-photos/mushroom-sandwich.jpg",

  /* ---- Pasta ---- */
  "red-sauce-pasta": "./dish-photos/red-sauce-pasta.jpg",
  "alfredo-pasta": "./dish-photos/alfredo-pasta.jpg",
  "pesto-pasta": "./dish-photos/pesto-pasta.jpg",

  /* ---- Desserts ---- */
  "apricot-delight": "./dish-photos/apricot-delight.jpg",
  "passion-delight": "./dish-photos/passion-delight.jpg",
  "tres-leches": "./dish-photos/tres-leches.jpg",
  "mango-tres-leches": "./dish-photos/mango-tres-leches.jpeg",
  "biscoff-cheesecake": "./dish-photos/biscoff-cheesecake.jpg",
  "death-by-chocolate": "./dish-photos/death-by-chocolate.jpg",
  "nutella-brownie": "./dish-photos/nutella-brownie.jpg",
  "choco-truffle-brownie": "./dish-photos/choco-truffle-brownie.jpg",
  "biscoff-brownie": "./dish-photos/biscoff-brownie.jpg",
  "regular-brownie": "./dish-photos/regular-brownie.jpg",

  /* ---- Shakes (flavour-matched; thickshake = same drink, thicker) ---- */
  "mexican-vanilla-ms": "./dish-photos/mexican-vanilla-ms.jpg",
  "very-berry-ms": "./dish-photos/very-berry-ms.jpg",
  "blueberry-plunge-ms": "./dish-photos/blueberry-plunge-ms.jpg",
  "crunchy-caramel-ms": "./dish-photos/crunchy-caramel-ms.jpg",
  "nutella-brownie-ms": "./dish-photos/nutella-brownie-ms.jpg",
  "cookie-cream-ms": "./dish-photos/cookie-cream-ms.jpg",
  "nutella-latte-ms": "./dish-photos/nutella-latte-ms.jpg",
  "mexican-vanilla-ts": "./dish-photos/mexican-vanilla-ts.jpg",
  "very-berry-ts": "./dish-photos/very-berry-ts.jpg",
  "blueberry-ts": "./dish-photos/blueberry-ts.jpg",
  "crunchy-caramel-ts": "./dish-photos/crunchy-caramel-ts.jpg",
  "belgian-chocolate-ts": "./dish-photos/belgian-chocolate-ts.jpg",
  "nutella-brownie-ts": "./dish-photos/nutella-brownie-ts.jpg",
  "cookie-cream-ts": "./dish-photos/cookie-cream-ts.jpg",
  "nutella-latte-ts": "./dish-photos/nutella-latte-ts.jpg",

  /* ---- Maggie ---- */
  "masala-maggie": "./dish-photos/masala-maggie.jpg",
  "double-masala-maggie": "./dish-photos/double-masala-maggie.jpg",
  "butter-maggie": "./dish-photos/butter-maggie.jpg",
  "corn-maggie": "./dish-photos/corn-maggie.jpg",
  "mayo-maggie": "./dish-photos/mayo-maggie.jpg",
  "butter-peri-peri-maggie": "./dish-photos/butter-peri-peri-maggie.jpg",
  "peri-peri-maggie": "./dish-photos/peri-peri-maggie.jpg",
  "cheesy-maggie": "./dish-photos/cheesy-maggie.jpg",
  "korean-maggie": "./dish-photos/korean-maggie.jpg",
  "maggie-masala-pasta": "./dish-photos/maggie-masala-pasta.jpg",
  "schezwan-maggie": "./dish-photos/schezwan-maggie.jpg",
  "white-sauce-maggie": "1645112411341-6c4fd023714a",
  "pesto-maggie": "./dish-photos/pesto-maggie.jpg",
  "paneer-maggie": "./dish-photos/paneer-maggie.jpg",
  "corn-paneer-maggie": "./dish-photos/corn-paneer-maggie.jpg",
  "paneer-mayo-maggie": "./dish-photos/paneer-mayo-maggie.jpg",
  "peri-peri-paneer-maggie": "./dish-photos/peri-peri-paneer-maggie.jpg",
  "schezwan-paneer-maggie": "./dish-photos/schezwan-paneer-maggie.jpg",
  "korean-paneer-maggie": "./dish-photos/korean-paneer-maggie.jpg",
  "cheesy-paneer-maggie": "./dish-photos/cheesy-paneer-maggie.jpg",

  /* ---- Eat-Right ---- */
  "er-chocolate-sandwich": "./dish-photos/chocolate-sandwich.jpg",
  "er-mushroom-sandwich": "./dish-photos/mushroom-sandwich.jpg"
};

/* Category pools — used only for NEW items added in the Ops
   panel that don't have their own photo yet. */
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

export function itemImage(catId, item, index) {
  if (item.img) return item.img;
  const dedicated = ITEM_IMG[item.id];
  if (dedicated) return dedicated.startsWith("http") ? dedicated : U(dedicated);
  const pool = POOLS[catId];
  if (!pool) return null;
  return U(pool[index % pool.length]);
}

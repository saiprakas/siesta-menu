# 🧁 Siesta Dessert Cafe — QR MENU + OPS PANEL

> This folder is **only** the QR menu and the staff Ops panel.
> The website is a separate static project in **`D:\SIESTA DESSERT CAFE WEBISTE`** (no backend, information only).

| Page | Link (local) | What it is |
|---|---|---|
| **QR Menu** | `http://localhost:5173/` | What customers see after scanning the table QR — categories on the left, dishes with photos, veg 🟢 symbol, description, price, Bestseller/Spicy tags and clear OUT OF STOCK marking. Display-only (no order buttons). |
| **Ops Panel** | `http://localhost:5173/#/ops` | Staff back-office — the ONLY thing connected to the menu. Add/edit/delete categories & dishes, change **names, prices, descriptions and images**, mark Bestseller / out of stock, reorder, announcement ribbon. |

> **Ops login** — default password: `siesta2704` (change it in Menu Settings → Security).

## Run locally

```bash
npm install     # first time only
npm run dev     # open http://localhost:5173
```

## Put the menu online (free)

1. `npm run build` → creates the `dist` folder.
2. Go to https://app.netlify.com/drop and drag `dist` onto it.
3. You get a link like `https://siesta-menu.netlify.app` — that link IS the menu.

## Make the table QR

Use any free QR generator (e.g. qr-code-generator.com) with your live menu link
(`https://siesta-menu.netlify.app`). Print at least 4×4 cm, laminate, place on tables.
The QR never changes — menu edits appear automatically after **Save & Publish**.

## ⚠️ IMPORTANT — live sync (Firebase, free, ~10 min)

Out of the box, ops edits save in **that browser only**. For edits to reach
customers' phones, connect Firebase:

1. https://console.firebase.google.com → **Add project** → `siesta-menu`.
2. **Build → Firestore Database → Create database** → test mode → `asia-south1 (Mumbai)` → Enable.
3. Project Overview → **`</>` Web** icon → register app → copy the `firebaseConfig` block.
4. Paste it into **`src/lib/firebaseConfig.js`** (replace the `null`).
5. `npm run build` → re-drag `dist` to Netlify.

The Ops top bar then shows **● LIVE SYNC**. After 30 days replace Firestore test-mode
rules with: `allow read: if true; allow write: if true;` (or add Firebase Auth for real security).

## Where things live

```
src/
  data/menuData.js       ← seed menu (first run / reset only — daily edits happen in Ops)
  lib/store.js           ← menu backend layer (localStorage ⇄ Firebase)
  lib/firebaseConfig.js  ← paste Firebase config here for live sync
  lib/itemImages.js      ← dedicated dish photos (Ops "Dish Photo URL" overrides these)
  pages/Menu.jsx         ← the QR menu
  pages/Ops.jsx          ← the ops panel
  styles/                ← base.css, menu.css, ops.css
```

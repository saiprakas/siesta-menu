/* ============================================================
   SIESTA STORE — one shared backend layer for
   Website (/) + QR Menu (/#/menu) + Ops Panel (/#/ops)
   ------------------------------------------------------------
   Mode "firebase": live sync across all devices
                    (enable in src/lib/firebaseConfig.js)
   Mode "local":    browser localStorage (single-device demo)
   ============================================================ */

import { DEFAULT_DATA } from "../data/menuData.js";
import { FIREBASE_CONFIG } from "./firebaseConfig.js";

const KEY = "siesta_cafe_data_v1";
const DOC = { col: "siesta", doc: "data" };

let mode = "local";
let db = null;
let storage = null;
let readyPromise = null;
let storagePromise = null;

const defaults = () => JSON.parse(JSON.stringify(DEFAULT_DATA));

/* Fill any missing keys so previously saved data survives upgrades */
function migrate(data) {
  const def = defaults();
  if (!data || typeof data !== "object") return def;
  data.settings = { ...def.settings, ...(data.settings || {}) };
  // One-time fixups: refresh values saved from older seed data
  if (data.settings.instagram === "siesta2704") data.settings.instagram = def.settings.instagram;
  if (data.settings.hours?.[0]?.time === "11:00 AM – 11:00 PM") data.settings.hours = def.settings.hours;
  if (!Array.isArray(data.categories)) data.categories = def.categories;
  if (!Array.isArray(data.callbacks)) data.callbacks = [];
  data.categories.forEach((c) => {
    if (!Array.isArray(c.items)) c.items = [];
    if (!Array.isArray(c.addons)) c.addons = [];
    c.items.forEach((it) => {
      if (typeof it.inStock !== "boolean") it.inStock = true;
      if (typeof it.veg !== "boolean") it.veg = true;
      if (!Array.isArray(it.tags)) it.tags = [];
    });
  });
  return data;
}

function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

function init() {
  if (readyPromise) return readyPromise;
  readyPromise = (async () => {
    if (!FIREBASE_CONFIG) return;
    try {
      const v = "10.14.1";
      await loadScript(`https://www.gstatic.com/firebasejs/${v}/firebase-app-compat.js`);
      await loadScript(`https://www.gstatic.com/firebasejs/${v}/firebase-firestore-compat.js`);
      window.firebase.initializeApp(FIREBASE_CONFIG);
      db = window.firebase.firestore();
      mode = "firebase";
    } catch (e) {
      console.warn("Firebase unavailable — falling back to local storage.", e);
    }
  })();
  return readyPromise;
}

/* Lazily loads the Storage SDK the first time a photo needs uploading —
   most sessions never touch it, so it's not part of the initial load. */
function initStorage() {
  if (storagePromise) return storagePromise;
  storagePromise = (async () => {
    await init();
    if (mode !== "firebase") return null;
    const v = "10.14.1";
    await loadScript(`https://www.gstatic.com/firebasejs/${v}/firebase-storage-compat.js`);
    storage = window.firebase.storage();
    return storage;
  })();
  return storagePromise;
}

export const Store = {
  get mode() {
    return mode;
  },

  /* Uploads a compressed photo Blob to Firebase Storage and returns its
     public URL. Only works once live sync (Firebase) is connected. */
  async uploadPhoto(blob, path) {
    const st = await initStorage();
    if (!st) throw new Error("Live sync isn't connected yet — connect Firebase before uploading photos.");
    const ref = st.ref().child(path);
    await ref.put(blob, { contentType: blob.type || "image/jpeg" });
    return ref.getDownloadURL();
  },

  async getData() {
    await init();
    if (mode === "firebase") {
      const snap = await db.collection(DOC.col).doc(DOC.doc).get();
      if (snap.exists) return migrate(snap.data());
      const d = defaults();
      await db.collection(DOC.col).doc(DOC.doc).set(d);
      return d;
    }
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return migrate(JSON.parse(raw));
    } catch {
      /* corrupted — reseed below */
    }
    const d = defaults();
    localStorage.setItem(KEY, JSON.stringify(d));
    return d;
  },

  async saveData(data) {
    data.updatedAt = Date.now();
    await init();
    if (mode === "firebase") {
      // Only write the fields the Ops panel actually edits (categories,
      // settings). Never touch `callbacks` here — the Ops draft can be
      // minutes/hours stale while someone edits, and a full-document
      // overwrite would silently delete any customer callback that
      // arrived in the meantime. merge:true leaves untouched fields alone.
      const payload = JSON.parse(
        JSON.stringify({ categories: data.categories, settings: data.settings, updatedAt: data.updatedAt })
      );
      await db.collection(DOC.col).doc(DOC.doc).set(payload, { merge: true });
    } else {
      localStorage.setItem(KEY, JSON.stringify(data));
      // Notify other components in THIS tab too (storage event only
      // fires in other tabs).
      window.dispatchEvent(new CustomEvent("siesta-data", { detail: data }));
    }
  },

  /* Live updates — fires cb(newData) whenever the Ops panel saves. */
  subscribe(cb) {
    let unsub = () => {};
    init().then(() => {
      if (mode === "firebase") {
        unsub = db
          .collection(DOC.col)
          .doc(DOC.doc)
          .onSnapshot((snap) => {
            if (snap.exists) cb(migrate(snap.data()));
          });
      } else {
        const onStorage = (e) => {
          if (e.key === KEY && e.newValue) {
            try {
              cb(migrate(JSON.parse(e.newValue)));
            } catch {}
          }
        };
        const onLocal = (e) => cb(migrate(e.detail));
        window.addEventListener("storage", onStorage);
        window.addEventListener("siesta-data", onLocal);
        unsub = () => {
          window.removeEventListener("storage", onStorage);
          window.removeEventListener("siesta-data", onLocal);
        };
      }
    });
    return () => unsub();
  },

  /* Callback-request from the website contact form. Writes only the
     `callbacks` field via an atomic array append — never reads-then-writes
     the whole document, so it can't collide with (or be clobbered by) an
     Ops panel save happening at the same time. */
  async addCallback(entry) {
    await init();
    const callback = {
      ...entry,
      id: "cb_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      createdAt: Date.now(),
      status: "new"
    };
    if (mode === "firebase") {
      await db
        .collection(DOC.col)
        .doc(DOC.doc)
        .set({ callbacks: window.firebase.firestore.FieldValue.arrayUnion(callback) }, { merge: true });
    } else {
      const data = await this.getData();
      data.callbacks = data.callbacks || [];
      data.callbacks.unshift(callback);
      localStorage.setItem(KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent("siesta-data", { detail: data }));
    }
  },

  /* Explicit, confirmed full wipe (Settings -> Danger Zone) — unlike
     saveData(), this intentionally replaces EVERYTHING, callbacks included. */
  async resetToDefaults() {
    await init();
    const d = defaults();
    d.updatedAt = Date.now();
    if (mode === "firebase") {
      await db.collection(DOC.col).doc(DOC.doc).set(d);
    } else {
      localStorage.setItem(KEY, JSON.stringify(d));
      window.dispatchEvent(new CustomEvent("siesta-data", { detail: d }));
    }
  }
};

/* ============================================================
   FIREBASE CONFIG (optional — but needed for LIVE sync)
   ------------------------------------------------------------
   Without this, everything still works — but only on ONE
   browser (good for testing on your laptop).

   To make Ops-Panel edits show up instantly on customers'
   phones (QR menu) and on the website, connect Firebase:

   1. Go to https://console.firebase.google.com → Add project
   2. Project name: siesta-dessert-cafe → Create
   3. Build → Firestore Database → Create database →
      Start in TEST MODE → location: asia-south1 (Mumbai) → Enable
   4. Project Overview → click the </> (Web) icon → register app
      "siesta-web" → copy the firebaseConfig values shown
   5. Replace `null` below with your config object, save,
      then rebuild/redeploy (npm run build).

   Full step-by-step (with security rules) is in README.md.
   ============================================================ */

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBTtpm45JQjOhqL1N4NPgro6JmHWHhlgfE",
  authDomain: "siesta-cafe.firebaseapp.com",
  projectId: "siesta-cafe",
  storageBucket: "siesta-cafe.firebasestorage.app",
  messagingSenderId: "481147875191",
  appId: "1:481147875191:web:51b8e6d18352cb019e3b72"
};

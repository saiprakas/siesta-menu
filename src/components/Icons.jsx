/* ============================================================
   Solid drawn icon set (inline SVG, fills with currentColor).
   Replaces OS emojis so the design looks identical — and
   premium — on every phone and laptop.
   ============================================================ */

const P = (d) => <path d={d} />;
const PE = (d) => <path fillRule="evenodd" d={d} />;

const ICONS = {
  /* ---------- food categories ---------- */
  fries: (
    <>
      {P("M7.2 10.5 5.6 20a2 2 0 0 0 2 2.3h8.8a2 2 0 0 0 2-2.3l-1.6-9.5Z")}
      <rect x="7.6" y="3.2" width="2.1" height="6.6" rx="1" />
      <rect x="11" y="1.8" width="2.1" height="8" rx="1" />
      <rect x="14.4" y="3.2" width="2.1" height="6.6" rx="1" />
    </>
  ),
  pizza: PE(
    "M12 22.5 2.2 6.6a16.5 16.5 0 0 1 19.6 0ZM9 7.3a1.7 1.7 0 1 0 1.7 1.7A1.7 1.7 0 0 0 9 7.3Zm5.4 3.6a1.7 1.7 0 1 0 1.7 1.7 1.7 1.7 0 0 0-1.7-1.7Z"
  ),
  burger: (
    <>
      {P("M4 9.8C4 5.6 8 3.4 12 3.4s8 2.2 8 6.4Z")}
      <rect x="4" y="11" width="16" height="3.2" rx="1.6" />
      {P("M4 15.6h16v1.2a3.2 3.2 0 0 1-3.2 3.2H7.2A3.2 3.2 0 0 1 4 16.8Z")}
    </>
  ),
  waffle: PE(
    "M6 2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Zm1.4 5.4v3.2h3.2V7.4Zm6 0v3.2h3.2V7.4Zm-6 6v3.2h3.2v-3.2Zm6 0v3.2h3.2v-3.2Z"
  ),
  cake: (
    <>
      <rect x="11.1" y="3.2" width="1.8" height="4.2" rx="0.9" />
      <circle cx="12" cy="1.9" r="1.2" />
      {P("M4 13v-1.6c0-2.4 3.6-3.9 8-3.9s8 1.5 8 3.9V13Z")}
      <rect x="3" y="14" width="18" height="7" rx="2" />
    </>
  ),
  sandwich: (
    <>
      {P("M12 3.6 22 17.8H2Z")}
      <rect x="2" y="19" width="20" height="2.2" rx="1.1" />
    </>
  ),
  pasta: (
    <>
      <ellipse cx="12" cy="17.5" rx="9.5" ry="3.4" />
      {PE("M12 6.2a6 6 0 1 1-6 6 6 6 0 0 1 6-6Zm0 3.6a2.4 2.4 0 1 0 2.4 2.4A2.4 2.4 0 0 0 12 9.8Z")}
    </>
  ),
  cupcake: (
    <>
      {P("M5.4 10.8a6.6 6.6 0 0 1 13.2 0Z")}
      <circle cx="12" cy="3.4" r="1.5" />
      {P("M5 12.2h14l-1.6 7.2a2.1 2.1 0 0 1-2 1.6H8.6a2.1 2.1 0 0 1-2-1.6Z")}
    </>
  ),
  shake: (
    <>
      {P("M13.1 1.5 16.9 2.5 16.4 4.5 12.6 3.5Z")}
      <rect x="6" y="5.6" width="12" height="2.2" rx="1.1" />
      {P("M6.8 9h10.4l-1.5 11a2 2 0 0 1-2 1.7h-3.4a2 2 0 0 1-2-1.7Z")}
    </>
  ),
  noodles: (
    <>
      {P("M13.4 1.2 22 4.4l-.6 1.6-8.6-3.2Z")}
      <rect x="5" y="7.6" width="14" height="1.7" rx="0.85" />
      <rect x="7" y="4.6" width="10" height="1.7" rx="0.85" />
      {P("M2.5 11h19c0 5.2-4.2 9.2-9.5 9.2S2.5 16.2 2.5 11Z")}
    </>
  ),
  leaf: (
    <>
      {P("M20.5 3.5C10 3.5 3.8 9.8 3.8 20.2c10.4 0 16.7-6.3 16.7-16.7Z")}
    </>
  ),

  /* ---------- tags ---------- */
  star: P("M12 2.5l2.8 6 6.5.8-4.8 4.4 1.3 6.4L12 16.9l-5.8 3.2 1.3-6.4L2.7 9.3l6.5-.8Z"),
  flame: P(
    "M13.3 2.1c.6 2.9-.3 5-2 6.7-1.3 1.3-2.6 2.6-2.9 4.4-.7-.8-1.1-1.7-1.2-2.7C5.8 12.2 5 13.9 5 15.7 5 19.2 8.1 22 12 22s7-2.8 7-6.3c0-4.3-3.6-6.1-5.7-13.6Z"
  ),
  chef: (
    <>
      {P("M12 2.5a5 5 0 0 0-4.4 2.6A4.5 4.5 0 0 0 2.5 9.5c0 1.9 1.2 3.5 2.9 4.2V19h13.2v-5.3a4.5 4.5 0 0 0 2.9-4.2 4.5 4.5 0 0 0-5.1-4.4A5 5 0 0 0 12 2.5Z")}
      {P("M5.4 20.3h13.2V22H5.4Z")}
    </>
  ),
  sparkles: (
    <>
      {P("M9.5 3l1.6 4.6 4.6 1.6-4.6 1.6-1.6 4.6-1.6-4.6-4.6-1.6 4.6-1.6Z")}
      {P("M18.5 13l1 2.9 2.9 1-2.9 1-1 2.9-1-2.9-2.9-1 2.9-1Z")}
    </>
  ),

  /* ---------- contact & UI ---------- */
  phone: P(
    "M6.6 2.7c.5-.5 1.3-.6 1.9-.2l2.8 2a1.5 1.5 0 0 1 .5 1.9l-1.1 2.2a1 1 0 0 0 .2 1.2l3.3 3.3a1 1 0 0 0 1.2.2l2.2-1.1a1.5 1.5 0 0 1 1.9.5l2 2.8c.4.6.3 1.4-.2 1.9l-1.8 1.8c-.6.6-1.5.9-2.3.6C10.9 18.6 5.4 13.1 3.2 6.8c-.3-.8 0-1.7.6-2.3Z"
  ),
  chat: PE(
    "M12 2.5A9.3 9.3 0 0 0 3.9 16.4L2.5 21.5l5.2-1.4A9.3 9.3 0 1 0 12 2.5ZM8 11a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 11Zm4 0a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Zm4 0a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"
  ),
  instagram: PE(
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2A3 3 0 0 0 4 7v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.4-3.7a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z"
  ),
  pin: PE(
    "M12 2a7.3 7.3 0 0 0-7.3 7.3C4.7 14.6 12 22 12 22s7.3-7.4 7.3-12.7A7.3 7.3 0 0 0 12 2Zm0 9.8a2.6 2.6 0 1 1 2.6-2.6 2.6 2.6 0 0 1-2.6 2.6Z"
  ),
  clock: PE("M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 4v5.6l4.2 2.4-1 1.7L11 12.7V6Z"),
  search: PE(
    "M10.5 2a8.5 8.5 0 1 0 5.3 15.2l4.5 4.5 1.7-1.7-4.5-4.5A8.5 8.5 0 0 0 10.5 2Zm0 2.5a6 6 0 1 1-6 6 6 6 0 0 1 6-6Z"
  ),
  utensils: (
    <>
      {P("M5 2h1.4v5h1V2h1.4v5h1V2h1.4v6a3 3 0 0 1-2.1 2.9V21a1.05 1.05 0 0 1-2.1 0V10.9A3 3 0 0 1 5 8Z")}
      {P("M14.5 2c2.8 1.7 4 4.9 4 8 0 1.8-.9 3-2 3.3V21a1 1 0 0 1-2 0Z")}
    </>
  ),
  chart: (
    <>
      <rect x="4" y="12" width="4" height="8" rx="1" />
      <rect x="10" y="7" width="4" height="13" rx="1" />
      <rect x="16" y="3" width="4" height="17" rx="1" />
    </>
  ),
  sliders: (
    <>
      <rect x="3" y="5" width="18" height="2" rx="1" />
      <circle cx="9" cy="6" r="2.6" />
      <rect x="3" y="11" width="18" height="2" rx="1" />
      <circle cx="16" cy="12" r="2.6" />
      <rect x="3" y="17" width="18" height="2" rx="1" />
      <circle cx="7" cy="18" r="2.6" />
    </>
  ),
  qr: PE(
    "M3 3h8v8H3V3Zm2 2v4h4V5H5Zm8-2h8v8h-8V3Zm2 2v4h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm8-2h2.5v2.5H13V13Zm5.5 0H21v2.5h-2.5V13Zm-2.75 2.75h2.5v2.5h-2.5v-2.5ZM13 18.5h2.5V21H13v-2.5Zm5.5 0H21V21h-2.5v-2.5Z"
  ),
  pencil: (
    <>
      {P("M16.9 3.1a2.5 2.5 0 0 1 3.5 3.5l-1.2 1.2-3.5-3.5Z")}
      {P("M14.2 5.8 3 17v3.5h3.5L17.7 9.3Z")}
    </>
  ),
  trash: (
    <>
      {P("M9 2h6l1 2h4v2H4V4h4Z")}
      {P("M6 8h12l-.9 12.1a2 2 0 0 1-2 1.9H8.9a2 2 0 0 1-2-1.9Z")}
    </>
  ),
  plus: P("M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7Z"),
  check: P("M9.5 18.3 3.8 12.6l1.8-1.8 3.9 3.9L18.4 5.8l1.8 1.8Z"),
  x: P("M6.4 4.6 12 10.2l5.6-5.6 1.8 1.8L13.8 12l5.6 5.6-1.8 1.8L12 13.8l-5.6 5.6-1.8-1.8L10.2 12 4.6 6.4Z"),
  download: (
    <>
      {P("M11 3h2v9.2l3.6-3.6 1.4 1.4-6 6-6-6 1.4-1.4L11 12.2Z")}
      <rect x="4" y="18" width="16" height="2" rx="1" />
    </>
  ),
  printer: (
    <>
      {P("M7 3h10v4H7Z")}
      {P("M5 8h14a2 2 0 0 1 2 2v6h-4v-3H7v3H3v-6a2 2 0 0 1 2-2Z")}
      {P("M7 15h10v6H7Z")}
    </>
  ),
  eye: PE(
    "M12 5C6 5 2 12 2 12s4 7 10 7 10-7 10-7-4-7-10-7Zm0 10.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5Z"
  ),
  home: P("M12 3 2.5 11.5H5V21h5.5v-5h3v5H19v-9.5h2.5Z"),
  disk: PE(
    "M5 3h11l5 5v13a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 2v5h8V5Zm5 9a3 3 0 1 0 3 3 3 3 0 0 0-3-3Z"
  ),
  chevronUp: P("M12 8l6 6-1.8 1.8L12 11.6 7.8 15.8 6 14Z"),
  chevronDown: P("M12 16 6 10l1.8-1.8L12 12.4l4.2-4.2L18 10Z")
};

export function Icon({ name, size = 20, className = "", style }) {
  const glyph = ICONS[name];
  if (!glyph) return null;
  return (
    <svg
      className={`ic-svg ${className}`.trim()}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}

/* Category → drawn icon. Default categories map by id; categories
   added later in the Ops panel fall back to their emoji text. */
const CAT_ICON = {
  fries: "fries",
  pizza: "pizza",
  burgers: "burger",
  waffles: "waffle",
  cakes: "cake",
  sandwiches: "sandwich",
  pasta: "pasta",
  desserts: "cupcake",
  shakes: "shake",
  maggie: "noodles",
  eatright: "leaf"
};

export function CatIcon({ cat, size = 20 }) {
  const name = CAT_ICON[cat.id] || (ICONS[cat.icon] ? cat.icon : null);
  if (name) return <Icon name={name} size={size} />;
  return <span style={{ fontSize: size * 0.9, lineHeight: 1 }}>{cat.icon}</span>;
}

export const TAG_META = {
  bestseller: { icon: "star", label: "Bestseller" },
  spicy: { icon: "flame", label: "Spicy" },
  "chefs-special": { icon: "chef", label: "Chef's Special" },
  new: { icon: "sparkles", label: "New" }
};

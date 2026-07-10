import { useMemo, useState } from "react";
import { useCafeData } from "../lib/useCafeData.js";
import { Icon, CatIcon, TAG_META } from "../components/Icons.jsx";
import { itemImage } from "../lib/itemImages.js";
import "../styles/menu.css";

/* ============================================================
   QR MENU — the only page connected to the Ops backend.
   Layout: slim category rail on the LEFT, dishes of the
   selected category on the RIGHT. No accordions — one tap on
   a category shows its dishes instantly.
   ============================================================ */

function Tag({ t }) {
  const meta = TAG_META[t];
  if (!meta) return <span className={`tag-chip tag-${t}`}>{t}</span>;
  return (
    <span className={`tag-chip tag-${t}`}>
      <Icon name={meta.icon} size={10} /> {meta.label}
    </span>
  );
}

/* Small curved-square dish photo; falls back to a drawn tile */
function DishThumb({ cat, item, index }) {
  const [failed, setFailed] = useState(false);
  const src = itemImage(cat.id, item, index);
  if (!src || failed) {
    return (
      <span className="m-thumb art">
        <CatIcon cat={cat} size={22} />
      </span>
    );
  }
  return (
    <span className="m-thumb">
      <img src={src} alt={item.name} width={56} height={56} loading="lazy" onError={() => setFailed(true)} />
    </span>
  );
}

function ItemRow({ cat, item, index }) {
  return (
    <article className={`m-item ${item.inStock ? "" : "oos"}`}>
      <DishThumb cat={cat} item={item} index={index} />
      <div className="info">
        <div className="row1">
          <span className="veg-badge" title="Vegetarian" />
          <h3>{item.name}</h3>
          {item.note && <span className="note">{item.note}</span>}
        </div>
        {item.desc && <p className="desc">{item.desc}</p>}
        {(item.tags.length > 0 || !item.inStock) && (
          <div className="tags">
            {!item.inStock && <span className="m-oos-label">OUT OF STOCK</span>}
            {item.tags.map((t) => (
              <Tag key={t} t={t} />
            ))}
          </div>
        )}
      </div>
      <div className="right">
        <span className="price">
          <small>₹</small>
          {item.price}
        </span>
      </div>
    </article>
  );
}

export default function Menu() {
  const { data, loading } = useCafeData();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(null);
  const [filters, setFilters] = useState({ bestseller: false, spicy: false, "chefs-special": false });

  const searching = query.trim().length > 0;
  const anyFilter = Object.values(filters).some(Boolean);

  const applyFilters = (items) => {
    let out = items;
    const q = query.trim().toLowerCase();
    if (q) out = out.filter((it) => (it.name + " " + (it.desc || "")).toLowerCase().includes(q));
    if (anyFilter) out = out.filter((it) => it.tags.some((t) => filters[t]));
    return out;
  };

  const results = useMemo(() => {
    if (!data) return [];
    return data.categories
      .map((cat) => ({ ...cat, items: applyFilters(cat.items) }))
      .filter((cat) => cat.items.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, query, filters]);

  if (loading || !data) {
    return (
      <div className="loader-screen">
        <div className="script">Siesta</div>
        <div className="bar"><i /></div>
        <p className="loader-note">getting today's menu…</p>
      </div>
    );
  }

  const s = data.settings;
  const cats = data.categories;
  const selected = cats.find((c) => c.id === activeCat) || cats[0];
  const globalMode = searching || anyFilter;

  return (
    <div className="menu-page fade-in">
      {/* Header */}
      <header className="m-head">
        <div className="script">Siesta</div>
        <small>Dessert Cafe · Menu</small>
        <div className="veg-note">
          <span className="veg-badge" /> 100% Pure Vegetarian
        </div>
      </header>

      {s.announcement && <div className="m-announce">✦ {s.announcement} ✦</div>}

      {/* Sticky search + filters */}
      <div className="m-sticky">
        <div className="m-search">
          <span className="ic"><Icon name="search" size={16} /></span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search waffles, cakes, maggie…"
            aria-label="Search the menu"
          />
        </div>
        <div className="m-filters">
          {["bestseller", "spicy", "chefs-special"].map((f) => (
            <button
              key={f}
              className={`m-filter ${filters[f] ? "on" : ""}`}
              onClick={() => setFilters({ ...filters, [f]: !filters[f] })}
            >
              <Icon name={TAG_META[f].icon} size={11} /> {TAG_META[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar + items */}
      <div className="m-layout">
        <aside className="m-side" aria-label="Menu categories">
          {cats.map((c) => (
            <button
              key={c.id}
              className={`m-side-btn ${!globalMode && selected.id === c.id ? "active" : ""}`}
              onClick={() => {
                setActiveCat(c.id);
                setQuery("");
                setFilters({ bestseller: false, spicy: false, "chefs-special": false });
              }}
            >
              <span className="sb-ic"><CatIcon cat={c} size={20} /></span>
              <span className="sb-nm">{c.name}</span>
              <span className="sb-ct">{c.items.length}</span>
            </button>
          ))}
        </aside>

        <main className="m-main">
          {globalMode ? (
            <>
              <div className="m-cat-title">
                <h2>Search Results</h2>
                <p>{results.reduce((n, c) => n + c.items.length, 0)} dishes found</p>
              </div>
              {results.length === 0 && (
                <div className="m-empty">
                  <div className="big"><Icon name="utensils" size={44} /></div>
                  Nothing matches — try another craving!
                </div>
              )}
              {results.map((cat) => (
                <section key={cat.id} className="m-group">
                  <h4 className="m-group-label">
                    <CatIcon cat={cat} size={14} /> {cat.name}
                  </h4>
                  {cat.items.map((item, ii) => (
                    <ItemRow key={item.id} cat={cat} item={item} index={ii} />
                  ))}
                </section>
              ))}
            </>
          ) : (
            <>
              <div className="m-cat-title">
                <h2>{selected.name}</h2>
                <p>{selected.desc}</p>
              </div>
              {selected.addons?.length > 0 && (
                <div className="m-addons">
                  <b>Add-ons:</b>{" "}
                  {selected.addons.map((a, i) => (
                    <span key={i}>
                      {a.name} {a.price > 0 ? `+₹${a.price}` : "(free)"}
                      {i < selected.addons.length - 1 ? " • " : ""}
                    </span>
                  ))}
                </div>
              )}
              <div className="m-items">
                {selected.items.map((item, ii) => (
                  <ItemRow key={item.id} cat={selected} item={item} index={ii} />
                ))}
              </div>
            </>
          )}

          <footer className="m-foot">
            <span className="script">Siesta</span>
            <em className="m-quote">“Life is short. Eat dessert first.”</em>
            {s.tagline}
            <small className="m-foot-note">Images shown are for illustration only and may vary from the actual item.</small>
          </footer>
        </main>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Store } from "../lib/store.js";
import { Icon, CatIcon, TAG_META } from "../components/Icons.jsx";
import "../styles/ops.css";

const AUTH_KEY = "siesta_ops_auth";
const ALL_TAGS = ["bestseller", "chefs-special", "spicy", "new"];

const clone = (o) => JSON.parse(JSON.stringify(o));
const slug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 5);

/* Read a photo picked from the gallery/camera (including big 4K shots),
   shrink it so the menu stays fast to load, and hand back a compressed
   Blob ready to upload. Uses createImageBitmap when available — it
   handles large files without holding a giant base64 string in memory,
   and honors EXIF rotation so phone photos don't come out sideways. */
async function compressPhoto(file, maxDim = 900, quality = 0.75) {
  const MAX_BYTES = 30 * 1024 * 1024; // 30MB raw-file safety cap
  if (file.size > MAX_BYTES) {
    throw new Error("That photo is too large (over 30MB). Please choose a smaller one.");
  }

  let source, width, height;
  if (typeof createImageBitmap === "function") {
    try {
      source = await createImageBitmap(file, { imageOrientation: "from-image" });
      width = source.width;
      height = source.height;
    } catch {
      source = null;
    }
  }

  if (!source) {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("read failed"));
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
    source = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => resolve(img);
      img.src = dataUrl;
    });
    width = source.width;
    height = source.height;
  }

  let outW = width, outH = height;
  if (outW > outH && outW > maxDim) {
    outH = Math.round((outH * maxDim) / outW);
    outW = maxDim;
  } else if (outH > maxDim) {
    outW = Math.round((outW * maxDim) / outH);
    outH = maxDim;
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  canvas.getContext("2d").drawImage(source, 0, 0, outW, outH);
  if (typeof source.close === "function") source.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("compress failed"))), "image/jpeg", quality);
  });
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/* ============================================================ */

export default function Ops() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [draft, setDraft] = useState(null); // working copy of all data
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [modal, setModal] = useState(null); // {type:"item"|"category", catId, item?}

  useEffect(() => {
    Store.getData().then((d) => setDraft(clone(d)));
    const unsub = Store.subscribe((d) => {
      // Only take remote updates when we have no unsaved edits.
      setDraft((cur) => (cur && dirtyRef.current ? cur : clone(d)));
    });
    return unsub;
  }, []);

  // keep a ref of dirty for the subscription closure
  const dirtyRef = useMemo(() => ({ current: false }), []);
  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty, dirtyRef]);

  const update = (fn) => {
    setDraft((cur) => {
      const next = clone(cur);
      fn(next);
      return next;
    });
    setDirty(true);
  };

  async function saveAll() {
    setSaving(true);
    setSaveError("");
    try {
      await Store.saveData(clone(draft));
      setDirty(false);
    } catch (err) {
      const msg = String(err?.message || "");
      const tooLarge = err?.name === "QuotaExceededError" || /longer than|exceeds the maximum|too large/i.test(msg);
      setSaveError(
        tooLarge
          ? "Too much data to save — likely from too many uploaded photos. Remove or replace a large photo and try again."
          : "Couldn't save — check your connection and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!authed) return <Login onOk={() => { sessionStorage.setItem(AUTH_KEY, "1"); setAuthed(true); }} />;

  if (!draft) {
    return (
      <div className="loader-screen">
        <div className="script">Siesta</div>
        <div className="bar"><i /></div>
        <p className="loader-note">opening the ops panel…</p>
      </div>
    );
  }

  const totalItems = draft.categories.reduce((n, c) => n + c.items.length, 0);
  const oosItems = draft.categories.reduce((n, c) => n + c.items.filter((i) => !i.inStock).length, 0);

  return (
    <div className="ops">
      {/* ---------- Top bar ---------- */}
      <div className="ops-top">
        <div className="ops-brand">
          <div className="script">Siesta</div>
          <small>Ops Panel</small>
        </div>
        <div className="grow" />
        <span className={`ops-mode ${Store.mode === "firebase" ? "live" : "local"}`}>
          {Store.mode === "firebase" ? "● LIVE SYNC" : "◐ THIS DEVICE ONLY"}
        </span>
        <button
          className="ops-logout"
          onClick={() => {
            sessionStorage.removeItem(AUTH_KEY);
            setAuthed(false);
          }}
        >
          Logout
        </button>
      </div>

      {/* ---------- Tabs ---------- */}
      <div className="ops-tabs">
        {[
          ["dashboard", "chart", "Dashboard"],
          ["menu", "utensils", "Menu"]
        ].map(([id, icon, label]) => (
          <button key={id} className={`ops-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
            <Icon name={icon} size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="ops-main">

        {tab === "dashboard" && (
          <Dashboard
            draft={draft}
            totalItems={totalItems}
            oosItems={oosItems}
            goto={setTab}
          />
        )}

        {tab === "menu" && (
          <MenuManager draft={draft} update={update} openModal={setModal} />
        )}
      </div>

      {/* ---------- Save bar ---------- */}
      <div className={`ops-save-bar ${dirty ? "show" : ""}`}>
        {saveError ? <span className="err">{saveError}</span> : <span>You have unsaved changes</span>}
        <button className="ops-btn gold" onClick={saveAll} disabled={saving}>
          <Icon name="disk" size={14} /> {saving ? "Saving…" : "Save & Publish"}
        </button>
        <button
          className="ops-btn ghost"
          onClick={async () => {
            const d = await Store.getData();
            setDraft(clone(d));
            setDirty(false);
            setSaveError("");
          }}
        >
          Discard
        </button>
      </div>

      {/* ---------- Modals ---------- */}
      {modal?.type === "item" && (
        <ItemModal
          modal={modal}
          onClose={() => setModal(null)}
          onSave={(catId, item, isNew) =>
            update((d) => {
              const cat = d.categories.find((c) => c.id === catId);
              if (!cat) return;
              if (isNew) cat.items.push(item);
              else {
                const i = cat.items.findIndex((x) => x.id === item.id);
                if (i >= 0) cat.items[i] = item;
              }
            }) || setModal(null)
          }
        />
      )}
      {modal?.type === "category" && (
        <CategoryModal
          modal={modal}
          onClose={() => setModal(null)}
          onSave={(cat, isNew) =>
            update((d) => {
              if (isNew) d.categories.push(cat);
              else {
                const i = d.categories.findIndex((x) => x.id === cat.id);
                if (i >= 0) d.categories[i] = { ...d.categories[i], ...cat };
              }
            }) || setModal(null)
          }
        />
      )}
    </div>
  );
}

/* ============================================================
   LOGIN
   ============================================================ */
function Login({ onOk }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    const data = await Store.getData();
    if (pw === data.settings.opsPassword) onOk();
    else setErr("Incorrect password. Try again.");
  }

  return (
    <div className="ops-login">
      <form className="ops-login-card" onSubmit={submit}>
        <div className="script">Siesta</div>
        <small>Dessert Cafe</small>
        <h1>Ops Team Login</h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Enter ops password"
          autoFocus
        />
        {err && <div className="err">{err}</div>}
        <button className="btn btn-gold" type="submit">Login →</button>
        <div className="hint">
          <Link to="/">← Back to website</Link>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard({ draft, totalItems, oosItems, goto }) {
  return (
    <>
      <div className="dash-grid">
        <div className="dash-stat"><b>{draft.categories.length}</b><span>Categories</span></div>
        <div className="dash-stat"><b>{totalItems}</b><span>Menu Items</span></div>
        <div className="dash-stat"><b className={oosItems ? "accent" : ""}>{oosItems}</b><span>Out of Stock</span></div>
        <div className="dash-stat"><b>{draft.categories.reduce((n, c) => n + c.items.filter((i) => i.tags.includes("bestseller")).length, 0)}</b><span>Bestsellers</span></div>
      </div>
      <div className="ops-card">
        <h2>Quick Actions</h2>
        <p className="sub">This panel manages the QR menu only. Changes go live on customers' phones after you hit Save & Publish.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="ops-btn gold" onClick={() => goto("menu")}><Icon name="utensils" size={14} /> Edit Menu</button>
          <Link className="ops-btn ghost" to="/menu" target="_blank"><Icon name="eye" size={14} /> Preview Menu</Link>
        </div>
      </div>
      {draft.settings.announcement && (
        <div className="ops-card">
          <h2>Active Announcement</h2>
          <p className="sub">Currently showing on the website & menu: “{draft.settings.announcement}”</p>
        </div>
      )}
    </>
  );
}

/* ============================================================
   MENU MANAGER
   ============================================================ */
function MenuManager({ draft, update, openModal }) {
  const [selectedCat, setSelectedCat] = useState(null);

  const move = (arr, i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  const ci = draft.categories.findIndex((c) => c.id === selectedCat);
  const cat = ci >= 0 ? draft.categories[ci] : null;

  /* ---------- Detail view: one category's dishes ---------- */
  if (cat) {
    return (
      <>
        <button className="ops-btn ghost back-btn" onClick={() => setSelectedCat(null)}>
          <Icon name="arrowLeft" size={14} /> All Categories
        </button>

        <div className="cat-block">
          <div className="cat-block-head">
            <span className="em"><CatIcon cat={cat} size={24} /></span>
            <div>
              <b>{cat.name}</b>
              <div className="cnt">
                {cat.items.length} items · {cat.items.filter((i) => !i.inStock).length} out of stock
              </div>
            </div>
            <div className="grow" />
            <div className="cat-tools">
              <button className="ops-btn sm ghost" title="Move up" onClick={() => update((d) => move(d.categories, ci, -1))}><Icon name="chevronUp" size={13} /></button>
              <button className="ops-btn sm ghost" title="Move down" onClick={() => update((d) => move(d.categories, ci, 1))}><Icon name="chevronDown" size={13} /></button>
              <button className="ops-btn sm ghost" title="Edit category" onClick={() => openModal({ type: "category", isNew: false, cat: clone(cat) })}><Icon name="pencil" size={12} /> <span className="btn-label">Edit</span></button>
              <button className="ops-btn sm gold" title="Add item to this category" onClick={() => openModal({ type: "item", catId: cat.id, isNew: true })}><Icon name="plus" size={12} /> <span className="btn-label">Item</span></button>
              <button
                className="ops-btn sm danger"
                onClick={() => {
                  if (confirm(`Delete category "${cat.name}" and all ${cat.items.length} items in it?`)) {
                    update((d) => { d.categories = d.categories.filter((c) => c.id !== cat.id); });
                    setSelectedCat(null);
                  }
                }}
              >
                <Icon name="trash" size={13} />
              </button>
            </div>
          </div>

          <div className="cat-items">
            {cat.items.length === 0 && <div className="op-item"><i style={{ color: "#9b8a6f" }}>No items yet — add one!</i></div>}
            {cat.items.map((item, ii) => (
              <div className={`op-item ${item.inStock ? "" : "oos"}`} key={item.id}>
                <div className="op-item-top">
                  <span className="veg-badge" />
                  <div className="nm">
                    <b>
                      {item.name}
                      {item.note && <span className="tag-chip tag-new">{item.note}</span>}
                      {item.tags.map((t) => (
                        <span key={t} className={`tag-chip tag-${t}`}>
                          <Icon name={TAG_META[t]?.icon || "star"} size={9} /> {TAG_META[t]?.label || t}
                        </span>
                      ))}
                    </b>
                    <small>{item.desc}</small>
                  </div>
                  <span className="pr">₹{item.price}</span>
                </div>
                <div className="op-item-actions">
                  <label className="switch-wrap" title={item.inStock ? "Tap to mark OUT OF STOCK" : "Tap to mark back IN STOCK"}>
                    <span className="switch">
                      <input
                        type="checkbox"
                        checked={item.inStock}
                        onChange={() =>
                          update((d) => {
                            const it = d.categories.find((c) => c.id === cat.id)?.items.find((x) => x.id === item.id);
                            if (it) it.inStock = !it.inStock;
                          })
                        }
                      />
                      <i />
                    </span>
                    <small className={item.inStock ? "st-in" : "st-out"}>{item.inStock ? "IN STOCK" : "OUT OF STOCK"}</small>
                  </label>
                  <div className="op-item-btns">
                    <button className="ops-btn sm ghost" title="Move dish up" onClick={() => update((d) => move(d.categories.find((c) => c.id === cat.id).items, ii, -1))}><Icon name="chevronUp" size={13} /></button>
                    <button className="ops-btn sm ghost" title="Move dish down" onClick={() => update((d) => move(d.categories.find((c) => c.id === cat.id).items, ii, 1))}><Icon name="chevronDown" size={13} /></button>
                    <button className="ops-btn sm ghost" title="Edit this dish" onClick={() => openModal({ type: "item", catId: cat.id, isNew: false, item: clone(item) })}><Icon name="pencil" size={12} /> <span className="btn-label">Edit</span></button>
                    <button
                      className="ops-btn sm danger"
                      onClick={() => {
                        if (confirm(`Delete "${item.name}"?`))
                          update((d) => {
                            const c = d.categories.find((c) => c.id === cat.id);
                            c.items = c.items.filter((x) => x.id !== item.id);
                          });
                      }}
                      title="Delete this dish"
                    >
                      <Icon name="trash" size={13} /> <span className="btn-label">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ---------- Grid view: all categories as boxes ---------- */
  return (
    <>
      <div className="ops-card">
        <h2>Menu Management</h2>
        <p className="sub">Tap a category box below to see and manage its dishes.</p>
        <div className="ops-legend">
          <div className="legend-tile">
            <span className="legend-ic gold"><Icon name="plus" size={16} /></span>
            <b>Add Category</b>
          </div>
          <div className="legend-tile">
            <span className="legend-ic"><Icon name="eye" size={16} /></span>
            <b>Tap a Box to Open</b>
          </div>
          <div className="legend-tile">
            <span className="legend-ic green"><span className="mini-switch on"><i /></span></span>
            <b>In / Out of Stock</b>
          </div>
          <div className="legend-tile">
            <span className="legend-ic"><Icon name="pencil" size={15} /></span>
            <b>Edit</b>
          </div>
          <div className="legend-tile">
            <span className="legend-ic red"><Icon name="trash" size={15} /></span>
            <b>Delete</b>
          </div>
          <div className="legend-tile">
            <span className="legend-ic"><Icon name="chevronUp" size={15} /></span>
            <b>Reorder</b>
          </div>
          <div className="legend-tile">
            <span className="legend-ic gold"><Icon name="disk" size={16} /></span>
            <b>Save &amp; Publish</b>
          </div>
        </div>
        <button className="ops-btn gold lg" onClick={() => openModal({ type: "category", isNew: true })}>
          <Icon name="plus" size={16} /> Add Category
        </button>
      </div>

      <div className="cat-grid">
        {draft.categories.map((c) => {
          const oos = c.items.filter((i) => !i.inStock).length;
          return (
            <button type="button" className="cat-tile" key={c.id} onClick={() => setSelectedCat(c.id)}>
              {oos > 0 && <span className="cat-tile-badge" title={`${oos} out of stock`}>{oos}</span>}
              <span className="cat-tile-ic"><CatIcon cat={c} size={28} /></span>
              <b>{c.name}</b>
              <span className="cat-tile-count">{c.items.length} items</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ============================================================
   ITEM MODAL
   ============================================================ */
function ItemModal({ modal, onClose, onSave }) {
  const [it, setIt] = useState(
    modal.item || { id: "", name: "", price: "", desc: "", note: "", img: "", veg: true, inStock: true, tags: [] }
  );
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  async function handlePhotoPick(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same file be re-picked later if needed
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadErr("Please choose a photo file.");
      return;
    }
    setUploadErr("");
    setUploading(true);
    try {
      const blob = await compressPhoto(file);
      if (Store.mode === "firebase") {
        const name = `${modal.catId || "item"}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
        const url = await Store.uploadPhoto(blob, `dish-photos/${name}`);
        setIt((cur) => ({ ...cur, img: url }));
      } else {
        // Live sync isn't connected — embed the photo directly (works, but
        // shares the menu's storage budget, so it's a fine fallback, not the norm).
        const dataUrl = await blobToDataURL(blob);
        setIt((cur) => ({ ...cur, img: dataUrl }));
      }
    } catch (err) {
      setUploadErr(err?.message || "Couldn't upload that photo — check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  function save() {
    if (!it.name.trim() || !it.price) return alert("Name and price are required.");
    const item = {
      ...it,
      id: it.id || slug(it.name),
      name: it.name.trim(),
      price: Number(it.price),
      tags: it.tags || []
    };
    onSave(modal.catId, item, modal.isNew);
  }

  return (
    <div className="modal-back" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>{modal.isNew ? "Add Item" : `Edit — ${modal.item.name}`}</h3>
        <div className="ops-row">
          <div className="ops-field">
            <label>Item Name *</label>
            <input value={it.name} onChange={(e) => setIt({ ...it, name: e.target.value })} placeholder="e.g. Biscoff Waffle" />
          </div>
          <div className="ops-field">
            <label>Price (₹) *</label>
            <input type="number" min="0" value={it.price} onChange={(e) => setIt({ ...it, price: e.target.value })} placeholder="e.g. 149" />
          </div>
        </div>
        <div className="ops-field">
          <label>Short Description</label>
          <textarea value={it.desc} onChange={(e) => setIt({ ...it, desc: e.target.value })} placeholder="One tasty line about this item…" />
        </div>
        <div className="ops-row">
          <div className="ops-field">
            <label>Note / Size (optional)</label>
            <input value={it.note || ""} onChange={(e) => setIt({ ...it, note: e.target.value })} placeholder="e.g. 500 g" />
          </div>
          <div className="ops-field">
            <label>Availability</label>
            <select value={it.inStock ? "1" : "0"} onChange={(e) => setIt({ ...it, inStock: e.target.value === "1" })}>
              <option value="1">In Stock</option>
              <option value="0">Out of Stock — hidden as "Not Available"</option>
            </select>
          </div>
        </div>
        <div className="ops-field">
          <label>Dish Photo</label>
          <div className="photo-upload">
            {it.img ? (
              <div className="photo-preview">
                <img src={it.img} alt="" />
                <button
                  type="button"
                  className="photo-remove"
                  title="Remove photo"
                  onClick={() => setIt({ ...it, img: "" })}
                >
                  <Icon name="x" size={13} />
                </button>
              </div>
            ) : (
              <div className="photo-placeholder">
                <Icon name="cupcake" size={22} />
                <span>No photo yet</span>
              </div>
            )}
            <label className="ops-btn sm gold photo-pick-btn">
              <Icon name="upload" size={13} /> {uploading ? "Uploading…" : it.img ? "Change Photo" : "Upload Photo"}
              <input type="file" accept="image/*" hidden disabled={uploading} onChange={handlePhotoPick} />
            </label>
          </div>
          {uploadErr && <div className="photo-err">{uploadErr}</div>}
          <small className="photo-hint">Choose from your gallery or take a new one — it's auto-resized to keep the menu fast.</small>
          <details className="photo-url-toggle">
            <summary>Or paste a photo link instead</summary>
            <input
              value={it.img && it.img.startsWith("data:") ? "" : it.img || ""}
              onChange={(e) => setIt({ ...it, img: e.target.value.trim() })}
              placeholder="https://…/my-dish-photo.jpg"
            />
          </details>
        </div>
        <div className="ops-field">
          <label>Tags</label>
          <div className="tag-picker">
            {ALL_TAGS.map((t) => (
              <button
                key={t}
                type="button"
                className={`tag-pick ${it.tags?.includes(t) ? "on" : ""}`}
                onClick={() =>
                  setIt({
                    ...it,
                    tags: it.tags?.includes(t) ? it.tags.filter((x) => x !== t) : [...(it.tags || []), t]
                  })
                }
              >
                <Icon name={TAG_META[t].icon} size={11} /> {TAG_META[t].label}
              </button>
            ))}
          </div>
        </div>
        <div className="modal-foot">
          <button className="ops-btn ghost" onClick={onClose}>Cancel</button>
          <button className="ops-btn gold" onClick={save}>{modal.isNew ? "Add Item" : "Save Item"}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CATEGORY MODAL
   ============================================================ */
function CategoryModal({ modal, onClose, onSave }) {
  const [cat, setCat] = useState(modal.cat || { id: "", name: "", icon: "🍽️", desc: "", addons: [], items: [] });

  function save() {
    if (!cat.name.trim()) return alert("Category name is required.");
    const c = { ...cat, id: cat.id || slug(cat.name), name: cat.name.trim() };
    c.addons = (c.addons || []).filter((a) => a.name.trim());
    onSave(c, modal.isNew);
  }

  return (
    <div className="modal-back" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>{modal.isNew ? "Add Category" : `Edit — ${modal.cat.name}`}</h3>
        <div className="ops-row3">
          <div className="ops-field">
            <label>Category Name *</label>
            <input value={cat.name} onChange={(e) => setCat({ ...cat, name: e.target.value })} placeholder="e.g. Mocktails" />
          </div>
          <div className="ops-field">
            <label>Icon (emoji, for new categories)</label>
            <input value={cat.icon} onChange={(e) => setCat({ ...cat, icon: e.target.value })} placeholder="e.g. 🍹" />
          </div>
        </div>
        <div className="ops-field">
          <label>Short Tagline</label>
          <input value={cat.desc} onChange={(e) => setCat({ ...cat, desc: e.target.value })} placeholder="One line shown under the category name" />
        </div>
        <div className="ops-field">
          <label>Add-ons (shown to customers for this category)</label>
          {(cat.addons || []).map((a, i) => (
            <div className="addon-row" key={i}>
              <input
                value={a.name}
                placeholder="Add-on name"
                onChange={(e) => {
                  const addons = [...cat.addons];
                  addons[i] = { ...a, name: e.target.value };
                  setCat({ ...cat, addons });
                }}
              />
              <input
                className="pr"
                type="number"
                min="0"
                value={a.price}
                placeholder="₹"
                onChange={(e) => {
                  const addons = [...cat.addons];
                  addons[i] = { ...a, price: Number(e.target.value) };
                  setCat({ ...cat, addons });
                }}
              />
              <button className="ops-btn sm danger" onClick={() => setCat({ ...cat, addons: cat.addons.filter((_, j) => j !== i) })}><Icon name="x" size={12} /></button>
            </div>
          ))}
          <button className="ops-btn sm ghost" onClick={() => setCat({ ...cat, addons: [...(cat.addons || []), { name: "", price: 0 }] })}>
            <Icon name="plus" size={12} /> Add-on
          </button>
        </div>
        <div className="modal-foot">
          <button className="ops-btn ghost" onClick={onClose}>Cancel</button>
          <button className="ops-btn gold" onClick={save}>{modal.isNew ? "Add Category" : "Save Category"}</button>
        </div>
      </div>
    </div>
  );
}


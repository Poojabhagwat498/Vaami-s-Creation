import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  .admin-card { animation: fadeUp 0.5s ease both; }
  .admin-card:nth-child(1){animation-delay:0.04s}
  .admin-card:nth-child(2){animation-delay:0.10s}
  .admin-card:nth-child(3){animation-delay:0.16s}
  .admin-card:nth-child(4){animation-delay:0.22s}
  .admin-card:nth-child(5){animation-delay:0.28s}
  .admin-card:nth-child(6){animation-delay:0.34s}
  .admin-card:nth-child(7){animation-delay:0.40s}
  .admin-card:nth-child(8){animation-delay:0.46s}
  .admin-input:focus { outline: none; border-color: #0f0018 !important; box-shadow: 0 0 0 3px rgba(15,0,24,0.10); }
  .admin-edit-btn:hover { background: #EEEDFE !important; color: #1a1060 !important; }
  .admin-delete-btn:hover { background: #FEF2F2 !important; color: #7f1d1d !important; }
  .admin-submit:hover { background: #0f0018 !important; letter-spacing: 0.28em !important; }
  .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(15,0,24,0.14) !important; }
  .product-row:hover { background: #f0ece8 !important; }
`;

const Admin = () => {

  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: null, description: "", category: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://vaami-s-creation.onrender.com/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      const res = await fetch("https://vaami-s-creation.onrender.com/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); fetchStats(); }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file });
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm({ name: "", price: "", image: null, description: "", category: "" });
    setImagePreview(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category || !form.description) {
      return showNotification("All fields are required", "error");
    }

    setLoading(true);

    try {

      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);

      if (form.image) {
        formData.append("image", form.image);
      }

      const url = editingId
        ? `https://vaami-s-creation.onrender.com/api/products/${editingId}`
        : "https://vaami-s-creation.onrender.com/api/products";

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const saved = await res.json();

      if (!res.ok) {
        showNotification(saved.message || "Error saving product", "error");
        return;
      }

      setProducts(editingId
        ? products.map((p) => (p._id === editingId ? saved : p))
        : [saved, ...products]
      );

      showNotification(editingId ? "Product updated successfully" : "Product added successfully");

      resetForm();
      fetchStats();

    } catch (error) {
      console.error(error);
      showNotification("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this product?")) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      await fetch(`https://vaami-s-creation.onrender.com/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      showNotification("Product deleted");
      fetchStats();
    } catch (err) {
      showNotification("Delete failed", "error");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name || "",
      price: p.price || "",
      image: null,
      description: p.description || "",
      category: p.category || "",
    });
    setImagePreview(`https://vaami-s-creation.onrender.com${p.image}`);
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fields = [
    { label: "PRODUCT NAME", name: "name", type: "text", placeholder: "e.g. Golden Heart Earring" },
    { label: "PRICE (₹)", name: "price", type: "number", placeholder: "e.g. 1500" },
    { label: "CATEGORY", name: "category", type: "text", placeholder: "e.g. Earrings" },
    { label: "DESCRIPTION", name: "description", type: "textarea", placeholder: "Describe the product..." },
  ];

  const statItems = [
    { label: "TOTAL USERS", value: stats.users, icon: "◎", path: "/admin/users", accent: "#0f0018" },
    { label: "TOTAL PRODUCTS", value: stats.products, icon: "◈", path: null, accent: "#1a3a6b" },
    { label: "TOTAL ORDERS", value: stats.orders, icon: "◇", path: "/admin/orders", accent: "#0f4a3a" },
  ];

  return (
    <>
      <style>{fonts}</style>
      <div style={s.page}>

        {/* ── Toast ── */}
        {notification && (
          <div style={{
            ...s.toast,
            ...(notification.type === "error" ? s.toastError : s.toastSuccess),
          }}>
            {notification.type === "success" ? "✦  " : "✕  "}
            {notification.message}
          </div>
        )}

        {/* ── Banner ── */}
        <div style={s.banner}>
          <div style={s.bannerInner}>
            <p style={s.bannerEyebrow}>VAAMI'S CREATIONS</p>
            <h1 style={s.bannerTitle}>Admin Dashboard</h1>
            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerGem}>◆</span>
              <div style={s.dividerLine} />
            </div>
            <p style={s.bannerSub}>Manage products, orders and users</p>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={s.body}>

          {/* ── Stat Cards ── */}
          <div style={s.statsRow}>
            {statItems.map((st) => (
              <div
                key={st.label}
                className="stat-card"
                onClick={() => st.path && navigate(st.path)}
                style={{
                  ...s.statCard,
                  cursor: st.path ? "pointer" : "default",
                  borderTop: `4px solid ${st.accent}`,
                }}
              >
                <span style={{ ...s.statIcon, color: st.accent }}>{st.icon}</span>
                <p style={s.statValue}>
                  {statsLoading ? "—" : st.value}
                </p>
                <p style={s.statLabel}>{st.label}</p>
                {st.path && (
                  <p style={{ ...s.statLink, color: st.accent }}>View all →</p>
                )}
              </div>
            ))}
          </div>

          {/* ── Two-column layout ── */}
          <div style={s.mainLayout}>

            {/* ── LEFT: Form ── */}
            <div style={s.formWrap}>
              <div style={s.formHeader}>
                <p style={s.formEyebrow}>
                  {editingId ? "EDITING PRODUCT" : "NEW PRODUCT"}
                </p>
                <h2 style={s.formTitle}>
                  {editingId ? "Update Details" : "Add a Piece"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} style={s.form}>
                {fields.map((field) => (
                  <div key={field.name} style={s.fieldGroup}>
                    <label style={s.fieldLabel}>{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        className="admin-input"
                        placeholder={field.placeholder}
                        style={{ ...s.input, height: "96px", resize: "vertical" }}
                        value={form[field.name] || ""}
                        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                      />
                    ) : (
                      <input
                        className="admin-input"
                        type={field.type}
                        placeholder={field.placeholder}
                        style={s.input}
                        value={form[field.name] || ""}
                        onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                      />
                    )}
                  </div>
                ))}

                {/* Image upload */}
                <div style={s.fieldGroup}>
                  <label style={s.fieldLabel}>PRODUCT IMAGE</label>
                  <label style={s.fileLabel}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    <span style={s.fileText}>
                      ◈ &nbsp;
                      {form.image ? form.image.name : "Choose image file"}
                    </span>
                  </label>
                </div>

                {/* Preview */}
                {imagePreview && (
                  <div style={s.previewWrap}>
                    <img src={imagePreview} alt="Preview" style={s.previewImg} />
                    <p style={s.previewCaption}>Image Preview</p>
                  </div>
                )}

                <button
                  className="admin-submit"
                  type="submit"
                  style={s.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingId ? "UPDATE PRODUCT" : "ADD PRODUCT"}
                </button>

                {editingId && (
                  <button type="button" style={s.cancelBtn} onClick={resetForm}>
                    CANCEL EDIT
                  </button>
                )}
              </form>
            </div>

            {/* ── RIGHT: Product List ── */}
            <div style={s.productsPanel}>
              <div style={s.panelHeader}>
                <p style={s.panelEyebrow}>INVENTORY</p>
                <h2 style={s.panelTitle}>All Products</h2>
                <p style={s.panelCount}>
                  {products.length} piece{products.length !== 1 ? "s" : ""}
                </p>
              </div>

              {products.length === 0 ? (
                <div style={s.emptyState}>
                  <p style={s.emptyIcon}>◈</p>
                  <p style={s.emptyTitle}>No products yet</p>
                  <p style={s.emptySubtitle}>Add your first piece using the form</p>
                </div>
              ) : (
                <div style={s.productList}>
                  {products.map((p, i) => (
                    <div
                      key={p._id}
                      className="admin-card product-row"
                      style={{
                        ...s.productRow,
                        borderBottom: i === products.length - 1
                          ? "none"
                          : "1px solid #e8e2d9",
                      }}
                    >
                      <img
                        src={`https://vaami-s-creation.onrender.com${p.image}`}
                        alt={p.name}
                        style={s.thumb}
                      />

                      <div style={s.productInfo}>
                        <p style={s.productCat}>
                          {p.category?.toUpperCase() || "JEWELLERY"}
                        </p>
                        <p style={s.productName}>{p.name}</p>
                        <p style={s.productPrice}>
                          ₹{p.price ? Number(p.price).toLocaleString() : "0"}
                        </p>
                      </div>

                      <div style={s.rowActions}>
                        <button
                          className="admin-edit-btn"
                          style={s.editBtn}
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-delete-btn"
                          style={s.deleteBtn}
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;

/* ══════════════════════════════════════
   STYLES — maximum font & darkest text
══════════════════════════════════════ */
const s = {

  page: {
    width: "100%",
    background: "#faf8f5",
    minHeight: "100vh",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },

  /* Toast */
  toast: {
    position: "fixed",
    top: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "14px 40px",
    fontFamily: "'Cinzel', serif",
    fontSize: "13px",
    letterSpacing: "0.2em",
    zIndex: 9999,
    animation: "slideDown 0.4s ease",
    whiteSpace: "nowrap",
    fontWeight: 600,
  },
  toastSuccess: {
    background: "#0f0018",
    color: "#ffd6ff",
    border: "1px solid rgba(255,214,255,0.3)",
  },
  toastError: {
    background: "#7f1d1d",
    color: "#fecaca",
    border: "1px solid rgba(254,202,202,0.3)",
  },

  /* Banner */
  banner: {
    background: "#0f0018",
    padding: "72px 40px 64px",
    textAlign: "center",
  },
  bannerInner: { maxWidth: "640px", margin: "0 auto" },
  bannerEyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    letterSpacing: "0.34em",
    color: "rgba(255,214,255,0.65)",
    marginBottom: "16px",
    fontWeight: 600,
  },
  bannerTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "clamp(2.8rem, 6vw, 4.4rem)",
    fontWeight: 400,
    fontStyle: "italic",
    color: "#ffd6ff",
    margin: "0 0 22px",
    lineHeight: 1.1,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    maxWidth: "180px",
    margin: "0 auto 16px",
  },
  dividerLine: { flex: 1, height: "1px", background: "rgba(255,214,255,0.3)" },
  dividerGem: { fontSize: "10px", color: "rgba(255,214,255,0.6)" },
  bannerSub: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "20px",
    fontStyle: "italic",
    color: "rgba(255,214,255,0.7)",
    margin: 0,
    fontWeight: 400,
  },

  /* Body */
  body: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "56px 40px 100px",
  },

  /* Stats */
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    marginBottom: "52px",
  },
  statCard: {
    background: "#fff",
    border: "1px solid #ddd8d2",
    padding: "32px 24px 26px",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  statIcon: {
    fontSize: "26px",
    display: "block",
    marginBottom: "16px",
  },
  statValue: {
    fontFamily: "'Cinzel', serif",
    fontSize: "44px",
    fontWeight: 600,
    color: "#0f0018",
    margin: "0 0 8px",
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.28em",
    color: "#1a1020",
    margin: "0 0 10px",
    fontWeight: 600,
  },
  statLink: {
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.15em",
    margin: 0,
    fontWeight: 600,
  },

  /* Main layout */
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "440px 1fr",
    gap: "40px",
    alignItems: "start",
  },

  /* Form wrap */
  formWrap: {
    background: "#fff",
    border: "1px solid #ddd8d2",
    overflow: "hidden",
    position: "sticky",
    top: "24px",
  },
  formHeader: {
    background: "#0f0018",
    padding: "26px 32px",
    textAlign: "center",
  },
  formEyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.28em",
    color: "rgba(255,214,255,0.65)",
    marginBottom: "7px",
    fontWeight: 600,
  },
  formTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "30px",
    fontWeight: 400,
    fontStyle: "italic",
    color: "#ffd6ff",
    margin: 0,
  },
  form: { padding: "32px" },
  fieldGroup: { marginBottom: "22px" },
  fieldLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    letterSpacing: "0.2em",
    color: "#0f0018",
    display: "block",
    marginBottom: "9px",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "1.5px solid #c8c0bc",
    borderRadius: "0",
    fontSize: "17px",
    fontFamily: "'Cormorant Garamond', serif",
    color: "#0f0018",
    background: "#faf8f5",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontWeight: 400,
  },
  fileLabel: {
    display: "block",
    padding: "14px 16px",
    border: "1.5px dashed #9c8fa0",
    cursor: "pointer",
    background: "#faf8f5",
    transition: "border-color 0.2s",
  },
  fileText: {
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.16em",
    color: "#1a1020",
    fontWeight: 600,
  },
  previewWrap: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    background: "#faf8f5",
    border: "1px solid #ddd8d2",
    marginBottom: "22px",
  },
  previewImg: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "2px",
    border: "1px solid #ddd8d2",
  },
  previewCaption: {
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.2em",
    color: "#1a1020",
    fontWeight: 600,
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    background: "#2e1065",
    color: "#ffd6ff",
    border: "none",
    fontFamily: "'Cinzel', serif",
    fontSize: "13px",
    letterSpacing: "0.2em",
    cursor: "pointer",
    transition: "background 0.3s ease, letter-spacing 0.3s ease",
    marginBottom: "12px",
    borderRadius: "0",
    fontWeight: 600,
  },
  cancelBtn: {
    width: "100%",
    padding: "14px",
    background: "transparent",
    color: "#0f0018",
    border: "1.5px solid #c8c0bc",
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.2em",
    cursor: "pointer",
    borderRadius: "0",
    fontWeight: 600,
  },

  /* Products panel */
  productsPanel: {
    background: "#fff",
    border: "1px solid #ddd8d2",
    overflow: "hidden",
  },
  panelHeader: {
    background: "#0f0018",
    padding: "26px 32px",
  },
  panelEyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.28em",
    color: "rgba(255,214,255,0.65)",
    marginBottom: "6px",
    fontWeight: 600,
  },
  panelTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "30px",
    fontWeight: 400,
    fontStyle: "italic",
    color: "#ffd6ff",
    margin: "0 0 6px",
  },
  panelCount: {
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.2em",
    color: "rgba(255,214,255,0.55)",
    margin: 0,
    fontWeight: 600,
  },
  productList: { display: "flex", flexDirection: "column" },
  productRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "20px 28px",
    transition: "background 0.2s",
    background: "#fff",
  },
  thumb: {
    width: "72px",
    height: "72px",
    objectFit: "cover",
    flexShrink: 0,
    border: "1px solid #ddd8d2",
    borderRadius: "2px",
  },
  productInfo: { flex: 1, minWidth: 0 },
  productCat: {
    fontFamily: "'Cinzel', serif",
    fontSize: "10px",
    letterSpacing: "0.24em",
    color: "#1a1020",
    marginBottom: "5px",
    fontWeight: 600,
  },
  productName: {
    fontSize: "19px",
    fontWeight: 600,
    color: "#0f0018",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: "5px",
    fontFamily: "'Cormorant Garamond', serif",
  },
  productPrice: {
    fontFamily: "'Cinzel', serif",
    fontSize: "15px",
    color: "#0f0018",
    fontWeight: 600,
  },
  rowActions: { display: "flex", gap: "10px", flexShrink: 0 },
  editBtn: {
    padding: "10px 22px",
    background: "transparent",
    border: "1.5px solid #534AB7",
    color: "#1a1060",
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.14em",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    borderRadius: "0",
    fontWeight: 600,
  },
  deleteBtn: {
    padding: "10px 22px",
    background: "transparent",
    border: "1.5px solid #dc2626",
    color: "#7f1d1d",
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.14em",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    borderRadius: "0",
    fontWeight: 600,
  },

  /* Empty state */
  emptyState: {
    textAlign: "center",
    padding: "72px 20px",
  },
  emptyIcon: {
    fontSize: "36px",
    color: "#1a1020",
    marginBottom: "18px",
    fontFamily: "serif",
  },
  emptyTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: "16px",
    letterSpacing: "0.2em",
    color: "#0f0018",
    marginBottom: "10px",
    fontWeight: 600,
  },
  emptySubtitle: {
    fontSize: "18px",
    fontStyle: "italic",
    color: "#1a1020",
    fontWeight: 400,
  },
};
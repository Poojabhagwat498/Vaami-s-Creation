import { useEffect, useState } from "react";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: null,
    description: "",
    category: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm({ ...form, image: file });

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category || !form.description) {
      return showNotification("All fields required", "error");
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));

    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : "http://localhost:5000/api/products";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const savedProduct = await res.json();

    setProducts(
      editingId
        ? products.map(p => (p._id === editingId ? savedProduct : p))
        : [savedProduct, ...products]
    );

    showNotification(editingId ? "Product updated" : "Product added");

    setForm({ name: "", price: "", image: null, description: "", category: "" });
    setImagePreview(null);
    setEditingId(null);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setProducts(products.filter(p => p._id !== id));
    showNotification("Product deleted");
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      image: null,
      description: p.description,
      category: p.category,
    });
    setImagePreview(`http://localhost:5000${p.image}`);
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={styles.container}>
      {notification && (
        <div style={{ ...styles.notification, ...styles[notification.type] }}>
          {notification.message}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.formTitle}>{editingId ? "Edit Product" : "Add Product"}</h3>

        {["Product Name", "Price", "Category", "Description"].map((label, i) => (
          <div key={i}>
            <label style={styles.label}>{label}</label>
            {label === "Description" ? (
              <textarea
                style={styles.input}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            ) : (
              <input
                style={styles.input}
                type={label === "Price" ? "number" : "text"}
                value={
                  label === "Product Name"
                    ? form.name
                    : label === "Price"
                    ? form.price
                    : form.category
                }
                onChange={e =>
                  setForm({
                    ...form,
                    [label === "Product Name"
                      ? "name"
                      : label === "Price"
                      ? "price"
                      : "category"]: e.target.value,
                  })
                }
              />
            )}
          </div>
        ))}

        <label style={styles.label}>Product Image</label>
        <input type="file" onChange={handleImageChange} />

        {imagePreview && <img src={imagePreview} style={styles.preview} />}

        <button style={styles.submitBtn} disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update" : "Add"}
        </button>
      </form>

      <hr style={styles.hr} />

      {/* PRODUCTS */}
      <div style={styles.grid}>
        {products.map(p => (
          <div key={p._id} style={styles.card}>
            <img src={`http://localhost:5000${p.image}`} style={styles.cardImg} />
            <h4 style={styles.cardTitle}>{p.name}</h4>
            <p style={styles.price}>₹{p.price}</p>

            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => handleEdit(p)}>Edit</button>
              <button style={styles.deleteBtn} onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
  },

  /* ===== Notifications ===== */
  notification: {
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontWeight: "500",
  },
  success: {
    background: "#ede9fe",
    color: "#5b21b6",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
  },

  /* ===== Form ===== */
  form: {
    background: "#f5f3ff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(124,58,237,0.15)",
  },
  formTitle: {
    textAlign: "center",
    color: "#6d28d9",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    margin: "14px 0 6px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#4c1d95",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #c4b5fd",
    fontSize: "14px",
    outline: "none",
  },
  preview: {
    width: "120px",
    marginTop: "10px",
    borderRadius: "10px",
    border: "2px solid #c4b5fd",
  },
  submitBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  /* ===== Divider ===== */
  hr: {
    margin: "30px 0",
    border: "none",
    height: "1px",
    background: "#ddd6fe",
  },

  /* ===== Product Grid ===== */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "24px",
    padding: "20px",
  },
  card: {
    background: "#faf7ff",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease",
  },
  cardImg: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "12px",
  },
  cardTitle: {
    margin: "12px 0 4px",
    fontSize: "16px",
    color: "#5b2dbd",
  },
  price: {
    fontWeight: "600",
    marginBottom: "12px",
  },

  /* ===== Buttons ===== */
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  editBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    border: "2px solid #7c3aed",
    background: "transparent",
    color: "#7c3aed",
  },
  deleteBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    border: "2px solid #ef4444",
    background: "transparent",
    color: "#ef4444",
  },
};

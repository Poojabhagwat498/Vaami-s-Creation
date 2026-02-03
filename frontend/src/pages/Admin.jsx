import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  /* ================== STATES ================== */
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });

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

  const navigate = useNavigate();

  /* ================== API CALLS ================== */
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchStats = async () => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    const res = await fetch("http://localhost:5000/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  /* ================== HELPERS ================== */
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

  /* ================== CRUD ================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category || !form.description) {
      return showNotification("All fields required", "error");
    }

    setLoading(true);

    const token = JSON.parse(localStorage.getItem("user"))?.token;
    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));

    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : "http://localhost:5000/api/products";

    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const savedProduct = await res.json();

    setProducts(
      editingId
        ? products.map((p) => (p._id === editingId ? savedProduct : p))
        : [savedProduct, ...products]
    );

    showNotification(editingId ? "Product updated" : "Product added");

    setForm({
      name: "",
      price: "",
      image: null,
      description: "",
      category: "",
    });

    setImagePreview(null);
    setEditingId(null);
    setLoading(false);
    fetchStats();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProducts(products.filter((p) => p._id !== id));
    showNotification("Product deleted");
    fetchStats();
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

  /* ================== UI ================== */
  return (
    <div style={styles.layout}>
      {notification && (
        <div style={{ ...styles.notification, ...styles[notification.type] }}>
          {notification.message}
        </div>
      )}

      <div style={styles.content}>
        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <div
            style={{ ...styles.statCard, cursor: "pointer" }}
            onClick={() => navigate("/admin/users")}
          >
            <h4>Total Users</h4>
            <p>{stats.users}</p>
          </div>
        </div>

        {/* FORM */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={styles.formTitle}>
              {editingId ? "Edit Product" : "Add Product"}
            </h3>

            {["Product Name", "Price", "Category", "Description"].map(
              (label, i) => (
                <div key={i}>
                  <label style={styles.label}>{label}</label>

                  {label === "Description" ? (
                    <textarea
                      style={styles.input}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
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
                      onChange={(e) =>
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
              )
            )}

            <label style={styles.label}>Product Image</label>
            <input type="file" onChange={handleImageChange} />

            {imagePreview && (
              <img src={imagePreview} alt="" style={styles.preview} />
            )}

            <button style={styles.submitBtn} disabled={loading}>
              {loading ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
          </form>
        </div>
      </div>

      <hr style={styles.hr} />

      {/* PRODUCTS */}
      <div style={styles.grid}>
        {products.map((p) => (
          <div key={p._id} style={styles.card}>
            <img
              src={`http://localhost:5000${p.image}`}
              alt=""
              style={styles.cardImg}
            />

            <h4 style={styles.cardTitle}>{p.name}</h4>
            <p style={styles.price}>₹{p.price}</p>

            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => handleEdit(p)}>
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;



/* ================== STYLES ================== */
const styles = {

layout: {
  width: "100%",
  padding: "20px",
  fontFamily: "Segoe UI, sans-serif",
},

  content: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "30px",
  },

  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formContainer: {
  maxWidth: "700px",
  width: "100%",
  margin: "0 auto",
  background: "#ffffff",
  borderRadius: "18px",

  /* 🔥 DARK SHADOW */
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",

  padding: "10px",
},
  statCard: {
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    padding: "20px",
    borderRadius: "14px",
    textAlign: "center",
  },
  userListContainer: {
  marginTop: "40px",
  background: "#ffffff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
},

userTitle: {
  marginBottom: "20px",
  color: "#6d28d9",
},

userRow: {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "12px 0",
  borderBottom: "1px solid #eee",
},
orderContainer: {
  marginTop: "30px",
  background: "#f8fafc",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
},

orderTitle: {
  marginBottom: "15px",
  color: "#4c1d95",
},

orderCard: {
  padding: "15px",
  marginBottom: "12px",
  background: "#ffffff",
  borderRadius: "10px",
  borderLeft: "5px solid #7c3aed",
},

userAvatar: {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  objectFit: "cover",
},

userName: {
  fontWeight: "600",
},

userEmail: {
  fontSize: "14px",
  color: "#666",
},
  form: {
    background: "#f5f3ff",
    padding: "25px",
    borderRadius: "12px",
  },

  formTitle: {
    textAlign: "center",
    color: "#6d28d9",
    marginBottom: "20px",
  },

  label: {
    marginTop: "12px",
    display: "block",
    fontWeight: "600",
     fontSize: "16px",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #c4b5fd",
  },

  preview: {
    width: "120px",
    marginTop: "10px",
    borderRadius: "10px",
  },

  submitBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  hr: {
    margin: "40px 0",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "#faf7ff",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
  },

  cardImg: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "12px",
  },

  cardTitle: {
    marginTop: "10px",
  },

  price: {
    fontWeight: "600",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  editBtn: {
    flex: 1,
    border: "2px solid #7c3aed",
    background: "transparent",
    color: "#7c3aed",
  },

  deleteBtn: {
    flex: 1,
    border: "2px solid #ef4444",
    background: "transparent",
    color: "#ef4444",
  },

  notification: {
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
  },

  success: { background: "#ede9fe" },
  error: { background: "#fee2e2" },
}
import { useBag } from "../context/BagContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Checkout = () => {
  const { bagItems, removeFromBag } = useBag();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  const total = bagItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const deleteAddress = () => {
    setFormData({
      name: "",
      phone: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
    });
  };

 const placeOrder = async () => {

  if (!formData.name || !formData.phone || !formData.area ||
      !formData.city || !formData.state || !formData.pincode) {
    alert("Please fill all address details");
    return;
  }

  try {

    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: bagItems,
        totalPrice: total,
        paymentMethod: "Card",
        deliveryAddress: formData,
      }),
    });

    const data = await res.json();

    console.log("Order response:", data);

    if (!res.ok) {
      throw new Error(data.message);
    }

    alert("Order placed successfully 🎉");

    removeFromBag();
    navigate("/orders");

  } catch (err) {
    console.error(err);
    alert(err.message || "Order failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Checkout</h2>

        {/* ADDRESS FORM */}
        <div style={styles.form}>
          {["name", "phone", "area", "city", "state", "pincode"].map((field) => (
            <input
              key={field}
              type={
                field === "phone"
                  ? "tel"
                  : field === "pincode"
                  ? "number"
                  : "text"
              }
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange}
              style={styles.input}
            />
          ))}

          <button type="button" style={styles.deleteBtn} onClick={deleteAddress}>
            Delete Address
          </button>
        </div>

        {/* ORDER SUMMARY */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>

          {bagItems.map((item) => (
            <p key={item._id} style={styles.summaryText}>
              {item.name} × {item.quantity}
            </p>
          ))}

          <h4 style={styles.total}>Total: ₹{total}</h4>
        </div>

        {/* PAYMENT BUTTON */}
        <button
          onClick={placeOrder}
          disabled={loading}
          style={{
            ...styles.payBtn,
            ...(loading ? styles.payBtnDisabled : {}),
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;

/* ================= STYLES ================= */

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#f6f6fb",
  },

  card: {
    width: "100%",
    maxWidth: "700px",
    background: "#f9f7ff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(128, 90, 213, 0.15)",
  },

  title: {
    textAlign: "center",
    color: "#6b21a8",
    marginBottom: "25px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #c4b5fd",
    fontSize: "15px",
    background: "#fdfcff",
    outline: "none",
  },

  deleteBtn: {
    alignSelf: "flex-end",
    background: "none",
    border: "none",
    color: "#9333ea",
    fontWeight: "600",
    cursor: "pointer",
  },

  summary: {
    marginTop: "30px",
    textAlign: "center",
  },

  summaryTitle: {
    color: "#6b21a8",
    marginBottom: "10px",
  },

  summaryText: {
    color: "#4c1d95",
    margin: "4px 0",
  },

  total: {
    marginTop: "10px",
    color: "#6b21a8",
  },

  payBtn: {
    width: "100%",
    marginTop: "30px",
    padding: "14px",
    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  payBtnDisabled: {
    background: "#c4b5fd",
    cursor: "not-allowed",
  },
};

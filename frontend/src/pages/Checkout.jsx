import { useBag } from "../context/BagContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Checkout = () => {
  const { bagItems, removeFromBag } = useBag();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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
    setFormData({ name: "", phone: "", area: "", city: "", state: "", pincode: "" });
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
      if (!token) { alert("Please login first"); navigate("/login"); return; }
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: bagItems, totalPrice: total, paymentMethod: "Card", deliveryAddress: formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
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

  const fields = [
    { name: "name", label: "Full Name", type: "text", icon: "👤", span: 2 },
    { name: "phone", label: "Phone Number", type: "tel", icon: "📞", span: 2 },
    { name: "area", label: "Area / Street", type: "text", icon: "🏘️", span: 2 },
    { name: "city", label: "City", type: "text", icon: "🏙️", span: 1 },
    { name: "state", label: "State", type: "text", icon: "📍", span: 1 },
    { name: "pincode", label: "Pincode", type: "number", icon: "🔢", span: 2 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .checkout-page {
          min-height: 100vh;
          background: #0d0f1a;
          background-image:
            radial-gradient(ellipse at 20% 10%, rgba(180, 140, 60, 0.07) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 90%, rgba(100, 80, 180, 0.08) 0%, transparent 55%);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 48px 20px 80px;
          font-family: 'DM Sans', sans-serif;
        }

        .checkout-wrapper {
          width: 100%;
          max-width: 760px;
          animation: fadeUp 0.6s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .checkout-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .checkout-eyebrow {
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #b8912a;
          margin-bottom: 10px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
        }

        .checkout-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          font-weight: 600;
          color: #f5f0e8;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .checkout-divider {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #b8912a, transparent);
          margin: 18px auto 0;
        }

        .section-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .section-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(184, 145, 42, 0.4), transparent);
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .section-label-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: #f5f0e8;
          letter-spacing: 0.3px;
        }

        .section-label-icon {
          width: 32px;
          height: 32px;
          background: rgba(184, 145, 42, 0.12);
          border: 1px solid rgba(184, 145, 42, 0.25);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .field-group {
          position: relative;
          grid-column: span 2;
        }

        .field-group.half {
          grid-column: span 1;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #7a7a9a;
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .field-group:focus-within .field-label {
          color: #b8912a;
        }

        .field-input-wrapper {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          pointer-events: none;
          opacity: 0.5;
          transition: opacity 0.2s;
        }

        .field-group:focus-within .field-icon {
          opacity: 1;
        }

        .field-input {
          width: 100%;
          padding: 14px 16px 14px 42px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #f0eaff;
          outline: none;
          transition: all 0.25s ease;
          -moz-appearance: textfield;
        }

        .field-input::-webkit-outer-spin-button,
        .field-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }

        .field-input::placeholder {
          color: #3a3a5a;
        }

        .field-input:focus {
          background: rgba(184, 145, 42, 0.06);
          border-color: rgba(184, 145, 42, 0.45);
          box-shadow: 0 0 0 3px rgba(184, 145, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .field-input:not(:placeholder-shown) {
          border-color: rgba(255,255,255,0.15);
        }

        .delete-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1px solid rgba(255,80,80,0.2);
          border-radius: 8px;
          color: #ff6b6b;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          letter-spacing: 0.5px;
          padding: 7px 14px;
          cursor: pointer;
          margin-top: 8px;
          margin-left: auto;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          background: rgba(255,80,80,0.08);
          border-color: rgba(255,80,80,0.4);
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
        }

        .order-item:hover {
          background: rgba(255,255,255,0.05);
        }

        .order-item-name {
          font-size: 14px;
          color: #c8c0e0;
          font-weight: 400;
        }

        .order-item-qty {
          font-size: 12px;
          color: #7a7a9a;
          background: rgba(255,255,255,0.06);
          padding: 3px 10px;
          border-radius: 20px;
        }

        .order-item-price {
          font-size: 14px;
          color: #b8912a;
          font-weight: 500;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 16px;
          background: rgba(184, 145, 42, 0.07);
          border: 1px solid rgba(184, 145, 42, 0.18);
          border-radius: 12px;
        }

        .total-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          color: #f5f0e8;
          letter-spacing: 0.3px;
        }

        .total-amount {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 700;
          color: #d4a830;
        }

        .pay-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #b8912a 0%, #d4a830 50%, #b8912a 100%);
          background-size: 200% auto;
          border: none;
          border-radius: 14px;
          color: #0d0f1a;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          margin-top: 8px;
          box-shadow: 0 4px 24px rgba(184, 145, 42, 0.25);
        }

        .pay-btn::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transition: left 0.5s ease;
        }

        .pay-btn:hover::after {
          left: 100%;
        }

        .pay-btn:hover:not(:disabled) {
          background-position: right center;
          box-shadow: 0 6px 32px rgba(184, 145, 42, 0.4);
          transform: translateY(-1px);
        }

        .pay-btn:disabled {
          background: #2a2a3a;
          color: #4a4a6a;
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
        }

        .pay-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .secure-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 16px;
          font-size: 11px;
          color: #4a4a6a;
          letter-spacing: 0.5px;
        }

        .secure-dot {
          width: 5px;
          height: 5px;
          background: #3a3a5a;
          border-radius: 50%;
        }
      `}</style>

      <div className="checkout-page">
        <div className="checkout-wrapper">

          {/* HEADER */}
          <div className="checkout-header">
            <p className="checkout-eyebrow">Secure Checkout</p>
            <h1 className="checkout-title">Complete Your Order</h1>
            <div className="checkout-divider" />
          </div>

          {/* DELIVERY ADDRESS */}
          <div className="section-card">
            <div className="section-label">
              <div className="section-label-icon">📦</div>
              <span className="section-label-text">Delivery Address</span>
            </div>

            <div className="form-grid">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={`field-group ${field.span === 1 ? "half" : ""}`}
                >
                  <label className="field-label">{field.label}</label>
                  <div className="field-input-wrapper">
                    <span className="field-icon">{field.icon}</span>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="field-input"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="delete-btn" onClick={deleteAddress} type="button">
              ✕ Clear Address
            </button>
          </div>

          {/* ORDER SUMMARY */}
          <div className="section-card">
            <div className="section-label">
              <div className="section-label-icon">🛍️</div>
              <span className="section-label-text">Order Summary</span>
            </div>

            <div className="order-items">
              {bagItems.map((item) => (
                <div key={item._id} className="order-item">
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-qty">× {item.quantity}</span>
                  <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="total-row">
              <span className="total-label">Total Amount</span>
              <span className="total-amount">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* PAY BUTTON */}
          <button className="pay-btn" onClick={placeOrder} disabled={loading}>
            <div className="pay-btn-inner">
              {loading ? (
                <>
                  <div className="spinner" />
                  Processing Order...
                </>
              ) : (
                <>
                  🔒 Pay ₹{total.toLocaleString()} Now
                </>
              )}
            </div>
          </button>

          <div className="secure-notice">
            <span>256-bit SSL Encrypted</span>
            <span className="secure-dot" />
            <span>Secured Payment</span>
            <span className="secure-dot" />
            <span>Safe Checkout</span>
          </div>

        </div>
      </div>
    </>
  );
};

export default Checkout;
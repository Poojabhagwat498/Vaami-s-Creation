import { useEffect, useState } from "react";

const styles = {
  page: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "15px",
    fontFamily: "Segoe UI, sans-serif",
  },

  title: {
    fontSize: "28px",
    marginBottom: "28px",
    color: "#4c1d95",
    textAlign: "center",
  },

  orderCard: {
    background: "#faf7ff",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  orderInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "35px",
    marginBottom: "16px",
    fontSize: "18px",
  },

  badge: (bg) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "15px",
    fontWeight: "600",
    background: bg,
    color: "#fff",
  }),

  items: {
    borderTop: "1px solid #ddd6fe",
    paddingTop: "16px",
  },

  item: {
    display: "flex",
    gap: "16px",
    marginBottom: "14px",
    alignItems: "center",
  },

  itemImg: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #ddd6fe",
  },

  itemName: {
    fontWeight: "600",
    color: "#5b21b6",
  },

  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: "40px",
  },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/orders/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>My Orders</h2>

      {orders.length === 0 ? (
        <p style={styles.empty}>No orders found</p>
      ) : (
        orders.map(order => (
          <div key={order._id} style={styles.orderCard}>
            {/* Order Info */}
            <div style={styles.orderInfo}>
              <p><b>Order ID:</b> {order._id}</p>
              <p><b>Total:</b> ₹{order.totalAmount}</p>

              <p>
                <b>Payment:</b>{" "}
                <span
                  style={styles.badge(
                    order.paymentStatus === "paid" ? "#16a34a" : "#dc2626"
                  )}
                >
                  {order.paymentStatus}
                </span>
              </p>

              <p>
                <b>Status:</b>{" "}
                <span style={styles.badge("#7c3aed")}>
                  {order.status}
                </span>
              </p>
            </div>

            {/* Items */}
            <div style={styles.items}>
              {order.items.map(item => (
                <div key={item._id} style={styles.item}>
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    style={styles.itemImg}
                  />
                  <div>
                    <p style={styles.itemName}>{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;

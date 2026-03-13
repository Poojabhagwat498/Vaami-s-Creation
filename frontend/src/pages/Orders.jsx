import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("Orders API response:", data);

        // ✅ Ensure orders is always array
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }

      } catch (err) {
        console.error("Fetch orders error:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading orders...</p>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h2 style={{ textAlign: "center" }}>My Orders</h2>

      {orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "#faf7ff",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px",
            }}
          >
            <p><b>Order ID:</b> {order._id}</p>
            <p><b>Total:</b> ₹{order.totalPrice}</p>
            <p><b>Status:</b> {order.status}</p>

            {order.items?.map((item) => (
              <div key={item._id} style={{ display: "flex", gap: "10px" }}>
                <img
                  src={`http://localhost:5000${item.image}`}
                  width="70"
                />
                <div>
                  <p>{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
import { useEffect, useState } from "react";

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {

      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

 const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setOrders(data);

    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={s.page}>

      <div style={s.header}>
        <h1 style={s.title}>Total Orders</h1>
        <p style={s.subtitle}>{orders.length} Orders Placed</p>
      </div>

      {loading ? (
        <p style={s.loading}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={s.empty}>No orders placed yet</p>
      ) : (
        <div style={s.tableWrap}>

          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Order ID</th>
                <th style={s.th}>Customer</th>
                <th style={s.th}>Items</th>
                <th style={s.th}>Total</th>
                <th style={s.th}>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (

                <tr key={order._id} style={s.tr}>

                  <td style={s.td}>
                    {order._id.slice(-6)}
                  </td>

                  <td style={s.td}>
                    {order.user?.name || "User"}
                  </td>

                  <td style={s.td}>
                    {order.items?.length || 0}
                  </td>

                  <td style={s.td}>
                    ₹{order.totalAmount}
                  </td>

                  <td style={s.td}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                </tr>

              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
};

export default AdminOrders;

const s = {

  page: {
    padding: "60px 40px",
    fontFamily: "'Cormorant Garamond', serif",
    background: "#faf8f5",
    minHeight: "100vh"
  },

  header: {
    marginBottom: "40px"
  },

  title: {
    fontSize: "40px",
    fontWeight: 400,
    fontStyle: "italic",
    color: "#0f0018",
    marginBottom: "10px"
  },

  subtitle: {
    fontFamily: "'Cinzel', serif",
    letterSpacing: "0.2em",
    fontSize: "12px",
    color: "#0f0018"
  },

  loading: {
    fontSize: "18px"
  },

  empty: {
    fontSize: "18px",
    fontStyle: "italic"
  },

  tableWrap: {
    background: "#fff",
    border: "1px solid #ddd8d2"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    padding: "16px",
    textAlign: "left",
    borderBottom: "1px solid #ddd8d2",
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    letterSpacing: "0.15em"
  },

  tr: {
    borderBottom: "1px solid #eee"
  },

  td: {
    padding: "16px",
    fontSize: "18px"
  }
};
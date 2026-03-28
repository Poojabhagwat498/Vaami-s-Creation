import { useEffect, useState } from "react";

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

.order-card { animation: fadeUp 0.5s ease both; transition: box-shadow 0.3s ease; }
.order-card:hover { box-shadow: 0 12px 36px rgba(15,0,24,0.10) !important; }

.details-btn:hover { color:#0f0018 !important; letter-spacing:0.2em !important; }

.stat-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
.stat-card:hover { transform: translateY(-3px); box-shadow:0 8px 24px rgba(15,0,24,0.08) !important; }

/* ── Tablet (max 1024px) ── */
@media (max-width: 1024px) {
  .orders-banner  { padding: 60px 28px !important; }
  .orders-body    { padding: 48px 28px !important; }
  .banner-title   { font-size: 48px !important; }
  .stats-row      { gap: 16px !important; margin-bottom: 36px !important; }
  .stat-value     { font-size: 28px !important; }
}

/* ── Mobile (max 768px) ── */
@media (max-width: 768px) {
  .orders-banner  { padding: 48px 20px !important; }
  .banner-title   { font-size: 38px !important; }
  .banner-sub     { font-size: 15px !important; }

  .orders-body    { padding: 36px 16px !important; }

  /* Stats — stack to 1 col */
  .stats-row {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
    margin-bottom: 28px !important;
  }
  .stat-card      { padding: 20px 16px !important; }
  .stat-value     { font-size: 26px !important; }

  /* Order card header — stack vertically */
  .order-header {
    flex-direction: column !important;
    gap: 12px !important;
    padding: 16px !important;
  }
  .order-header-right {
    flex-wrap: wrap !important;
    gap: 10px !important;
  }

  /* Item row */
  .item-row       { padding: 14px 16px !important; gap: 12px !important; }
  .item-img       { width: 64px !important; height: 64px !important; }
  .item-name      { font-size: 15px !important; }
  .item-price     { font-size: 15px !important; }

  /* Footer */
  .order-footer   { padding: 14px 16px !important; }
}

/* ── Small Mobile (max 480px) ── */
@media (max-width: 480px) {
  .orders-banner  { padding: 36px 14px !important; }
  .banner-eyebrow { font-size: 9px !important; letter-spacing: 0.2em !important; }
  .banner-title   { font-size: 30px !important; }
  .banner-sub     { font-size: 13px !important; }

  .orders-body    { padding: 24px 12px !important; }

  .stat-value     { font-size: 22px !important; }
  .stat-label     { font-size: 10px !important; }

  /* Stack item row vertically on very small screens */
  .item-row       { flex-wrap: wrap !important; padding: 12px !important; }
  .item-img       { width: 56px !important; height: 56px !important; }
  .item-info      { min-width: 0 !important; }
  .item-price     { width: 100% !important; text-align: right !important; font-size: 14px !important; }

  .order-total    { font-size: 17px !important; }
  .order-id-val   { font-size: 14px !important; }

  .order-footer {
    flex-direction: column !important;
    gap: 10px !important;
    align-items: flex-start !important;
    padding: 12px !important;
  }
}
`;

const statusConfig = {
  Delivered:  { bg: "#EAF3DE", color: "#3B6D11", label: "Delivered" },
  delivered:  { bg: "#EAF3DE", color: "#3B6D11", label: "Delivered" },
  Shipped:    { bg: "#E6F1FB", color: "#185FA5", label: "Shipped" },
  shipped:    { bg: "#E6F1FB", color: "#185FA5", label: "Shipped" },
  Cancelled:  { bg: "#FCEBEB", color: "#A32D2D", label: "Cancelled" },
  cancelled:  { bg: "#FCEBEB", color: "#A32D2D", label: "Cancelled" },
  Processing: { bg: "#FAEEDA", color: "#854F0B", label: "Processing" },
  processing: { bg: "#FAEEDA", color: "#854F0B", label: "Processing" },
};

const Orders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://vaami-s-creation.onrender.com/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data))         setOrders(data);
        else if (Array.isArray(data.orders)) setOrders(data.orders);
        else                             setOrders([]);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const delivered  = orders.filter(
    o => o.status === "Delivered" || o.status === "delivered"
  ).length;

  /* ── LOADING ── */
  if (loading) {
    return (
      <>
        <style>{fonts}</style>
        <div style={s.page}>
          <div style={s.banner} className="orders-banner">
            <div style={s.bannerInner}>
              <p style={s.eyebrow} className="banner-eyebrow">VAAMI'S CREATIONS</p>
              <h1 style={s.bannerTitle} className="banner-title">My Orders</h1>
            </div>
          </div>
          <div style={s.loadingScreen}>
            <div style={s.spinner} />
            <p style={s.loadingText}>Fetching your orders...</p>
          </div>
        </div>
      </>
    );
  }

  /* ── PAGE ── */
  return (
    <>
      <style>{fonts}</style>

      <div style={s.page}>

        {/* Banner */}
        <div style={s.banner} className="orders-banner">
          <div style={s.bannerInner}>
            <p style={s.eyebrow} className="banner-eyebrow">VAAMI'S CREATIONS</p>
            <h1 style={s.bannerTitle} className="banner-title">My Orders</h1>
            <p style={s.bannerSub} className="banner-sub">Track and manage your purchases</p>
          </div>
        </div>

        {/* Body */}
        <div style={s.body} className="orders-body">

          {/* Stats */}
          <div style={s.statsRow} className="stats-row">
            {[
              { label: "TOTAL ORDERS",  value: orders.length },
              { label: "AMOUNT SPENT",  value: `₹${totalSpent.toLocaleString()}` },
              { label: "DELIVERED",     value: delivered }
            ].map(st => (
              <div key={st.label} className="stat-card" style={s.statCard}>
                <p style={s.statLabel} className="stat-label">{st.label}</p>
                <p style={s.statValue} className="stat-value">{st.value}</p>
              </div>
            ))}
          </div>

          {/* Orders */}
          {orders.length === 0 ? (
            <div style={s.emptyState}>
              <p style={s.emptyTitle}>No orders yet</p>
              <p style={s.emptySubtitle}>Your orders will appear here once placed</p>
            </div>
          ) : (
            <div style={s.ordersList}>
              {orders.map(order => {
                const st = statusConfig[order.status] || {
                  bg: "#F1EFE8", color: "#5F5E5A", label: order.status
                };

                return (
                  <div key={order._id} className="order-card" style={s.orderCard}>

                    {/* Header */}
                    <div style={s.orderHeader} className="order-header">
                      <div>
                        <p style={s.orderId}>
                          Order{" "}
                          <span style={s.orderIdVal} className="order-id-val">
                            #{order._id?.slice(-8).toUpperCase()}
                          </span>
                        </p>
                        <p style={s.orderDate}>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN")
                            : "—"}
                        </p>
                      </div>

                      <div style={s.orderHeaderRight} className="order-header-right">
                        <span style={{ ...s.statusBadge, background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                        <span style={s.orderTotal} className="order-total">
                          ₹{order.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      {order.items?.map((item) => (
                        <div key={item._id} style={s.itemRow} className="item-row">
                          <img
                            src={`https://vaami-s-creation.onrender.com${item.image}`}
                            alt={item.name}
                            style={s.itemImg}
                            className="item-img"
                          />
                          <div style={s.itemInfo} className="item-info">
                            <p style={s.itemCategory}>{item.category || "JEWELLERY"}</p>
                            <p style={s.itemName} className="item-name">{item.name}</p>
                            <p style={s.itemQty}>Qty: {item.quantity}</p>
                          </div>
                          <p style={s.itemPrice} className="item-price">
                            ₹{item.price?.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={s.orderFooter} className="order-footer">
                      <p style={s.orderStatus}>
                        {order.status === "Delivered" ? "◈ Order completed" : "◈ In progress"}
                      </p>
                      <button className="details-btn" style={s.detailsBtn}>
                        View Details →
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Orders;

/* ─────────────────────────────────────────
   Base styles (desktop-first)
───────────────────────────────────────── */
const s = {
  page: {
    width: "100%",
    background: "#faf8f5",
    minHeight: "100vh",
    fontFamily: "'Cormorant Garamond', Georgia, serif"
  },

  banner: {
    background: "#0f0018",
    padding: "80px 40px",
    textAlign: "center"
  },

  bannerInner: {
    maxWidth: "600px",
    margin: "0 auto"
  },

  eyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    letterSpacing: "0.35em",
    color: "rgba(255,214,255,0.4)",
    marginBottom: "14px"
  },

  bannerTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "60px",
    fontStyle: "italic",
    fontWeight: 300,
    color: "#ffd6ff",
    marginBottom: "16px"
  },

  bannerSub: {
    fontSize: "18px",
    fontStyle: "italic",
    color: "rgba(255,214,255,0.4)"
  },

  body: {
    maxWidth: "950px",
    margin: "0 auto",
    padding: "60px 40px"
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "22px",
    marginBottom: "48px"
  },

  statCard: {
    background: "#fff",
    border: "1px solid #e8e2d9",
    borderTop: "3px solid #2e1065",
    padding: "30px 20px",
    textAlign: "center"
  },

  statLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    letterSpacing: "0.28em",
    color: "#9c8fa0",
    marginBottom: "10px"
  },

  statValue: {
    fontFamily: "'Cinzel', serif",
    fontSize: "36px",
    fontWeight: 600,
    color: "#0f0018"
  },

  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "26px"
  },

  orderCard: {
    background: "#fff",
    border: "1px solid #e8e2d9"
  },

  orderHeader: {
    padding: "22px 24px",
    background: "#faf8f5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  orderId: {
    fontSize: "18px",
    marginBottom: "4px"
  },

  orderIdVal: {
    fontFamily: "'Cinzel', serif",
    fontSize: "17px",
    fontWeight: 600
  },

  orderDate: {
    fontSize: "14px",
    color: "#9c8fa0"
  },

  orderHeaderRight: {
    display: "flex",
    gap: "16px",
    alignItems: "center"
  },

  statusBadge: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    padding: "6px 14px",
    borderRadius: "2px"
  },

  orderTotal: {
    fontFamily: "'Cinzel', serif",
    fontSize: "22px",
    fontWeight: 600,
    color: "#0f0018"
  },

  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "20px 24px",
    borderBottom: "1px solid #f0ece6"
  },

  itemImg: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    flexShrink: 0,
    borderRadius: "2px"
  },

  itemInfo: { flex: 1 },

  itemCategory: {
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.22em",
    color: "#9c8fa0",
    marginBottom: "4px"
  },

  itemName: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "4px"
  },

  itemQty: {
    fontSize: "14px",
    color: "#9c8fa0"
  },

  itemPrice: {
    fontFamily: "'Cinzel', serif",
    fontSize: "18px",
    fontWeight: 600,
    color: "#0f0018",
    flexShrink: 0
  },

  orderFooter: {
    padding: "18px 24px",
    background: "#faf8f5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  orderStatus: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    color: "#4a3050"
  },

  detailsBtn: {
    fontFamily: "'Cinzel', serif",
    fontSize: "13px",
    letterSpacing: "0.14em",
    color: "#2e1065",
    background: "none",
    border: "none",
    cursor: "pointer",
    transition: "color 0.25s ease, letter-spacing 0.25s ease"
  },

  loadingScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: "80px"
  },

  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #eee",
    borderTop: "3px solid #2e1065",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  loadingText: {
    fontFamily: "'Cinzel', serif",
    fontSize: "14px",
    letterSpacing: "0.18em",
    color: "#9c8fa0"
  },

  emptyState: {
    textAlign: "center",
    padding: "80px 20px"
  },

  emptyTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
    fontStyle: "italic",
    color: "#0f0018",
    marginBottom: "10px"
  },

  emptySubtitle: {
    fontSize: "16px",
    color: "#9c8fa0"
  }
};

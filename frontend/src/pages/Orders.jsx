import { useEffect, useState } from "react";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .order-card { animation: fadeUp 0.5s ease both; transition: box-shadow 0.3s ease; }
  .order-card:nth-child(1){animation-delay:0.05s}
  .order-card:nth-child(2){animation-delay:0.12s}
  .order-card:nth-child(3){animation-delay:0.19s}
  .order-card:nth-child(4){animation-delay:0.26s}
  .order-card:nth-child(5){animation-delay:0.33s}
  .order-card:hover { box-shadow: 0 12px 36px rgba(15,0,24,0.10) !important; }
  .details-btn:hover { color: #0f0018 !important; letter-spacing: 0.2em !important; }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(15,0,24,0.08) !important; }
`;

const statusConfig = {
  Delivered:  { bg: "#EAF3DE", color: "#3B6D11", label: "Delivered"  },
  delivered:  { bg: "#EAF3DE", color: "#3B6D11", label: "Delivered"  },
  Shipped:    { bg: "#E6F1FB", color: "#185FA5", label: "Shipped"    },
  shipped:    { bg: "#E6F1FB", color: "#185FA5", label: "Shipped"    },
  Cancelled:  { bg: "#FCEBEB", color: "#A32D2D", label: "Cancelled"  },
  cancelled:  { bg: "#FCEBEB", color: "#A32D2D", label: "Cancelled"  },
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
        const res  = await fetch("http://localhost:5000/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data))          setOrders(data);
        else if (Array.isArray(data.orders)) setOrders(data.orders);
        else setOrders([]);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const delivered  = orders.filter(
    (o) => o.status === "Delivered" || o.status === "delivered"
  ).length;

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{fonts}</style>
        <div style={s.page}>
          <div style={s.banner}>
            <div style={s.bannerInner}>
              <p style={s.eyebrow}>VAAMI'S CREATIONS</p>
              <h1 style={s.bannerTitle}>My Orders</h1>
              <div style={s.divider}>
                <div style={s.dividerLine} />
                <span style={s.dividerGem}>◆</span>
                <div style={s.dividerLine} />
              </div>
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

  return (
    <>
      <style>{fonts}</style>

      <div style={s.page}>

        {/* ── Banner ── */}
        <div style={s.banner}>
          <div style={s.bannerInner}>
            <p style={s.eyebrow}>VAAMI'S CREATIONS</p>
            <h1 style={s.bannerTitle}>My Orders</h1>
            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerGem}>◆</span>
              <div style={s.dividerLine} />
            </div>
            <p style={s.bannerSub}>Track and manage your purchases</p>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={s.body}>

          {/* ── Stat Cards ── */}
          <div style={s.statsRow}>
            {[
              { label: "TOTAL ORDERS",  value: orders.length               },
              { label: "AMOUNT SPENT",  value: `₹${totalSpent.toLocaleString()}` },
              { label: "DELIVERED",     value: delivered                   },
            ].map((st) => (
              <div key={st.label} className="stat-card" style={s.statCard}>
                <p style={s.statLabel}>{st.label}</p>
                <p style={s.statValue}>{st.value}</p>
              </div>
            ))}
          </div>

          {/* ── Section label ── */}
          <div style={s.sectionHeader}>
            <div style={s.sectionLine} />
            <p style={s.sectionLabel}>ORDER HISTORY</p>
            <div style={s.sectionLine} />
          </div>

          {/* ── Empty ── */}
          {orders.length === 0 ? (
            <div style={s.emptyState}>
              <div style={s.emptyIconWrap}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                  stroke="#c4b5c8" strokeWidth="1.2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p style={s.emptyTitle}>No orders yet</p>
              <p style={s.emptySubtitle}>Your orders will appear here once placed</p>
            </div>
          ) : (

            /* ── Orders list ── */
            <div style={s.ordersList}>
              {orders.map((order) => {
                const st = statusConfig[order.status] || {
                  bg: "#F1EFE8", color: "#5F5E5A", label: order.status
                };

                return (
                  <div key={order._id} className="order-card" style={s.orderCard}>

                    {/* Order header */}
                    <div style={s.orderHeader}>
                      <div style={s.orderHeaderLeft}>
                        <p style={s.orderId}>
                          Order&nbsp;
                          <span style={s.orderIdVal}>
                            #{order._id?.slice(-8).toUpperCase()}
                          </span>
                        </p>
                        <p style={s.orderDate}>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })
                            : "—"}
                        </p>
                      </div>

                      <div style={s.orderHeaderRight}>
                        <span style={{
                          ...s.statusBadge,
                          background: st.bg,
                          color: st.color,
                        }}>
                          {st.label}
                        </span>
                        <span style={s.orderTotal}>
                          ₹{order.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={s.itemsList}>
                      {order.items?.map((item, i) => (
                        <div
                          key={item._id}
                          style={{
                            ...s.itemRow,
                            borderBottom: i === (order.items.length - 1)
                              ? "none"
                              : "1px solid #f5f1ee",
                          }}
                        >
                          <img
                            src={`http://localhost:5000${item.image}`}
                            alt={item.name}
                            style={s.itemImg}
                          />
                          <div style={s.itemInfo}>
                            <p style={s.itemCategory}>
                              {item.category?.toUpperCase() || "JEWELLERY"}
                            </p>
                            <p style={s.itemName}>{item.name}</p>
                            <p style={s.itemQty}>Qty: {item.quantity}</p>
                          </div>
                          <p style={s.itemPrice}>
                            ₹{item.price?.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order footer */}
                    <div style={s.orderFooter}>
                      <p style={s.orderStatus}>
                        {order.status === "Delivered" || order.status === "delivered"
                          ? "◈ Order completed"
                          : "◈ In progress"}
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

/* ══════════════════════════════════════
   STYLES
══════════════════════════════════════ */
const s = {

  page: {
    width: "100%",
    background: "#faf8f5",
    minHeight: "100vh",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },

  /* Banner */
  banner: {
    background: "#0f0018",
    padding: "68px 40px 60px",
    textAlign: "center",
  },
  bannerInner: { maxWidth: "500px", margin: "0 auto" },
  eyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.32em",
    color: "rgba(255,214,255,0.4)",
    marginBottom: "14px",
  },
  bannerTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#ffd6ff",
    margin: "0 0 20px",
    lineHeight: 1.1,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    maxWidth: "140px",
    margin: "0 auto 14px",
  },
  dividerLine: { flex: 1, height: "1px", background: "rgba(255,214,255,0.2)" },
  dividerGem:  { fontSize: "8px", color: "rgba(255,214,255,0.4)" },
  bannerSub: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "15px",
    fontStyle: "italic",
    color: "rgba(255,214,255,0.4)",
    margin: 0,
  },

  /* Loading */
  loadingScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
    gap: "20px",
  },
  spinner: {
    width: "34px",
    height: "34px",
    border: "2px solid #e8e2d9",
    borderTop: "2px solid #2e1065",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  loadingText: {
    fontFamily: "'Cinzel', serif",
    fontSize: "10px",
    letterSpacing: "0.28em",
    color: "#9c8fa0",
  },

  /* Body */
  body: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "52px 40px 100px",
  },

  /* Stats */
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "48px",
  },
  statCard: {
    background: "#fff",
    border: "1px solid #e8e2d9",
    borderTop: "3px solid #2e1065",
    padding: "24px 20px",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  statLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "7px",
    letterSpacing: "0.28em",
    color: "#9c8fa0",
    marginBottom: "10px",
  },
  statValue: {
    fontFamily: "'Cinzel', serif",
    fontSize: "28px",
    fontWeight: 600,
    color: "#0f0018",
    margin: 0,
    lineHeight: 1,
  },

  /* Section header */
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
  },
  sectionLine: { flex: 1, height: "1px", background: "#e8e2d9" },
  sectionLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.28em",
    color: "#9c8fa0",
    flexShrink: 0,
    margin: 0,
  },

  /* Empty */
  emptyState: {
    textAlign: "center",
    padding: "72px 20px",
    background: "#fff",
    border: "1px solid #e8e2d9",
  },
  emptyIconWrap: { marginBottom: "18px" },
  emptyTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: "13px",
    letterSpacing: "0.18em",
    color: "#1a1020",
    marginBottom: "8px",
  },
  emptySubtitle: {
    fontSize: "15px",
    fontStyle: "italic",
    color: "#9c8fa0",
  },

  /* Orders list */
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  /* Order card */
  orderCard: {
    background: "#fff",
    border: "1px solid #e8e2d9",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(15,0,24,0.04)",
  },

  /* Order header */
  orderHeader: {
    padding: "18px 24px",
    background: "#faf8f5",
    borderBottom: "1px solid #f0ece8",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  },
  orderHeaderLeft: {},
  orderId: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "14px",
    color: "#6b5a75",
    margin: 0,
  },
  orderIdVal: {
    fontFamily: "'Cinzel', serif",
    fontSize: "13px",
    fontWeight: 600,
    color: "#0f0018",
  },
  orderDate: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.18em",
    color: "#9c8fa0",
    marginTop: "5px",
  },
  orderHeaderRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  statusBadge: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.16em",
    padding: "5px 14px",
    borderRadius: "0",
    fontWeight: 600,
  },
  orderTotal: {
    fontFamily: "'Cinzel', serif",
    fontSize: "17px",
    fontWeight: 600,
    color: "#0f0018",
  },

  /* Items */
  itemsList: {
    padding: "4px 0",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "18px 24px",
  },
  itemImg: {
    width: "68px",
    height: "68px",
    minWidth: "68px",
    objectFit: "cover",
    border: "1px solid #e8e2d9",
    borderRadius: "2px",
    background: "#f9f7f4",
  },
  itemInfo: { flex: 1, minWidth: 0 },
  itemCategory: {
    fontFamily: "'Cinzel', serif",
    fontSize: "7px",
    letterSpacing: "0.22em",
    color: "#9c8fa0",
    marginBottom: "3px",
  },
  itemName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#0f0018",
    margin: "0 0 4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  itemQty: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.14em",
    color: "#9c8fa0",
    margin: 0,
  },
  itemPrice: {
    fontFamily: "'Cinzel', serif",
    fontSize: "14px",
    fontWeight: 600,
    color: "#2e1065",
    whiteSpace: "nowrap",
    margin: 0,
  },

  /* Order footer */
  orderFooter: {
    padding: "14px 24px",
    background: "#faf8f5",
    borderTop: "1px solid #f0ece8",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderStatus: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.16em",
    color: "#9c8fa0",
    margin: 0,
  },
  detailsBtn: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.14em",
    color: "#2e1065",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "color 0.2s, letter-spacing 0.25s",
    fontWeight: 600,
  },
};
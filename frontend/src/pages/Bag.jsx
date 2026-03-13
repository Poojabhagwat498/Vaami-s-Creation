import { useBag } from "../context/BagContext";
import { useNavigate } from "react-router-dom";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .bag-item { animation: fadeUp 0.5s ease both; }
  .bag-item:nth-child(1){animation-delay:0.05s}
  .bag-item:nth-child(2){animation-delay:0.12s}
  .bag-item:nth-child(3){animation-delay:0.19s}
  .bag-item:nth-child(4){animation-delay:0.26s}
  .bag-item:nth-child(5){animation-delay:0.33s}
  .qty-btn:hover { background: #1a1020 !important; }
  .remove-btn:hover { background: #FEF2F2 !important; color: #dc2626 !important; border-color: #dc2626 !important; }
  .checkout-btn:hover { background: #1a1020 !important; letter-spacing: 0.26em !important; }
  .bag-card:hover { box-shadow: 0 8px 32px rgba(15,0,24,0.10) !important; transform: translateY(-2px); }
`;

const Bag = () => {
  const { bagItems, addToBag, decreaseQty, removeFromBag } = useBag();
  const navigate = useNavigate();

  const total    = bagItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <style>{fonts}</style>

      <div style={s.page}>

        {/* ── Banner ── */}
        <div style={s.banner}>
          <div style={s.bannerInner}>
            <p style={s.eyebrow}>VAAMI'S CREATIONS</p>
            <h1 style={s.bannerTitle}>My Bag</h1>
            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerGem}>◆</span>
              <div style={s.dividerLine} />
            </div>
            {bagItems.length > 0 && (
              <p style={s.bannerCount}>
                {itemCount} item{itemCount !== 1 ? "s" : ""} in your bag
              </p>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={s.body}>

          {/* Empty state */}
          {bagItems.length === 0 ? (
            <div style={s.emptyState}>
              <div style={s.emptyIconWrap}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                  stroke="#c4b5c8" strokeWidth="1.2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p style={s.emptyTitle}>Your bag is empty</p>
              <p style={s.emptySubtitle}>Discover our handcrafted collection</p>
              <button style={s.shopBtn} onClick={() => navigate("/menu")}>
                SHOP COLLECTION
              </button>
            </div>
          ) : (
            <div style={s.layout}>

              {/* ── Left: Items ── */}
              <div style={s.itemsCol}>
                <div style={s.itemsHeader}>
                  <p style={s.itemsLabel}>ITEMS</p>
                  <div style={s.itemsHeaderLine} />
                </div>

                <div style={s.itemsList}>
                  {bagItems.map((item, i) => (
                    <div
                      key={item._id}
                      className="bag-item bag-card"
                      style={{
                        ...s.card,
                        borderBottom: i === bagItems.length - 1
                          ? "none"
                          : "1px solid #f0ece8",
                      }}
                    >
                      {/* Image */}
                      <div style={s.imgWrap}
                        onClick={() => navigate(`/product/${item._id}`)}>
                        <img
                          src={`http://localhost:5000${item.image}`}
                          alt={item.name}
                          style={s.img}
                        />
                      </div>

                      {/* Info */}
                      <div style={s.cardBody}>
                        <div style={s.cardTop}>
                          <div style={s.cardMeta}>
                            <p style={s.cardCategory}>
                              {item.category?.toUpperCase() || "JEWELLERY"}
                            </p>
                            <p style={s.cardName}>{item.name}</p>
                            <p style={s.cardPrice}>
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                            {item.quantity > 1 && (
                              <p style={s.cardUnitPrice}>
                                ₹{item.price.toLocaleString()} each
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Qty + Remove */}
                        <div style={s.cardFooter}>
                          <div style={s.qtyRow}>
                            <button
                              className="qty-btn"
                              style={s.qtyBtn}
                              onClick={() => decreaseQty(item._id)}
                            >
                              −
                            </button>
                            <span style={s.qtyNum}>{item.quantity}</span>
                            <button
                              className="qty-btn"
                              style={s.qtyBtn}
                              onClick={() => addToBag(item)}
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="remove-btn"
                            style={s.removeBtn}
                            onClick={() => removeFromBag(item._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: Summary ── */}
              <div style={s.summaryCol}>
                <div style={s.summaryCard}>

                  <div style={s.summaryHeader}>
                    <p style={s.summaryEyebrow}>ORDER</p>
                    <h2 style={s.summaryTitle}>Summary</h2>
                  </div>

                  <div style={s.summaryBody}>

                    {/* Line items */}
                    {bagItems.map((item) => (
                      <div key={item._id} style={s.summaryRow}>
                        <span style={s.summaryItemName}>
                          {item.name}
                          {item.quantity > 1 && (
                            <span style={s.summaryQty}> ×{item.quantity}</span>
                          )}
                        </span>
                        <span style={s.summaryItemPrice}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}

                    <div style={s.summaryDivider} />

                    {/* Shipping */}
                    <div style={s.summaryRow}>
                      <span style={s.summaryLabel}>Shipping</span>
                      <span style={{ ...s.summaryItemPrice, color: "#3B6D11" }}>
                        Free
                      </span>
                    </div>

                    <div style={s.summaryDivider} />

                    {/* Total */}
                    <div style={{ ...s.summaryRow, marginTop: "4px" }}>
                      <span style={s.totalLabel}>Total</span>
                      <span style={s.totalAmount}>
                        ₹{total.toLocaleString()}
                      </span>
                    </div>

                  </div>

                  {/* CTA */}
                  <button
                    className="checkout-btn"
                    style={s.checkoutBtn}
                    onClick={() => navigate("/checkout")}
                  >
                    PROCEED TO CHECKOUT
                  </button>

                  <button
                    style={s.continueBtn}
                    onClick={() => navigate("/menu")}
                  >
                    CONTINUE SHOPPING
                  </button>

                  {/* Trust */}
                  <div style={s.trustRow}>
                    {["Free Shipping", "Secure Payment", "Easy Returns"].map((t) => (
                      <span key={t} style={s.trustItem}>
                        <span style={s.trustGem}>◈</span> {t}
                      </span>
                    ))}
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Bag;

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
  dividerGem: { fontSize: "8px", color: "rgba(255,214,255,0.4)" },
  bannerCount: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.22em",
    color: "rgba(255,214,255,0.35)",
    margin: 0,
  },

  /* Body */
  body: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "56px 40px 100px",
  },

  /* Empty */
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#fff",
    border: "1px solid #e8e2d9",
  },
  emptyIconWrap: { marginBottom: "20px" },
  emptyTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: "14px",
    letterSpacing: "0.18em",
    color: "#1a1020",
    marginBottom: "8px",
  },
  emptySubtitle: {
    fontSize: "15px",
    fontStyle: "italic",
    color: "#9c8fa0",
    marginBottom: "28px",
  },
  shopBtn: {
    padding: "13px 36px",
    background: "#0f0018",
    color: "#ffd6ff",
    border: "none",
    fontFamily: "'Cinzel', serif",
    fontSize: "10px",
    letterSpacing: "0.2em",
    cursor: "pointer",
    transition: "background 0.3s",
  },

  /* Layout */
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: "40px",
    alignItems: "start",
  },

  /* Items column */
  itemsCol: {},
  itemsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  itemsLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.28em",
    color: "#6b5a75",
    flexShrink: 0,
    margin: 0,
  },
  itemsHeaderLine: {
    flex: 1,
    height: "1px",
    background: "#e8e2d9",
  },
  itemsList: {
    background: "#fff",
    border: "1px solid #e8e2d9",
  },

  /* Card */
  card: {
    display: "flex",
    gap: "20px",
    padding: "24px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "default",
  },
  imgWrap: {
    width: "110px",
    height: "110px",
    flexShrink: 0,
    overflow: "hidden",
    border: "1px solid #e8e2d9",
    cursor: "pointer",
    borderRadius: "2px",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  cardBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minWidth: 0,
  },
  cardTop: {},
  cardMeta: {},
  cardCategory: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.22em",
    color: "#9c8fa0",
    marginBottom: "4px",
  },
  cardName: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#0f0018",
    marginBottom: "6px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardPrice: {
    fontFamily: "'Cinzel', serif",
    fontSize: "16px",
    fontWeight: 600,
    color: "#2e1065",
    marginBottom: "2px",
  },
  cardUnitPrice: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.1em",
    color: "#9c8fa0",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "14px",
  },
  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: "0",
    border: "1px solid #ddd8d2",
  },
  qtyBtn: {
    width: "34px",
    height: "34px",
    background: "#0f0018",
    color: "#ffd6ff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Cinzel', serif",
    transition: "background 0.2s",
    flexShrink: 0,
  },
  qtyNum: {
    fontFamily: "'Cinzel', serif",
    fontSize: "13px",
    fontWeight: 600,
    color: "#0f0018",
    minWidth: "36px",
    textAlign: "center",
  },
  removeBtn: {
    padding: "8px 18px",
    background: "transparent",
    border: "1px solid #ddd8d2",
    color: "#6b5a75",
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.16em",
    cursor: "pointer",
    transition: "all 0.2s",
    borderRadius: "0",
  },

  /* Summary */
  summaryCol: {},
  summaryCard: {
    background: "#fff",
    border: "1px solid #e8e2d9",
    overflow: "hidden",
    position: "sticky",
    top: "100px",
  },
  summaryHeader: {
    background: "#0f0018",
    padding: "20px 24px",
    textAlign: "center",
  },
  summaryEyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.28em",
    color: "rgba(255,214,255,0.4)",
    marginBottom: "4px",
  },
  summaryTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "22px",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#ffd6ff",
    margin: 0,
  },
  summaryBody: { padding: "24px" },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "12px",
    gap: "12px",
  },
  summaryItemName: {
    fontSize: "14px",
    color: "#1a1020",
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  summaryQty: {
    fontFamily: "'Cinzel', serif",
    fontSize: "10px",
    color: "#9c8fa0",
  },
  summaryItemPrice: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    color: "#1a1020",
    fontWeight: 500,
    flexShrink: 0,
  },
  summaryLabel: {
    fontSize: "14px",
    color: "#6b5a75",
    fontStyle: "italic",
  },
  summaryDivider: {
    height: "1px",
    background: "#f0ece8",
    margin: "12px 0",
  },
  totalLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.18em",
    color: "#0f0018",
    fontWeight: 600,
  },
  totalAmount: {
    fontFamily: "'Cinzel', serif",
    fontSize: "20px",
    fontWeight: 600,
    color: "#0f0018",
  },
  checkoutBtn: {
    display: "block",
    width: "100%",
    padding: "14px",
    background: "#0f0018",
    color: "#ffd6ff",
    border: "none",
    fontFamily: "'Cinzel', serif",
    fontSize: "10px",
    letterSpacing: "0.2em",
    cursor: "pointer",
    transition: "background 0.3s, letter-spacing 0.3s",
    margin: "0 0 10px",
    textAlign: "center",
  },
  continueBtn: {
    display: "block",
    width: "100%",
    padding: "12px",
    background: "transparent",
    color: "#6b5a75",
    border: "1px solid #ddd8d2",
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.18em",
    cursor: "pointer",
    margin: "0 0 20px",
    textAlign: "center",
  },
  trustRow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "16px 24px",
    borderTop: "1px solid #f0ece8",
    background: "#faf8f5",
  },
  trustItem: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.16em",
    color: "#9c8fa0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  trustGem: { color: "#c4b5c8", fontSize: "10px" },
};
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
  .bag-card { transition: box-shadow 0.3s ease, transform 0.3s ease; }
  .bag-card:hover { box-shadow: 0 8px 32px rgba(15,0,24,0.10) !important; transform: translateY(-2px); }

  /* ── Tablet (max 1024px) ── */
  @media (max-width: 1024px) {
    .bag-banner  { padding: 60px 28px !important; }
    .bag-body    { padding: 48px 28px !important; }
    .bag-layout  { grid-template-columns: 1fr 320px !important; gap: 32px !important; }
    .bag-card-el { padding: 22px !important; gap: 18px !important; }
    .bag-img-wrap{ width: 110px !important; height: 110px !important; }
    .bag-title   { font-size: 44px !important; }
  }

  /* ── Mobile (max 768px) ── */
  @media (max-width: 768px) {
    .bag-banner  { padding: 48px 20px !important; }
    .bag-title   { font-size: 36px !important; }
    .bag-body    { padding: 32px 16px !important; }

    /* Stack items + summary into single column */
    .bag-layout {
      grid-template-columns: 1fr !important;
      gap: 24px !important;
    }

    /* Move summary card above checkout on mobile — handled by order */
    .bag-summary-card { order: -1 !important; }

    .bag-card-el { padding: 18px 14px !important; gap: 14px !important; }
    .bag-img-wrap{ width: 90px !important; height: 90px !important; }

    .bag-card-name     { font-size: 18px !important; }
    .bag-card-price    { font-size: 17px !important; }
    .bag-card-category { font-size: 10px !important; }

    .bag-card-footer {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 12px !important;
      margin-top: 14px !important;
    }

    .bag-summary-inner { padding: 22px 18px !important; }
    .bag-summary-title { font-size: 24px !important; margin-bottom: 16px !important; }
    .bag-summary-item-name  { font-size: 15px !important; }
    .bag-summary-item-price { font-size: 14px !important; }
    .bag-total-amount  { font-size: 20px !important; }
  }

  /* ── Small Mobile (max 480px) ── */
  @media (max-width: 480px) {
    .bag-banner  { padding: 36px 14px !important; }
    .bag-title   { font-size: 28px !important; }
    .bag-eyebrow { font-size: 9px !important; letter-spacing: 0.18em !important; }
    .bag-count   { font-size: 11px !important; }

    .bag-body    { padding: 20px 12px !important; }

    .bag-card-el  { padding: 14px 10px !important; gap: 10px !important; }
    .bag-img-wrap { width: 72px !important; height: 72px !important; }

    .bag-card-name  { font-size: 16px !important; }
    .bag-card-price { font-size: 15px !important; }

    .qty-btn-el { width: 34px !important; height: 34px !important; font-size: 16px !important; }
    .qty-num-el { font-size: 15px !important; padding: 0 12px !important; }

    .remove-btn-el { font-size: 11px !important; padding: 8px 16px !important; }

    .bag-summary-inner  { padding: 18px 14px !important; }
    .bag-summary-title  { font-size: 22px !important; }
    .bag-total-amount   { font-size: 18px !important; }

    .bag-empty-state { padding: 48px 16px !important; }
    .bag-empty-title { font-size: 18px !important; }
    .bag-empty-sub   { font-size: 15px !important; }
    .bag-shop-btn    { padding: 14px 28px !important; font-size: 12px !important; }
  }
`;

const Bag = () => {
  const { bagItems, addToBag, decreaseQty, removeFromBag } = useBag();
  const navigate = useNavigate();

  const total     = bagItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <style>{fonts}</style>

      <div style={s.page}>

        {/* ── Banner ── */}
        <div style={s.banner} className="bag-banner">
          <div style={s.bannerInner}>
            <p style={s.eyebrow} className="bag-eyebrow">VAAMI'S CREATIONS</p>
            <h1 style={s.bannerTitle} className="bag-title">My Bag</h1>

            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerGem}>◆</span>
              <div style={s.dividerLine} />
            </div>

            {bagItems.length > 0 && (
              <p style={s.bannerCount} className="bag-count">
                {itemCount} item{itemCount !== 1 ? "s" : ""} in your bag
              </p>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={s.body} className="bag-body">

          {bagItems.length === 0 ? (

            <div style={s.emptyState} className="bag-empty-state">
              <p style={s.emptyTitle} className="bag-empty-title">Your bag is empty</p>
              <p style={s.emptySubtitle} className="bag-empty-sub">Discover our handcrafted collection</p>
              <button style={s.shopBtn} className="bag-shop-btn" onClick={() => navigate("/menu")}>
                SHOP COLLECTION
              </button>
            </div>

          ) : (

            <div style={s.layout} className="bag-layout">

              {/* ── LEFT: Items ── */}
              <div>
                {bagItems.map((item) => (
                  <div key={item._id} className="bag-item bag-card bag-card-el" style={s.card}>

                    <div style={s.imgWrap} className="bag-img-wrap">
                      <img
                        src={`https://vaami-s-creation.onrender.com${item.image}`}
                        alt={item.name}
                        style={s.img}
                      />
                    </div>

                    <div style={s.cardBody}>
                      <p style={s.cardCategory} className="bag-card-category">
                        {item.category?.toUpperCase() || "JEWELLERY"}
                      </p>

                      <p style={s.cardName} className="bag-card-name">{item.name}</p>

                      <p style={s.cardPrice} className="bag-card-price">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>

                      <div style={s.cardFooter} className="bag-card-footer">

                        <div style={s.qtyRow}>
                          <button
                            className="qty-btn qty-btn-el"
                            style={s.qtyBtn}
                            onClick={() => decreaseQty(item._id)}
                          >
                            −
                          </button>
                          <span style={s.qtyNum} className="qty-num-el">{item.quantity}</span>
                          <button
                            className="qty-btn qty-btn-el"
                            style={s.qtyBtn}
                            onClick={() => addToBag(item)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-btn remove-btn-el"
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

              {/* ── RIGHT: Summary ── */}
              <div style={s.summaryCard} className="bag-summary-card bag-summary-inner">

                <h2 style={s.summaryTitle} className="bag-summary-title">Order Summary</h2>

                {bagItems.map((item) => (
                  <div key={item._id} style={s.summaryRow}>
                    <span style={s.summaryItemName} className="bag-summary-item-name">
                      {item.name} ×{item.quantity}
                    </span>
                    <span style={s.summaryItemPrice} className="bag-summary-item-price">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

                <div style={s.summaryDivider} />

                <div style={s.summaryRow}>
                  <span style={s.totalLabel}>Total</span>
                  <span style={s.totalAmount} className="bag-total-amount">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <button
                  className="checkout-btn"
                  style={s.checkoutBtn}
                  onClick={() => navigate("/checkout")}
                >
                  PROCEED TO CHECKOUT
                </button>

              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Bag;

/* ─────────────────────────────────────────
   Base styles (desktop-first)
───────────────────────────────────────── */
const s = {
  page: {
    width: "100%",
    background: "#faf8f5",
    minHeight: "100vh",
    fontFamily: "'Cormorant Garamond', serif"
  },

  banner: {
    background: "#0f0018",
    padding: "80px 40px",
    textAlign: "center"
  },

  bannerInner: { maxWidth: "600px", margin: "0 auto" },

  eyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    letterSpacing: "0.32em",
    color: "rgba(255,214,255,0.4)",
    marginBottom: "12px"
  },

  bannerTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "56px",
    fontStyle: "italic",
    fontWeight: 300,
    color: "#ffd6ff",
    marginBottom: "18px"
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    maxWidth: "180px",
    margin: "0 auto 14px"
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,214,255,0.2)"
  },

  dividerGem: {
    fontSize: "8px",
    color: "rgba(255,214,255,0.4)"
  },

  bannerCount: {
    fontFamily: "'Cinzel', serif",
    fontSize: "14px",
    letterSpacing: "0.22em",
    color: "rgba(255,214,255,0.4)"
  },

  body: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "60px 40px"
  },

  emptyState: {
    textAlign: "center",
    padding: "80px 20px"
  },

  emptyTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: "24px",
    color: "#0f0018",
    marginBottom: "10px"
  },

  emptySubtitle: {
    fontSize: "18px",
    fontStyle: "italic",
    color: "#9c8fa0",
    marginBottom: "0"
  },

  shopBtn: {
    marginTop: "30px",
    padding: "16px 40px",
    fontFamily: "'Cinzel', serif",
    fontSize: "14px",
    letterSpacing: "0.18em",
    background: "#0f0018",
    color: "#ffd6ff",
    border: "none",
    cursor: "pointer",
    transition: "background 0.25s ease"
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "50px",
    alignItems: "start"
  },

  card: {
    display: "flex",
    gap: "24px",
    padding: "30px",
    borderBottom: "1px solid #e8e2d9",
    background: "#fff"
  },

  imgWrap: {
    width: "130px",
    height: "130px",
    overflow: "hidden",
    flexShrink: 0,
    borderRadius: "2px"
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  cardBody: { flex: 1, minWidth: 0 },

  cardCategory: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    letterSpacing: "0.2em",
    color: "#9c8fa0",
    marginBottom: "6px"
  },

  cardName: {
    fontSize: "22px",
    fontWeight: "600",
    margin: "0 0 6px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },

  cardPrice: {
    fontFamily: "'Cinzel', serif",
    fontSize: "20px",
    color: "#2e1065"
  },

  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
    flexWrap: "wrap",
    gap: "10px"
  },

  qtyRow: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd8d2"
  },

  qtyBtn: {
    width: "40px",
    height: "40px",
    background: "#0f0018",
    color: "#ffd6ff",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    transition: "background 0.2s ease",
    flexShrink: 0
  },

  qtyNum: {
    fontSize: "18px",
    padding: "0 16px",
    fontFamily: "'Cinzel', serif"
  },

  removeBtn: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    letterSpacing: "0.14em",
    padding: "10px 22px",
    border: "1px solid #ddd8d2",
    background: "transparent",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s, border-color 0.2s"
  },

  summaryCard: {
    background: "#fff",
    padding: "30px",
    border: "1px solid #e8e2d9",
    position: "sticky",
    top: "24px"
  },

  summaryTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "30px",
    fontStyle: "italic",
    fontWeight: 400,
    marginBottom: "20px",
    color: "#0f0018"
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    gap: "8px"
  },

  summaryItemName: {
    fontSize: "18px",
    color: "#1a1020",
    flex: 1,
    minWidth: 0
  },

  summaryItemPrice: {
    fontSize: "16px",
    color: "#0f0018",
    flexShrink: 0,
    fontFamily: "'Cinzel', serif"
  },

  summaryDivider: {
    height: "1px",
    background: "#e8e2d9",
    margin: "14px 0"
  },

  totalLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "16px",
    fontWeight: 600,
    color: "#0f0018"
  },

  totalAmount: {
    fontFamily: "'Cinzel', serif",
    fontSize: "24px",
    fontWeight: "600",
    color: "#0f0018"
  },

  checkoutBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "16px",
    fontFamily: "'Cinzel', serif",
    fontSize: "14px",
    letterSpacing: "0.20em",
    background: "#0f0018",
    color: "#ffd6ff",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s ease, letter-spacing 0.3s ease"
  }
};

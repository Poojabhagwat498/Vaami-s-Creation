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

  const total = bagItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <style>{fonts}</style>

      <div style={s.page}>

        {/* Banner */}
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

        <div style={s.body}>

          {bagItems.length === 0 ? (

            <div style={s.emptyState}>
              <p style={s.emptyTitle}>Your bag is empty</p>
              <p style={s.emptySubtitle}>Discover our handcrafted collection</p>

              <button style={s.shopBtn} onClick={() => navigate("/menu")}>
                SHOP COLLECTION
              </button>
            </div>

          ) : (

            <div style={s.layout}>

              {/* LEFT ITEMS */}
              <div>

                {bagItems.map((item, i) => (
                  <div key={item._id} className="bag-item bag-card" style={s.card}>

                    <div style={s.imgWrap}>
                      <img
                        src={`https://vaami-s-creation.onrender.com${item.image}`}
                        alt={item.name}
                        style={s.img}
                      />
                    </div>

                    <div style={s.cardBody}>

                      <p style={s.cardCategory}>
                        {item.category?.toUpperCase() || "JEWELLERY"}
                      </p>

                      <p style={s.cardName}>{item.name}</p>

                      <p style={s.cardPrice}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>

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

              {/* SUMMARY */}
              <div style={s.summaryCard}>

                <h2 style={s.summaryTitle}>Order Summary</h2>

                {bagItems.map((item) => (
                  <div key={item._id} style={s.summaryRow}>
                    <span style={s.summaryItemName}>
                      {item.name} ×{item.quantity}
                    </span>
                    <span style={s.summaryItemPrice}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}

                <div style={s.summaryDivider} />

                <div style={s.summaryRow}>
                  <span style={s.totalLabel}>Total</span>
                  <span style={s.totalAmount}>
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


/* STYLES */
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
    color: "rgba(255,214,255,0.4)"
  },

  bannerTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "56px",
    fontStyle: "italic",
    color: "#ffd6ff"
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
    padding: "80px"
  },

  emptyTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: "24px"
  },

  emptySubtitle: {
    fontSize: "18px",
    fontStyle: "italic"
  },

  shopBtn: {
    marginTop: "30px",
    padding: "16px 40px",
    fontFamily: "'Cinzel', serif",
    fontSize: "14px",
    background: "#0f0018",
    color: "#ffd6ff",
    border: "none",
    cursor: "pointer"
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "50px"
  },

  card: {
    display: "flex",
    gap: "24px",
    padding: "30px",
    borderBottom: "1px solid #eee"
  },

  imgWrap: {
    width: "130px",
    height: "130px",
    overflow: "hidden"
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  cardBody: { flex: 1 },

  cardCategory: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    letterSpacing: "0.2em"
  },

  cardName: {
    fontSize: "22px",
    fontWeight: "600",
    margin: "6px 0"
  },

  cardPrice: {
    fontFamily: "'Cinzel', serif",
    fontSize: "20px",
    color: "#2e1065"
  },

  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px"
  },

  qtyRow: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd"
  },

  qtyBtn: {
    width: "40px",
    height: "40px",
    background: "#0f0018",
    color: "#ffd6ff",
    border: "none",
    fontSize: "20px",
    cursor: "pointer"
  },

  qtyNum: {
    fontSize: "18px",
    padding: "0 16px"
  },

  removeBtn: {
    fontFamily: "'Cinzel', serif",
    fontSize: "12px",
    padding: "10px 22px",
    border: "1px solid #ddd",
    background: "transparent",
    cursor: "pointer"
  },

  summaryCard: {
    background: "#fff",
    padding: "30px",
    border: "1px solid #e8e2d9"
  },

  summaryTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "30px",
    marginBottom: "20px"
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px"
  },

  summaryItemName: { fontSize: "18px" },
  summaryItemPrice: { fontSize: "16px" },

  summaryDivider: {
    height: "1px",
    background: "#eee",
    margin: "14px 0"
  },

  totalLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "16px"
  },

  totalAmount: {
    fontFamily: "'Cinzel', serif",
    fontSize: "24px",
    fontWeight: "600"
  },

  checkoutBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "16px",
    fontFamily: "'Cinzel', serif",
    fontSize: "14px",
    background: "#0f0018",
    color: "#ffd6ff",
    border: "none",
    cursor: "pointer"
  }

};
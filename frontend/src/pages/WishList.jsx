import { useWishlist } from "../context/WishListContext.jsx";
import { useBag } from "../context/BagContext";
import { useNavigate } from "react-router-dom";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .wish-card { animation: fadeUp 0.5s ease both; transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .wish-card:nth-child(1){animation-delay:0.05s}
  .wish-card:nth-child(2){animation-delay:0.12s}
  .wish-card:nth-child(3){animation-delay:0.19s}
  .wish-card:nth-child(4){animation-delay:0.26s}
  .wish-card:nth-child(5){animation-delay:0.33s}
  .wish-card:nth-child(6){animation-delay:0.40s}
  .wish-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(15,0,24,0.12) !important; }
  .wish-card:hover .wish-img { transform: scale(1.05); }
  .move-btn:hover { background: #1a1020 !important; letter-spacing: 0.22em !important; }
  .remove-btn:hover { background: #FEF2F2 !important; color: #dc2626 !important; border-color: #dc2626 !important; }
`;

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToBag, bagItems }           = useBag();
  const navigate                         = useNavigate();

  const isInBag = (id) => bagItems.some((b) => b._id === id);

  /* ── Empty state ── */
  if (wishlist.length === 0) {
    return (
      <>
        <style>{fonts}</style>
        <div style={s.page}>
          <div style={s.banner}>
            <div style={s.bannerInner}>
              <p style={s.eyebrow}>VAAMI'S CREATIONS</p>
              <h1 style={s.bannerTitle}>My Wishlist</h1>
              <div style={s.divider}>
                <div style={s.dividerLine} />
                <span style={s.dividerGem}>◆</span>
                <div style={s.dividerLine} />
              </div>
            </div>
          </div>
          <div style={s.body}>
            <div style={s.emptyState}>
              <div style={s.emptyIconWrap}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                  stroke="#c4b5c8" strokeWidth="1.2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </div>
              <p style={s.emptyTitle}>Your wishlist is empty</p>
              <p style={s.emptySubtitle}>
                Save pieces you love and find them here
              </p>
              <button style={s.shopBtn} onClick={() => navigate("/menu")}>
                DISCOVER COLLECTION
              </button>
            </div>
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
            <h1 style={s.bannerTitle}>My Wishlist</h1>
            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerGem}>◆</span>
              <div style={s.dividerLine} />
            </div>
            <p style={s.bannerCount}>
              {wishlist.length} saved piece{wishlist.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={s.body}>

          {/* Section header */}
          <div style={s.sectionHeader}>
            <div style={s.sectionLine} />
            <p style={s.sectionLabel}>SAVED PIECES</p>
            <div style={s.sectionLine} />
          </div>

          {/* Grid */}
          <div style={s.grid}>
            {wishlist.map((item) => {
              const inBag = isInBag(item._id);
              const imgSrc = item.image?.startsWith("http")
                ? item.image
                : `http://localhost:5000/${item.image}`;

              return (
                <div key={item._id} className="wish-card" style={s.card}>

                  {/* Image */}
                  <div
                    style={s.imgWrap}
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="wish-img"
                      style={s.img}
                    />

                    {/* Heart badge */}
                    <div style={s.heartBadge}>
                      <svg width="14" height="14" viewBox="0 0 24 24"
                        fill="#dc2626" stroke="#dc2626" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={s.cardBody}>
                    <p style={s.cardCategory}>
                      {item.category?.toUpperCase() || "JEWELLERY"}
                    </p>
                    <p style={s.cardName}>{item.name}</p>

                    <div style={s.cardDivider}>
                      <div style={s.cardDividerLine} />
                      <span style={s.cardGem}>◆</span>
                      <div style={s.cardDividerLine} />
                    </div>

                    <p style={s.cardPrice}>
                      ₹{Number(item.price).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={s.actions}>
                    <button
                      className="move-btn"
                      style={{
                        ...s.moveBtn,
                        background: inBag ? "#1a1020" : "#0f0018",
                      }}
                      onClick={() => {
                        if (!inBag) addToBag(item);
                        removeFromWishlist(item._id);
                      }}
                    >
                      {inBag ? "IN BAG ✔" : "MOVE TO BAG"}
                    </button>

                    <button
                      className="remove-btn"
                      style={s.removeBtn}
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      Remove
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Footer CTA */}
          <div style={s.footerCta}>
            <div style={s.sectionLine} />
            <button
              style={s.continueBtn}
              onClick={() => navigate("/menu")}
            >
              CONTINUE SHOPPING
            </button>
            <div style={s.sectionLine} />
          </div>

        </div>
      </div>
    </>
  );
};

export default Wishlist;

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
  bannerCount: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.22em",
    color: "rgba(255,214,255,0.35)",
    margin: 0,
  },

  /* Body */
  body: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "56px 40px 100px",
  },

  /* Section header */
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "48px",
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

  /* Grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: "32px",
    marginBottom: "60px",
  },

  /* Card */
  card: {
    background: "#fff",
    border: "1px solid #e8e2d9",
    borderRadius: "0",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 12px rgba(15,0,24,0.05)",
  },

  /* Image */
  imgWrap: {
    position: "relative",
    height: "240px",
    overflow: "hidden",
    cursor: "pointer",
    background: "#f9f7f4",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.55s ease",
  },
  heartBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "32px",
    height: "32px",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid #f4c0d1",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Card body */
  cardBody: {
    padding: "18px 20px 4px",
    flex: 1,
  },
  cardCategory: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.24em",
    color: "#9c8fa0",
    marginBottom: "6px",
  },
  cardName: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#0f0018",
    marginBottom: "12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.3,
  },
  cardDivider: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  cardDividerLine: { flex: 1, height: "1px", background: "#ede8e4" },
  cardGem: { fontSize: "7px", color: "#c4b5c8" },
  cardPrice: {
    fontFamily: "'Cinzel', serif",
    fontSize: "16px",
    fontWeight: 600,
    color: "#2e1065",
    marginBottom: "16px",
  },

  /* Actions */
  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    borderTop: "1px solid #ede8e4",
  },
  moveBtn: {
    padding: "13px 10px",
    background: "#0f0018",
    color: "#ffd6ff",
    border: "none",
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.14em",
    cursor: "pointer",
    transition: "background 0.25s, letter-spacing 0.25s",
    borderRight: "1px solid rgba(255,214,255,0.1)",
  },
  removeBtn: {
    padding: "13px 10px",
    background: "transparent",
    color: "#6b5a75",
    border: "none",
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.14em",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  /* Footer CTA */
  footerCta: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  continueBtn: {
    padding: "12px 32px",
    background: "transparent",
    color: "#6b5a75",
    border: "1px solid #ddd8d2",
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.2em",
    cursor: "pointer",
    flexShrink: 0,
    transition: "all 0.25s",
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
  },
};
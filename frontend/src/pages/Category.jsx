import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  .cat-grid > * { animation: fadeUp 0.55s ease both; }
  .cat-grid > *:nth-child(1) { animation-delay: 0.05s; }
  .cat-grid > *:nth-child(2) { animation-delay: 0.12s; }
  .cat-grid > *:nth-child(3) { animation-delay: 0.19s; }
  .cat-grid > *:nth-child(4) { animation-delay: 0.26s; }
  .cat-grid > *:nth-child(5) { animation-delay: 0.33s; }
  .cat-grid > *:nth-child(6) { animation-delay: 0.40s; }
  .cat-grid > *:nth-child(7) { animation-delay: 0.47s; }
  .cat-grid > *:nth-child(8) { animation-delay: 0.54s; }
`;

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://vaami-s-creation.onrender.com/api/products");
        const data = await res.json();
        const filtered = data.filter(
          (p) => p.category?.toLowerCase() === categoryName.toLowerCase()
        );
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{fonts}</style>
        <div style={s.loadingScreen}>
          <div style={s.spinner} />
          <p style={s.loadingText}>Curating your collection...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{fonts}</style>

      <div style={s.page}>

        {/* ── Hero Banner ── */}
        <div style={s.banner}>
          <div style={s.bannerInner}>
            <p style={s.eyebrow}>VAAMI'S CREATIONS</p>
            <h1 style={s.bannerTitle}>{categoryName}</h1>
            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerGem}>◆</span>
              <div style={s.dividerLine} />
            </div>
            <p style={s.bannerSub}>
              {products.length} handcrafted piece{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* ── Products Section ── */}
        <section style={s.section}>

          {products.length === 0 ? (
            <div style={s.emptyState}>
              <p style={s.emptyIcon}>◈</p>
              <p style={s.emptyTitle}>No pieces found</p>
              <p style={s.emptySubtitle}>
                Nothing in <em>{categoryName}</em> yet — check back soon.
              </p>
            </div>
          ) : (
            <div
              className="cat-grid"
              style={s.grid}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

        </section>

      </div>
    </>
  );
};

export default Category;

/* ── Styles ── */
const s = {
  page: {
    width: "100%",
    background: "#faf8f5",
    minHeight: "100vh",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },

  /* Loading */
  loadingScreen: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#faf8f5",
    gap: "20px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
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

  /* Banner */
  banner: {
    background: "#0f0018",
    padding: "80px 40px 72px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  bannerInner: {
    maxWidth: "600px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },
  eyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.32em",
    color: "rgba(255,214,255,0.4)",
    marginBottom: "16px",
  },
  bannerTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#ffd6ff",
    textTransform: "capitalize",
    margin: "0 0 20px",
    lineHeight: 1.1,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    maxWidth: "180px",
    margin: "0 auto 16px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,214,255,0.2)",
  },
  dividerGem: {
    fontSize: "8px",
    color: "rgba(255,214,255,0.4)",
  },
  bannerSub: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.25em",
    color: "rgba(255,214,255,0.35)",
  },

  /* Section */
  section: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "72px 40px 100px",
  },

  /* Grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: "32px",
  },

  /* Empty */
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#fff",
    border: "1px solid #e8e2d9",
    borderRadius: "4px",
  },
  emptyIcon: {
    fontSize: "28px",
    color: "#c4b5c8",
    marginBottom: "16px",
    fontFamily: "serif",
  },
  emptyTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: "13px",
    letterSpacing: "0.18em",
    color: "#4a3050",
    marginBottom: "10px",
  },
  emptySubtitle: {
    fontSize: "15px",
    fontStyle: "italic",
    color: "#9c8fa0",
    lineHeight: 1.7,
  },
};
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import Footer from "../components/Footer";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={s.loadingScreen}>
        <style>{fonts}</style>
        <div style={s.spinner} />
        <p style={s.loadingText}>Curating your collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={s.loadingScreen}>
        <style>{fonts}</style>
        <p style={s.errorText}>Something went wrong: {error}</p>
        <button style={s.retryBtn} onClick={fetchProducts}>Try Again</button>
      </div>
    );
  }

  return (
    <>
      <style>{fonts}{animations}</style>

      <div style={s.page}>

        {/* ── HERO ── */}
        {!searchQuery && <Hero />}

        {/* ── SEARCH RESULTS LABEL ── */}
        {searchQuery && (
          <div style={s.searchHeader}>
            <div style={s.searchHeaderInner}>
              <p style={s.searchEyebrow}>SEARCH RESULTS</p>
              <h2 style={s.searchTitle}>"{searchQuery}"</h2>
              <p style={s.searchCount}>{filteredProducts.length} piece{filteredProducts.length !== 1 ? "s" : ""} found</p>
            </div>
          </div>
        )}

        {/* ── FEATURED SECTION ── */}
        <section style={s.section}>

          {/* Section Header */}
          {!searchQuery && (
            <div style={s.sectionHeader}>
              <p style={s.eyebrow}>OUR COLLECTION</p>
              <h2 style={s.sectionTitle}>Featured Pieces</h2>
              <div style={s.divider}>
                <div style={s.dividerLine} />
                <span style={s.dividerGem}>◆</span>
                <div style={s.dividerLine} />
              </div>
              <p style={s.sectionSubtitle}>
                Every piece is handcrafted with love, designed to celebrate the woman who wears it.
              </p>
            </div>
          )}

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <div style={s.emptyState}>
              <p style={s.emptyIcon}>◈</p>
              <p style={s.emptyTitle}>No pieces found</p>
              <p style={s.emptySubtitle}>Try searching with different keywords</p>
            </div>
          ) : (
            <div style={s.grid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* ── BRAND STRIP ── */}
        {!searchQuery && (
          <div style={s.brandStrip}>
            <div style={s.brandStripInner}>
              {["Free Shipping", "Handcrafted", "Gift Packaging", "Easy Returns"].map((item, i) => (
                <div key={item} style={s.brandItem}>
                  <span style={s.brandGem}>◈</span>
                  <span style={s.brandText}>{item}</span>
                  {i < 3 && <span style={s.brandSep}>·</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <Footer />

      </div>
    </>
  );
};

export default Home;

/* ─── Fonts ─── */
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
`;

const animations = `
  .home-grid > * { animation: fadeUp 0.55s ease both; }
  .home-grid > *:nth-child(1) { animation-delay: 0.05s; }
  .home-grid > *:nth-child(2) { animation-delay: 0.12s; }
  .home-grid > *:nth-child(3) { animation-delay: 0.19s; }
  .home-grid > *:nth-child(4) { animation-delay: 0.26s; }
  .home-grid > *:nth-child(5) { animation-delay: 0.33s; }
  .home-grid > *:nth-child(6) { animation-delay: 0.40s; }
  .home-grid > *:nth-child(7) { animation-delay: 0.47s; }
  .home-grid > *:nth-child(8) { animation-delay: 0.54s; }
`;

/* ─── Styles ─── */
const s = {
  page: {
    width: "100%",
    background: "#faf8f5",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },

  /* Loading */
  loadingScreen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#faf8f5",
    gap: "20px",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "2px solid #e8e2d9",
    borderTop: "2px solid #2e1065",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  loadingText: {
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.28em",
    color: "#9c8fa0",
  },
  errorText: {
    fontSize: "16px",
    color: "#991b1b",
    fontFamily: "'Cinzel', serif",
    letterSpacing: "0.08em",
  },
  retryBtn: {
    padding: "12px 32px",
    background: "#2e1065",
    color: "#ffd6ff",
    border: "none",
    fontFamily: "'Cinzel', serif",
    fontSize: "10px",
    letterSpacing: "0.2em",
    cursor: "pointer",
    borderRadius: "0",
  },

  /* Search header */
  searchHeader: {
    padding: "80px 40px 60px",
    background: "#0f0018",
    textAlign: "center",
  },
  searchHeaderInner: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  searchEyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.3em",
    color: "rgba(255,214,255,0.45)",
    marginBottom: "12px",
  },
  searchTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "42px",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#ffd6ff",
    margin: "0 0 10px",
  },
  searchCount: {
    fontFamily: "'Cinzel', serif",
    fontSize: "10px",
    letterSpacing: "0.2em",
    color: "rgba(255,214,255,0.4)",
  },

  /* Section */
  section: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "80px 40px 100px",
  },

  /* Section header */
  sectionHeader: {
    textAlign: "center",
    marginBottom: "64px",
  },
  eyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.32em",
    color: "#9c8fa0",
    marginBottom: "14px",
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#1a1020",
    margin: "0 0 20px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    maxWidth: "200px",
    margin: "0 auto 20px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#ddd8d2",
  },
  dividerGem: {
    fontSize: "8px",
    color: "#b0a0b8",
  },
  sectionSubtitle: {
    fontSize: "16px",
    fontStyle: "italic",
    color: "#9c8fa0",
    lineHeight: 1.8,
    maxWidth: "480px",
    margin: "0 auto",
  },

  /* Grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: "32px",
  },

  /* Empty state */
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#fff",
    border: "1px solid #e8e2d9",
    borderRadius: "4px",
  },
  emptyIcon: {
    fontSize: "32px",
    color: "#c4b5c8",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: "14px",
    letterSpacing: "0.15em",
    color: "#4a3050",
    marginBottom: "8px",
  },
  emptySubtitle: {
    fontSize: "15px",
    fontStyle: "italic",
    color: "#9c8fa0",
  },

  /* Brand strip */
  brandStrip: {
    background: "#2e1065",
    padding: "22px 40px",
    borderTop: "1px solid rgba(255,214,255,0.08)",
  },
  brandStripInner: {
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "0",
  },
  brandItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  brandGem: {
    fontSize: "10px",
    color: "rgba(255,214,255,0.4)",
  },
  brandText: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.22em",
    color: "rgba(255,214,255,0.65)",
  },
  brandSep: {
    color: "rgba(255,214,255,0.2)",
    margin: "0 16px",
    fontSize: "14px",
  },
};
import { Link } from "react-router-dom";
import { useState } from "react";
import pendant11 from '../images/pendant11.jpeg';
import earring11 from '../images/earring11.jpeg';
import ring11 from '../images/ring11.jpeg';
import bracelet11 from '../images/bracelet11.jpeg';
import watch11 from '../images/watch11.jpg';

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500&display=swap');

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .menu-card { animation: fadeUp 0.6s ease both; }
  .menu-card:nth-child(1) { animation-delay: 0.05s; }
  .menu-card:nth-child(2) { animation-delay: 0.13s; }
  .menu-card:nth-child(3) { animation-delay: 0.21s; }
  .menu-card:nth-child(4) { animation-delay: 0.29s; }
  .menu-card:nth-child(5) { animation-delay: 0.37s; }

  .menu-card img { transition: transform 0.65s ease; }
  .menu-card:hover img { transform: scale(1.07) !important; }

  .menu-card .card-overlay { transition: background 0.4s ease; }
  .menu-card:hover .card-overlay { background: rgba(15,0,24,0.52) !important; }

  .menu-card .card-label { transition: letter-spacing 0.4s ease, color 0.3s ease; }
  .menu-card:hover .card-label { letter-spacing: 0.3em !important; color: #ffd6ff !important; }

  .menu-card .card-arrow { transition: opacity 0.35s ease, transform 0.35s ease; opacity: 0; transform: translateY(6px); }
  .menu-card:hover .card-arrow { opacity: 1 !important; transform: translateY(0) !important; }

  .menu-card .card-gem { transition: opacity 0.3s ease; }
  .menu-card:hover .card-gem { opacity: 1 !important; }

  /* ── Tablet (max 1024px) ── */
  @media (max-width: 1024px) {
    .menu-section {
      padding: 48px 28px 80px !important;
    }
    .row-large {
      grid-template-columns: 1fr 1fr !important;
      gap: 14px !important;
    }
    .row-small {
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 14px !important;
    }
    .card-large {
      height: 320px !important;
    }
    .card-small {
      height: 230px !important;
    }
    .menu-banner {
      padding: 60px 28px 56px !important;
    }
  }

  /* ── Mobile (max 768px) ── */
  @media (max-width: 768px) {
    .menu-banner {
      padding: 48px 20px 44px !important;
    }
    .banner-title {
      font-size: 2.2rem !important;
    }
    .menu-section {
      padding: 36px 16px 64px !important;
      gap: 14px !important;
    }

    /* Stack all cards into a single column */
    .row-large {
      grid-template-columns: 1fr !important;
      gap: 14px !important;
    }
    .row-small {
      grid-template-columns: 1fr 1fr !important;
      gap: 14px !important;
    }

    .card-large {
      height: 260px !important;
    }
    .card-small {
      height: 200px !important;
    }

    .card-label-large {
      font-size: 1.9rem !important;
    }
    .card-label-small {
      font-size: 1.5rem !important;
    }
  }

  /* ── Small Mobile (max 480px) ── */
  @media (max-width: 480px) {
    .menu-banner {
      padding: 36px 16px 34px !important;
    }
    .banner-eyebrow {
      font-size: 8px !important;
      letter-spacing: 0.2em !important;
    }
    .banner-title {
      font-size: 1.8rem !important;
    }
    .banner-sub {
      font-size: 14px !important;
    }
    .menu-section {
      padding: 28px 12px 48px !important;
      gap: 10px !important;
    }

    /* All cards full-width single column */
    .row-large,
    .row-small {
      grid-template-columns: 1fr !important;
      gap: 10px !important;
    }

    .card-large {
      height: 220px !important;
    }
    .card-small {
      height: 190px !important;
    }

    .card-label-large {
      font-size: 1.6rem !important;
    }
    .card-label-small {
      font-size: 1.4rem !important;
    }
    .card-desc {
      font-size: 12px !important;
    }
    .card-content {
      padding: 20px 16px !important;
    }
  }
`;

const categories = [
  { name: "Rings",     image: ring11,     path: "/category/rings",     desc: "Timeless bands & statement pieces" },
  { name: "Bracelets", image: bracelet11, path: "/category/bracelets", desc: "Delicate chains & bold cuffs" },
  { name: "Pendants",  image: pendant11,  path: "/category/pendants",  desc: "Elegant drops & layering pieces" },
  { name: "Earrings",  image: earring11,  path: "/category/earrings",  desc: "Studs, hoops & chandelier styles" },
  { name: "Watches",   image: watch11,    path: "/category/watchs",    desc: "Refined timepieces & accessories" },
];

const Menu = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <style>{fonts}</style>

      <div style={s.page}>

        {/* ── Banner ── */}
        <div style={s.banner} className="menu-banner">
          <div style={s.bannerInner}>
            <p style={s.eyebrow} className="banner-eyebrow">VAAMI'S CREATIONS</p>

            <h1 style={s.bannerTitle} className="banner-title">Our Collections</h1>

            <div style={s.divider}>
              <div style={s.dividerLine} />
              <span style={s.dividerGem}>◆</span>
              <div style={s.dividerLine} />
            </div>

            <p style={s.bannerSub} className="banner-sub">
              Discover handcrafted jewellery made to celebrate you
            </p>
          </div>
        </div>

        {/* ── Grid ── */}
        <section style={s.section} className="menu-section">

          {/* Large feature row — first 2 cards */}
          <div style={s.rowLarge} className="row-large">
            {categories.slice(0, 2).map((cat) => (
              <Link
                to={cat.path}
                key={cat.name}
                className="menu-card card-large"
                style={s.cardLarge}
                onMouseEnter={() => setHovered(cat.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <img src={cat.image} alt={cat.name} style={s.cardImg} />
                <div className="card-overlay" style={s.overlay} />
                <div style={s.cardContent} className="card-content">
                  <span className="card-gem" style={s.cardGem}>◈</span>
                  <p style={s.cardCategory}>COLLECTION</p>
                  <h2
                    className="card-label card-label-large"
                    style={s.cardLabelLarge}
                  >
                    {cat.name}
                  </h2>
                  <p style={s.cardDesc} className="card-desc">{cat.desc}</p>
                  <span className="card-arrow" style={s.cardArrow}>EXPLORE →</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Small row — last 3 cards */}
          <div style={s.rowSmall} className="row-small">
            {categories.slice(2).map((cat) => (
              <Link
                to={cat.path}
                key={cat.name}
                className="menu-card card-small"
                style={s.cardSmall}
                onMouseEnter={() => setHovered(cat.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <img src={cat.image} alt={cat.name} style={s.cardImg} />
                <div className="card-overlay" style={s.overlay} />
                <div style={s.cardContent} className="card-content">
                  <span className="card-gem" style={s.cardGem}>◈</span>
                  <p style={s.cardCategory}>COLLECTION</p>
                  <h2
                    className="card-label card-label-small"
                    style={s.cardLabelSmall}
                  >
                    {cat.name}
                  </h2>
                  <p style={s.cardDesc} className="card-desc">{cat.desc}</p>
                  <span className="card-arrow" style={s.cardArrow}>EXPLORE →</span>
                </div>
              </Link>
            ))}
          </div>

        </section>
      </div>
    </>
  );
};

export default Menu;

/* ─────────────────────────────────────────
   Base styles (desktop-first)
───────────────────────────────────────── */
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
    padding: "80px 40px 72px",
    textAlign: "center",
  },
  bannerInner: {
    maxWidth: "600px",
    margin: "0 auto",
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
    fontSize: "clamp(1.8rem, 6vw, 4rem)",
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
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "16px",
    fontStyle: "italic",
    color: "rgba(255,214,255,0.45)",
    letterSpacing: "0.04em",
  },

  /* Section */
  section: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "64px 40px 100px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  /* Rows */
  rowLarge: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  rowSmall: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },

  /* Cards */
  cardLarge: {
    position: "relative",
    height: "420px",
    overflow: "hidden",
    borderRadius: "4px",
    textDecoration: "none",
    display: "block",
    cursor: "pointer",
  },
  cardSmall: {
    position: "relative",
    height: "300px",
    overflow: "hidden",
    borderRadius: "4px",
    textDecoration: "none",
    display: "block",
    cursor: "pointer",
  },
  cardImg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(15,0,24,0.38)",
    zIndex: 1,
  },
  cardContent: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "32px 24px",
    textAlign: "center",
  },
  cardGem: {
    fontSize: "14px",
    color: "rgba(255,214,255,0.5)",
    marginBottom: "8px",
    opacity: 0,
  },
  cardCategory: {
    fontFamily: "'Cinzel', serif",
    fontSize: "8px",
    letterSpacing: "0.28em",
    color: "rgba(255,214,255,0.55)",
    marginBottom: "8px",
  },
  cardLabelLarge: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "2.4rem",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#fff",
    margin: "0 0 8px",
    letterSpacing: "0.12em",
    lineHeight: 1,
  },
  cardLabelSmall: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.8rem",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#fff",
    margin: "0 0 8px",
    letterSpacing: "0.12em",
    lineHeight: 1,
  },
  cardDesc: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "13px",
    fontStyle: "italic",
    color: "rgba(255,214,255,0.6)",
    marginBottom: "14px",
    letterSpacing: "0.02em",
  },
  cardArrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.22em",
    color: "#ffd6ff",
    opacity: 0,
  },
};

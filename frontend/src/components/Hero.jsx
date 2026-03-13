import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-image.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section style={styles.hero}>
      {/* Background Image */}
      <div style={{ ...styles.bgImage, backgroundImage: `url(${heroImage})` }} />

      {/* Layered overlays for depth */}
      <div style={styles.overlayBottom} />
      <div style={styles.overlayTop} />

      {/* Decorative corner ornament */}
      <div style={styles.cornerTL}>✦</div>
      <div style={styles.cornerTR}>✦</div>
      <div style={styles.cornerBL}>✦</div>
      <div style={styles.cornerBR}>✦</div>

      {/* Thin decorative border frame */}
      <div style={styles.frame} />

      {/* Main Content */}
      <div style={styles.content}>

        {/* Eyebrow tag */}
        <div style={styles.eyebrow}>
          <span style={styles.eyebrowLine} />
          <span style={styles.eyebrowText}>HANDCRAFTED JEWELLERY</span>
          <span style={styles.eyebrowLine} />
        </div>

        {/* Title */}
        <h1 style={styles.title}>
          <span style={styles.titleLine1}>Vaami's</span>
          <span style={styles.titleLine2}>Creation</span>
        </h1>

        {/* Decorative divider */}
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerGem}>◆</span>
          <span style={styles.dividerLine} />
        </div>

        {/* Subtitle */}
        <p style={styles.subtitle}>
          Where elegance meets craftsmanship — each piece<br />
          designed to celebrate the woman who wears it.
        </p>

        {/* Buttons */}
        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/menu")}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "#2e1065";
              e.currentTarget.style.letterSpacing = "0.18em";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.letterSpacing = "0.14em";
            }}
          >
            SHOP COLLECTION
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/wishlist")}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#ffd6ff";
              e.currentTarget.style.letterSpacing = "0.18em";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "rgba(255,255,255,0.65)";
              e.currentTarget.style.letterSpacing = "0.14em";
            }}
          >
            VIEW WISHLIST ✦
          </button>
        </div>

        {/* Trust badges */}
        <div style={styles.badges}>
          {["Free Shipping", "Handcrafted", "Gift Ready"].map((b) => (
            <span key={b} style={styles.badge}>◈ {b}</span>
          ))}
        </div>

      </div>

      {/* Bottom scroll hint */}
      <div style={styles.scrollHint}>
        <span style={styles.scrollText}>SCROLL</span>
        <div style={styles.scrollLine} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50%       { transform: scaleY(0.4); opacity: 0.4; }
        }

        .hero-eyebrow  { animation: fadeUp 0.9s ease both; animation-delay: 0.1s; }
        .hero-title1   { animation: fadeUp 0.9s ease both; animation-delay: 0.3s; }
        .hero-title2   { animation: fadeUp 0.9s ease both; animation-delay: 0.5s; }
        .hero-divider  { animation: fadeIn 1s ease both; animation-delay: 0.7s; }
        .hero-subtitle { animation: fadeUp 0.9s ease both; animation-delay: 0.85s; }
        .hero-actions  { animation: fadeUp 0.9s ease both; animation-delay: 1s; }
        .hero-badges   { animation: fadeUp 0.9s ease both; animation-delay: 1.15s; }
        .scroll-line   { animation: scrollPulse 1.8s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default Hero;

const styles = {
  hero: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    color: "#fff",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },

  bgImage: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    transform: "scale(1.04)",
    zIndex: 0,
  },

  overlayBottom: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(10,0,30,0.92) 0%, rgba(30,5,70,0.72) 45%, rgba(46,16,101,0.45) 100%)",
    zIndex: 1,
  },

  overlayTop: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 40%, rgba(120,60,200,0.18) 0%, transparent 70%)",
    zIndex: 2,
  },

  frame: {
    position: "absolute",
    inset: "20px",
    border: "1px solid rgba(255,214,255,0.18)",
    borderRadius: "2px",
    pointerEvents: "none",
    zIndex: 3,
  },

  cornerTL: { position: "absolute", top: "14px", left: "14px", color: "rgba(255,214,255,0.5)", fontSize: "16px", zIndex: 4 },
  cornerTR: { position: "absolute", top: "14px", right: "14px", color: "rgba(255,214,255,0.5)", fontSize: "16px", zIndex: 4 },
  cornerBL: { position: "absolute", bottom: "14px", left: "14px", color: "rgba(255,214,255,0.5)", fontSize: "16px", zIndex: 4 },
  cornerBR: { position: "absolute", bottom: "14px", right: "14px", color: "rgba(255,214,255,0.5)", fontSize: "16px", zIndex: 4 },

  content: {
    position: "relative",
    zIndex: 5,
    textAlign: "center",
    maxWidth: "680px",
    padding: "0 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0",
  },

  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "28px",
    className: "hero-eyebrow",
  },

  eyebrowLine: {
    display: "inline-block",
    width: "48px",
    height: "1px",
    background: "rgba(255,214,255,0.5)",
  },

  eyebrowText: {
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "0.3em",
    color: "rgba(255,214,255,0.8)",
    fontWeight: 400,
  },

  title: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0",
    margin: "0 0 20px",
    lineHeight: 1,
  },

  titleLine1: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "clamp(3.2rem, 8vw, 6rem)",
    fontWeight: 300,
    fontStyle: "italic",
    color: "#fff",
    letterSpacing: "0.04em",
    display: "block",
    className: "hero-title1",
  },

  titleLine2: {
    fontFamily: "'Cinzel', serif",
    fontSize: "clamp(2.4rem, 6.5vw, 4.8rem)",
    fontWeight: 500,
    color: "#ffd6ff",
    letterSpacing: "0.22em",
    display: "block",
    textTransform: "uppercase",
    className: "hero-title2",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
    className: "hero-divider",
  },

  dividerLine: {
    display: "inline-block",
    width: "60px",
    height: "1px",
    background: "rgba(255,214,255,0.4)",
  },

  dividerGem: {
    color: "#ffd6ff",
    fontSize: "10px",
    opacity: 0.8,
  },

  subtitle: {
    fontSize: "clamp(1rem, 2vw, 1.2rem)",
    fontWeight: 300,
    fontStyle: "italic",
    color: "rgba(240,231,255,0.9)",
    lineHeight: 1.85,
    marginBottom: "40px",
    letterSpacing: "0.01em",
    className: "hero-subtitle",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "40px",
    className: "hero-actions",
  },

  primaryBtn: {
    padding: "14px 38px",
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.7)",
    borderRadius: "0",
    fontSize: "12px",
    fontFamily: "'Cinzel', serif",
    fontWeight: 500,
    letterSpacing: "0.14em",
    cursor: "pointer",
    transition: "all 0.35s ease",
  },

  secondaryBtn: {
    padding: "14px 38px",
    background: "transparent",
    color: "rgba(255,255,255,0.65)",
    border: "none",
    borderRadius: "0",
    fontSize: "12px",
    fontFamily: "'Cinzel', serif",
    fontWeight: 400,
    letterSpacing: "0.14em",
    cursor: "pointer",
    transition: "all 0.35s ease",
    borderBottom: "1px solid rgba(255,214,255,0.35)",
  },

  badges: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    justifyContent: "center",
    className: "hero-badges",
  },

  badge: {
    fontSize: "11px",
    fontFamily: "'Cinzel', serif",
    letterSpacing: "0.15em",
    color: "rgba(255,214,255,0.55)",
    fontWeight: 400,
  },

  scrollHint: {
    position: "absolute",
    bottom: "36px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    zIndex: 5,
  },

  scrollText: {
    fontFamily: "'Cinzel', serif",
    fontSize: "9px",
    letterSpacing: "0.3em",
    color: "rgba(255,214,255,0.4)",
  },

  scrollLine: {
    width: "1px",
    height: "40px",
    background: "rgba(255,214,255,0.4)",
    transformOrigin: "top",
    className: "scroll-line",
  },
};
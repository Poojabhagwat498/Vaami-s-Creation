import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-image.jpg"; // your image path

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section style={{ ...styles.hero, backgroundImage: `url(${heroImage})` }}>
      {/* Overlay for better text contrast */}
      <div style={styles.overlay} />

      <div style={styles.content}>
        <h1 style={styles.title}>
          Vaami’s <span style={styles.highlight}>Creation</span>
        </h1>

        <p style={styles.subtitle}>
          Where elegance meets craftsmanship ✨  
          Discover handcrafted jewellery made to celebrate you.
        </p>

        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/menu")}
          >
            Shop Collection
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/wishlist")}
          >
            View Wishlist ❤️
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

const styles = {
  hero: {
    position: "relative",
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "2rem",
    color: "#fff",  // white text for contrast
  },

  // Semi-transparent overlay on top of background image for readability
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(46, 16, 101, 0.6)", // purple-ish overlay with opacity
    zIndex: 1,
  },

  content: {
    position: "relative", // above overlay
    maxWidth: "700px",
    textAlign: "center",
    zIndex: 2,
  },

  title: {
    fontSize: "3.5rem",
    fontWeight: 800,
    marginBottom: "1rem",
  },

  highlight: {
    color: "#ffd6ff", // lighter highlight for contrast
  },

  subtitle: {
    fontSize: "1.25rem",
    marginBottom: "2.5rem",
    lineHeight: 1.6,
    color: "#f0e7ff", // light text
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },

  primaryBtn: {
    padding: "0.9rem 2rem",
    background:
      "linear-gradient(135deg, #7c3aed, #9333ea)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "0.9rem 2rem",
    background: "transparent",
    color: "#ffd6ff",
    border: "2px solid #ffd6ff",
    borderRadius: "999px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  },
};

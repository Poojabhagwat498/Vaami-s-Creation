import { Link } from "react-router-dom";
import { useState } from "react";
import pendant11 from '../images/pendant11.jpeg';
import earring11 from '../images/earring11.jpeg';
import ring11 from '../images/ring11.jpeg';
import bracelet11 from '../images/bracelet11.jpeg';
import watch11 from '../images/watch11.jpg';

const styles = {
menuPage: {
  padding: "28px",
  textAlign: "center",
  maxWidth: "1000px",
  margin: "40px auto",
  background: "#fff",
  borderRadius: "12px",
},

  title: {
    fontSize: "28px",
    marginBottom: "8px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "24px",
     fontSize: "18px",
  },

  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
   justifyContent: "start",   // ✅ left align grid
  alignItems: "start",
  },

  menuCard: {
    position: "relative",
    borderRadius: "14px",
    overflow: "hidden",
    height: "240px",
    textDecoration: "none",
  },

  menuImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },

  menuOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0, 0, 0, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  overlayTitle: {
    color: "white",
    fontSize: "22px",
    letterSpacing: "1px",
  },
};

const categories = [
  {
    name: "Rings",
    image: ring11,
    path: "/category/rings",
  },
  {
    name: "Bracelets",
    image: bracelet11,
    path: "/category/bracelets",
  },
  {
    name: "Pendants",
    image: pendant11,
    path: "/category/pendants",
  },
  {
    name: "Earrings",
    image: earring11,
    path: "/category/earrings",
  },
  {
    name: "Watchs",
    image: watch11,
    path: "/category/watchs",
  },
];

const Menu = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.menuPage}>
      <h1 style={styles.title}>Menu</h1>
      <p style={styles.subtitle}>Browse categories and collections</p>

      <div style={styles.menuGrid}>
        {categories.map((cat) => (
          <Link
            to={cat.path}
            key={cat.name}
            style={styles.menuCard}
            onMouseEnter={() => setHovered(cat.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <img
              src={cat.image}
              alt={cat.name}
              style={{
                ...styles.menuImage,
                transform:
                  hovered === cat.name ? "scale(1.08)" : "scale(1)",
              }}
            />

            <div style={styles.menuOverlay}>
              <h3 style={styles.overlayTitle}>{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Menu;

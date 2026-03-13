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
  const searchQuery =
    new URLSearchParams(location.search).get("search") || "";


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/products");

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

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
      <div style={styles.pageContainer}>
        <div style={styles.loading}>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* HERO SECTION */}
     
     {!searchQuery && <Hero />}
      {/* PRODUCTS SECTION */}
      <section style={styles.featuredProducts}>
        <h2 style={styles.sectionTitle}>Featured Products</h2>

        {products.length === 0 ? (
          <p style={styles.noProducts}>No products available yet.</p>
        ) : (
          <div style={styles.productsGrid}>
                    {filteredProducts.length === 0 ? (
            <p style={styles.noProducts}>No products found.</p>
          ) : (
            <div style={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Home;

const styles = {
  pageContainer: {
    width: "100%",
    padding: "2rem",
  },

  hero: {
    marginBottom: "3rem",
    textAlign: "center",
  },

  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
  },

  heroText: {
    fontSize: "1.1rem",
    color: "#555",
  },

  featuredProducts: {
    width: "100%",
  },

  sectionTitle: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    textAlign: "left",
  },

  /* 🔑 THIS IS THE IMPORTANT PART */
  productsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",

    justifyContent: "flex-start", // ✅ left aligned
    alignItems: "flex-start",
  },

  loading: {
    textAlign: "center",
    fontSize: "1.5rem",
  },

  error: {
    color: "red",
    textAlign: "center",
  },

  noProducts: {
    textAlign: "left",
    color: "#777",
  },
};

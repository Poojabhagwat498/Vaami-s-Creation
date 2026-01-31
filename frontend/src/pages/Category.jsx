import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const styles = {
  categoryPage: {
    padding: "20px",
    width: "100%",
  },

  categoryTitle: {
    fontSize: "28px",
    textTransform: "capitalize",
    marginBottom: "20px",
  },
  cardWrapper: {
  width: "100%",
  display: "flex",
  justifyContent: "center",
},

  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
    gap: "24px",
  },

  loadingText: {
    padding: "20px",
  },
};

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        const filtered = data.filter(
          (product) =>
            product.category?.toLowerCase() === categoryName.toLowerCase()
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

  if (loading) return <p style={styles.loadingText}>Loading products...</p>;

  return (
    <div style={styles.categoryPage}>
      <h1 style={styles.categoryTitle}>{categoryName}</h1>

      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div style={styles.productGrid}>
          {products.map((product) => (
          <div key={product._id} style={styles.cardWrapper}>
            <ProductCard  product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;

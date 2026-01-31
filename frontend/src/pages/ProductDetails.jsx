import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBag } from "../context/BagContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bagItems, addToBag, removeFromBag } = useBag();

  const [product, setProduct] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(console.error);
  }, [id]);

  if (!product) {
    return <h2 style={{ textAlign: "center", marginTop: 40 }}>Loading...</h2>;
  }

  const isAdded = bagItems.some((item) => item.id === product.id);

  const handleBagToggle = () => {
    if (isAdded) {
      removeFromBag(product.id);
    } else {
      addToBag(product);
      navigate("/bag");
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* IMAGE */}
      <div style={styles.image_container}>
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          style={styles.image}
        />
      </div>

      {/* DETAILS */}
      <div style={styles.details}>
        <h1 style={styles.title}>{product.name}</h1>

        <p style={styles.description}>{product.description}</p>

        <div style={styles.price}>₹{product.price}</div>

        <button
          style={{
            ...styles.cart_button,
            ...(isHovered && !isAdded ? styles.cart_button_hover : {}),
            opacity: isAdded ? 0.6 : 1,
            cursor: isAdded ? "default" : "pointer",
          }}
          onClick={handleBagToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={isAdded}
        >
          {isAdded ? "Added ✔" : "Add to Bag"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

const styles = {
  wrapper: {
    display: "flex",
    gap: "3rem",
    maxWidth: "900px",
    margin: "60px auto",
    padding: "0 20px",
    alignItems: "center",
  },

  image_container: {
    flex: "0 0 45%",
    height: "22rem",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  details: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#111",
  },

  description: {
    fontSize: "1rem",
    color: "#555",
    lineHeight: 1.6,
  },

  price: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#6d28d9",
    marginTop: "0.5rem",
  },

  cart_button: {
    marginTop: "1.5rem",
    padding: "0.9rem",
    width: "220px",
    backgroundImage: "linear-gradient(0deg, #6d28d9 50%, #d9d9d9 125%)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    border: "none",
    borderRadius: "0.5rem",
    transition: "all 0.3s ease",
  },

  cart_button_hover: {
    backgroundColor: "#4c1d95",
  },
};

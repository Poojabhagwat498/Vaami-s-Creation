import { Link, useNavigate } from "react-router-dom";
import { useBag } from "../context/BagContext";
import { useWishlist } from "../context/WishListContext.jsx";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1.5rem",
    width: "25rem",          // ⬅ increased card size
    backgroundColor: "#ffffff", // ⬅ white card
    borderRadius: "1.25rem",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  },

  imageContainer: {
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    width: "100%",
    height: "14rem",        // ⬅ bigger image container
    backgroundColor: "transparent", // ⬅ removed bg color
    borderRadius: "0.75rem",
  },

  image: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100%",       // ⬅ bigger image
    maxHeight: "100%",
    objectFit: "contain",
  },

  title: {
    fontSize: "1.25rem",    // ⬅ larger text
    fontWeight: 600,
    color: "#222",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  price: {
    fontSize: "1.75rem",    // ⬅ larger price
    fontWeight: 700,
    color: "#6d28d9",
  },

  action: {
    display: "flex",
    gap: "1rem",
  },

  viewBtn: {
    width: "100%",
    padding: "0.75rem",
    background: "transparent",
    border: "2px solid #6d28d9",
    color: "#6d28d9",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 500,
  },

  cartButton: {
    width: "100%",
    padding: "0.75rem",
    backgroundImage: "linear-gradient(0deg, #6d28d9 50%, #d9d9d9 125%)",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
  },
};


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { bagItems, addToBag, removeFromBag } = useBag();

  const isAdded = bagItems.some((item) => item._id === product._id);

  const handleBagToggle = () => {
    isAdded ? removeFromBag(product._id) : addToBag(product);
  };

  const { toggleWishlist, isWishlisted } = useWishlist();


  return (
    <div style={styles.card}>
      <button
        onClick={() => toggleWishlist(product)}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          fontSize: "22px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isWishlisted(product._id) ? "❤️" : "🤍"}
      </button>

      {/* Image */}
      <div
        style={styles.imageContainer}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          style={styles.image}
        />
      </div>

      {/* Title */}
      <h3 style={styles.title}>{product.name}</h3>

      {/* Price */}
      <p style={styles.price}>₹{product.price}</p>

      {/* Actions */}
      <div style={styles.action}>
        <Link to={`/product/${product._id}`} style={{ width: "100%" }}>
          <button style={styles.viewBtn}>View</button>
        </Link>

        <button
          onClick={handleBagToggle}
          style={{
            ...styles.cartButton,
            backgroundImage: isAdded
              ? "linear-gradient(0deg, #4c1d95 50%, #d9d9d9 125%)"
              : styles.cartButton.backgroundImage,
          }}
        >
          {isAdded ? "Added ✔" : "Add to Bag"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

import { useBag } from "../context/BagContext";
import { useNavigate } from "react-router-dom";

const styles = {
  bagPage: {
    padding: "30px",
    maxWidth: "1200px",
    margin: "auto",

  },

  bagTitle: {
    color: "#6d28d9",
    marginBottom: "30px",
    textAlign: "center",
    fontSize: "1.4rem",

  },

  emptyBag: {
    textAlign: "center",
    color: "#777",
    fontSize: "1.4rem",
  },

  bagGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
    justifyContent: "center",
  },

  /* 🔥 CARD STYLE (from your product card) */
  card: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1.5rem",
    width: "20rem",
    backgroundColor: "#ffffff",
    borderRadius: "1.25rem",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  },

  imageContainer: {
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    width: "100%",
    height: "14rem",
    borderRadius: "0.75rem",
  },

  image: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  title: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#222",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  price: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#6d28d9",
  },

  qtyControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  qtyBtn: {
    background: "#6d28d9",
    color: "white",
    border: "none",
    padding: "6px 14px",
    fontSize: "18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  qtyText: {
    fontWeight: "bold",
    fontSize: "16px",
    minWidth: "24px",
    textAlign: "center",
  },

  removeBtn: {
    padding: "0.75rem",
    background: "transparent",
    border: "2px solid #6d28d9",
    color: "#6d28d9",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 500,
  },

  bagFooter: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1.4rem",
  },

  buyNowBtn: {
    padding: "0.75rem 2rem",
    backgroundImage: "linear-gradient(0deg, #6d28d9 50%, #d9d9d9 125%)",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1.1rem",
  },
};

const Bag = () => {
  const { bagItems, addToBag, decreaseQty, removeFromBag } = useBag();
  const navigate = useNavigate();

  const total = bagItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={styles.bagPage}>
      <h1 style={styles.bagTitle}>My Bag</h1>

      {bagItems.length === 0 ? (
        <p style={styles.emptyBag}>Your selected products will appear here</p>
      ) : (
        <>
          <div style={styles.bagGrid}>
            {bagItems.map((item) => (
              <div key={item._id} style={styles.card}>
                <div style={styles.imageContainer}>
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    style={styles.image}
                  />
                </div>

                <h4 style={styles.title}>{item.name}</h4>
                <p style={styles.price}>₹{item.price}</p>

                <div style={styles.qtyControls}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => decreaseQty(item._id)}
                  >
                    −
                  </button>

                  <span style={styles.qtyText}>{item.quantity}</span>

                  <button
                    style={styles.qtyBtn}
                    onClick={() => addToBag(item)}
                  >
                    +
                  </button>
                </div>

                <button
                  style={styles.removeBtn}
                  onClick={() => removeFromBag(item._id)}
                >
                  Remove from Bag
                </button>
              </div>
            ))}
          </div>

          <div style={styles.bagFooter}>
            <h2>Total: ₹{total}</h2>
            <button
              style={styles.buyNowBtn}
              onClick={() => navigate("/checkout")}
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Bag;

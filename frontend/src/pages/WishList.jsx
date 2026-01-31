import { useWishlist } from "../context/WishListContext.jsx";
import { useBag } from "../context/BagContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToBag } = useBag();

  if (wishlist.length === 0) {
    return <p style={styles.empty}>❤️ Wishlist is empty</p>;
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>My Wishlist</h2>

      <div style={styles.grid}>
        {wishlist.map((item) => (
          <div key={item._id} style={styles.card}>
            <div style={styles.imageContainer}>
         <img
  src={item.image.startsWith("http")
    ? item.image
    : `http://localhost:5000/${item.image}`}
  alt={item.name}
  style={styles.image}
/>

            </div>

            <h4 style={styles.title}>{item.name}</h4>
            <p style={styles.price}>₹{item.price}</p>

            <div style={styles.action}>
              <button
                style={styles.cartButton}
                onClick={() => {
                  addToBag(item);
                  removeFromWishlist(item._id);
                }}
              >
                Move to Bag
              </button>

              <button
                style={styles.removeBtn}
                onClick={() => removeFromWishlist(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

const styles = {
  page: {
    padding: "2rem",
  },

  heading: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "2rem",
    textAlign: "center",
  },

  empty: {
    textAlign: "center",
    fontSize: "1.25rem",
    marginTop: "4rem",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1.5rem",
    backgroundColor: "#ffffff",
    borderRadius: "1.25rem",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
  },

  imageContainer: {
    position: "relative",
    width: "100%",
    height: "14rem",
    borderRadius: "0.75rem",
    overflow: "hidden",
    cursor: "pointer",
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

  action: {
    display: "flex",
    gap: "1rem",
    marginTop: "auto",
  },

  cartButton: {
    flex: 1,
    padding: "0.75rem",
    backgroundImage: "linear-gradient(0deg, #6d28d9 50%, #d9d9d9 125%)",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 600,
  },

  removeBtn: {
    flex: 1,
    padding: "0.75rem",
    background: "#eee",
    color: "#000",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontWeight: 500,
  },
};

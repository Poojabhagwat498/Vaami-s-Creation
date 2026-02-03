import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useBag } from "../context/BagContext";
import useDebounce from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";

const styles = {
  mainHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 40px",
    borderBottom: "1px solid #ddd",
    background: "#fff",
    
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    fontSize: "28px",
    fontWeight: 600,
    color: "#4b0082",
  },

  logoImage: {
    height: "65px",
    width: "65px",
    objectFit: "cover",
    borderRadius: "50%",
  },

  searchSection: {
    display: "flex",
  },

  searchInput: {
    width: "380px",
    padding: "8px 14px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
    
  },

  navSection: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },

  navLink: {
    textDecoration: "none",
    fontSize: "22px",
    color: "#4b0082",
  },

  bagCount: {
    marginLeft: "6px",
    background: "#6d28d9",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 8px",
    fontSize: "12px",
    fontWeight: "bold",
  },
};

const Layout = () => {
  const { bagItems } = useBag();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
  if (!location.pathname.startsWith("/home")) return;


  if (debouncedQuery.trim()) {
    navigate(`/home?search=${debouncedQuery}`);
  } else {
    navigate("/home"); // 👈 reset when search is empty
  }
}, [debouncedQuery, navigate, location.pathname]);
  return (
    <Fragment>
      <header style={styles.mainHeader}>
        <Link to="/home" style={styles.logoSection}>
          <img src="/logo.jpeg" alt="logo" style={styles.logoImage} />
          <span>Vaami's Creation</span>
        </Link>

        <form
          style={styles.searchSection}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.searchInput}
          />
        </form>

        <nav style={styles.navSection}>
          <Link to="/home" style={styles.navLink}>Home</Link>
          <Link to="/wishlist" style={styles.navLink}>Wishlist</Link>

          <Link to="/menu" style={styles.navLink}>Menu</Link>

          <Link to="/bag" style={styles.navLink}>
            Bag
            {bagItems.length > 0 && (
              <span style={styles.bagCount}>{bagItems.length}</span>
            )}
          </Link>

          <Link to="/orders" style={styles.navLink}>Orders</Link>

          {!user && <Link to="/login" style={styles.navLink}>Login</Link>}

          {user?.role === "admin" && (
            <Link to="/admin" style={styles.navLink}>Admin</Link>
          )}

          <Link to="/me" style={styles.navLink}>Me</Link>
        </nav>
      </header>

      {/* Render child routes */}
      <Outlet />
    </Fragment>
  );
};

export default Layout;

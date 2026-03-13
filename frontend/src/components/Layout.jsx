
import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useBag } from "../context/BagContext";
import useDebounce from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Cinzel:wght@400;500;600;700&display=swap');

.nav-link { transition: color 0.25s ease, letter-spacing 0.25s ease; }
.nav-link:hover { color: #0f0018 !important; letter-spacing: 0.26em !important; }

.nav-link.active {
  color: #0f0018 !important;
  border-bottom: 2px solid #0f0018;
  padding-bottom: 3px;
}

.search-input:focus {
  outline: none;
  border-color: #0f0018 !important;
  box-shadow: 0 0 0 3px rgba(15,0,24,0.10);
}

.logo-link:hover .logo-name { color: #2e1065 !important; }

.bag-badge { animation: popIn 0.2s ease; }

.top-bar-link:hover { color: #ffffff !important; }

.mobile-link:hover {
  background: #faf8f5 !important;
  color: #0f0018 !important;
}

@keyframes popIn {
  from { transform: scale(0.6); }
  to { transform: scale(1); }
}

@keyframes mobileMenuIn {
  from { opacity:0; transform:translateY(-12px); }
  to { opacity:1; transform:translateY(0); }
}
`;

const Layout = () => {
  const { bagItems } = useBag();
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!location.pathname.startsWith("/home")) return;

    if (debouncedQuery.trim()) {
      navigate(`/home?search=${debouncedQuery}`);
    } else {
      navigate("/home");
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/menu", label: "Menu" },
    { to: "/orders", label: "Orders" },
    { to: "/me", label: "Me" }
  ];

  return (
    <Fragment>
      <style>{fonts}</style>

      <header
        style={{
          ...s.header,
          boxShadow: scrolled ? "0 6px 28px rgba(15,0,24,0.12)" : "none"
        }}
      >
        {/* Top Bar */}
        <div style={s.topBar}>
          <div style={s.topBarInner}>
            <span style={s.topBarText}>
              ✦ Free Shipping on all orders · Handcrafted with Love ✦
            </span>

            <div style={s.topBarRight}>
              {!user && (
                <Link to="/login" style={s.topBarLink} className="top-bar-link">
                  Login
                </Link>
              )}

              {user?.role === "admin" && (
                <Link to="/admin" style={s.topBarLink} className="top-bar-link">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div style={s.mainNav}>
          {/* Logo */}
          <Link to="/home" className="logo-link" style={s.logoLink}>
            <img src="/logo.jpeg" alt="logo" style={s.logoImg} />

            <div style={s.logoText}>
              <span className="logo-name" style={s.logoName}>
                Vaami's Creation
              </span>

              <span style={s.logoTagline}>Handcrafted Jewellery</span>
            </div>
          </Link>

          {/* Search */}
          <div style={s.searchWrap}>
            <span style={s.searchIcon}></span>

            <input
              type="text"
              placeholder="Search jewellery..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={s.searchInput}
              className="search-input"
            />
          </div>

          {/* Desktop Nav */}
          <nav style={s.nav}>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  ...s.navLink,
                  color: isActive(to) ? "#0f0018" : "#1a1020",
                  fontWeight: isActive(to) ? "600" : "500"
                }}
                className={`nav-link${isActive(to) ? " active" : ""}`}
              >
                {label}
              </Link>
            ))}

            {/* Bag */}
            <Link
              to="/bag"
              className={`nav-link${isActive("/bag") ? " active" : ""}`}
              style={{
                ...s.navLink,
                ...s.bagLink
              }}
            >
              Bag

              {bagItems.length > 0 && (
                <span className="bag-badge" style={s.bagBadge}>
                  {bagItems.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Button */}
          <button
            style={s.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={s.mobileMenu}>
            {[...navLinks, { to: "/bag", label: `Bag (${bagItems.length})` }].map(
              ({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="mobile-link"
                  style={s.mobileLink}
                >
                  {label}
                </Link>
              )
            )}

            {!user && (
              <Link to="/login" style={s.mobileLink} className="mobile-link">
                Login
              </Link>
            )}

            {user?.role === "admin" && (
              <Link to="/admin" style={s.mobileLink} className="mobile-link">
                Admin Panel
              </Link>
            )}
          </div>
        )}
      </header>

      <Outlet />
    </Fragment>
  );
};

export default Layout;

const s = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#ffffff",
    borderBottom: "1px solid #ddd8d2",
    fontFamily: "'Cormorant Garamond', serif"
  },

  topBar: {
    background: "#0f0018",
    padding: "14px 40px"
  },

  topBarInner: {
    maxWidth: "1500px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between"
  },

  topBarText: {
    color: "#ffd6ff",
    fontSize: "14px",
    letterSpacing: "0.30em",
    fontFamily: "Cinzel"
  },

  topBarRight: {
    display: "flex",
    gap: "30px"
  },

  topBarLink: {
    color: "#ffd6ff",
    fontSize: "14px",
    textDecoration: "none",
    fontFamily: "Cinzel"
  },

  mainNav: {
    maxWidth: "1500px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "95px",
    padding: "0 40px"
  },

  logoLink: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    textDecoration: "none"
  },

  logoImg: {
    width: "70px",
    height: "70px",
    borderRadius: "50%"
  },

  logoText: {
    display: "flex",
    flexDirection: "column"
  },

  logoName: {
    fontFamily: "Cinzel",
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f0018"
  },

  logoTagline: {
    fontSize: "18px",
    fontStyle: "italic",
    color: "#4a3050"
  },

  searchWrap: {
    flex: 1,
    maxWidth: "420px",
    position: "relative"
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "12px"
  },

  searchInput: {
    width: "100%",
    padding: "14px 16px 14px 40px",
    fontSize: "18px",
    background: "#faf8f5",
    border: "1.5px solid #c8c0bc"
  },

  nav: {
    display: "flex",
    gap: "38px"
  },

  navLink: {
    fontFamily: "Cinzel",
    fontSize: "16px",
    letterSpacing: "0.20em",
    textDecoration: "none"
  },

  bagLink: {
    position: "relative"
  },

  bagBadge: {
    position: "absolute",
    top: "-10px",
    right: "-14px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "#0f0018",
    color: "#ffd6ff",
    fontSize: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  hamburger: {
    display: "none"
  },

  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    borderTop: "1px solid #ddd8d2",
    padding: "10px 0"
  },

  mobileLink: {
    padding: "18px 40px",
    fontSize: "16px",
    fontFamily: "Cinzel",
    textDecoration: "none",
    color: "#1a1020"
  }
};


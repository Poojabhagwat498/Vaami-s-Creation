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

/* ── Tablet (max 1024px) ── */
@media (max-width: 1024px) {
  .desktop-nav { display: none !important; }
  .hamburger-btn { display: flex !important; }
  .search-wrap { max-width: 280px !important; }
  .main-nav { padding: 0 24px !important; height: 80px !important; }
  .top-bar { padding: 10px 24px !important; }
  .logo-name-el { font-size: 22px !important; }
  .logo-tagline-el { font-size: 15px !important; }
  .logo-img-el { width: 56px !important; height: 56px !important; }
}

/* ── Mobile (max 640px) ── */
@media (max-width: 640px) {
  .top-bar { padding: 8px 16px !important; }
  .top-bar-text { font-size: 11px !important; letter-spacing: 0.15em !important; }
  .top-bar-right { gap: 16px !important; }
  .top-bar-link-el { font-size: 12px !important; }

  .main-nav { padding: 0 16px !important; height: 68px !important; }

  .logo-img-el { width: 44px !important; height: 44px !important; }
  .logo-name-el { font-size: 17px !important; }
  .logo-tagline-el { font-size: 12px !important; }
  .logo-gap { gap: 10px !important; }

  .search-wrap { display: none !important; }

  .mobile-menu { padding: 6px 0 !important; }
  .mobile-link-el { padding: 14px 20px !important; font-size: 14px !important; }
}

/* ── Very small screens (max 380px) ── */
@media (max-width: 380px) {
  .logo-tagline-el { display: none !important; }
  .logo-name-el { font-size: 15px !important; }
  .top-bar-text { display: none !important; }
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
    { to: "/home",     label: "Home" },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/menu",     label: "Menu" },
    { to: "/orders",   label: "Orders" },
    { to: "/me",       label: "Me" }
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
        {/* ── Top Bar ── */}
        <div style={s.topBar} className="top-bar">
          <div style={s.topBarInner}>
            <span style={s.topBarText} className="top-bar-text">
              ✦ Free Shipping on all orders · Handcrafted with Love ✦
            </span>

            <div style={s.topBarRight} className="top-bar-right">
              {!user && (
                <Link
                  to="/login"
                  style={s.topBarLink}
                  className="top-bar-link top-bar-link-el"
                >
                  Login
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  style={s.topBarLink}
                  className="top-bar-link top-bar-link-el"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Main Navbar ── */}
        <div style={s.mainNav} className="main-nav">

          {/* Logo */}
          <Link to="/home" className="logo-link logo-gap" style={s.logoLink}>
            <img
              src="/logo.jpeg"
              alt="logo"
              style={s.logoImg}
              className="logo-img-el"
            />

            <div style={s.logoText}>
              <span className="logo-name logo-name-el" style={s.logoName}>
                Vaami's Creation
              </span>

              <span style={s.logoTagline} className="logo-tagline-el">
                Handcrafted Jewellery
              </span>
            </div>
          </Link>

          {/* Search — hidden on mobile via CSS */}
          <div style={s.searchWrap} className="search-wrap">
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

          {/* Desktop Nav — hidden on tablet/mobile via CSS */}
          <nav style={s.nav} className="desktop-nav">
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
              style={{ ...s.navLink, ...s.bagLink }}
            >
              Bag
              {bagItems.length > 0 && (
                <span className="bag-badge" style={s.bagBadge}>
                  {bagItems.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Hamburger — shown on tablet/mobile via CSS */}
          <button
            style={s.hamburger}
            className="hamburger-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* ── Mobile / Tablet Dropdown Menu ── */}
        {mobileOpen && (
          <div style={s.mobileMenu} className="mobile-menu">
            {[...navLinks, { to: "/bag", label: `Bag (${bagItems.length})` }].map(
              ({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="mobile-link mobile-link-el"
                  style={{
                    ...s.mobileLink,
                    background: isActive(to) ? "#faf8f5" : "transparent",
                    color: isActive(to) ? "#0f0018" : "#1a1020",
                    fontWeight: isActive(to) ? "600" : "400",
                    borderLeft: isActive(to) ? "3px solid #0f0018" : "3px solid transparent"
                  }}
                >
                  {label}
                </Link>
              )
            )}

            {!user && (
              <Link
                to="/login"
                style={s.mobileLink}
                className="mobile-link mobile-link-el"
              >
                Login
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                style={s.mobileLink}
                className="mobile-link mobile-link-el"
              >
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

/* ─────────────────────────────────────────
   Base styles (desktop-first)
───────────────────────────────────────── */
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
    justifyContent: "space-between",
    alignItems: "center"
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
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0
  },

  logoText: {
    display: "flex",
    flexDirection: "column"
  },

  logoName: {
    fontFamily: "Cinzel",
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f0018",
    whiteSpace: "nowrap"
  },

  logoTagline: {
    fontSize: "18px",
    fontStyle: "italic",
    color: "#4a3050",
    whiteSpace: "nowrap"
  },

  searchWrap: {
    flex: 1,
    maxWidth: "420px",
    position: "relative",
    margin: "0 24px"
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none"
  },

  searchInput: {
    width: "100%",
    padding: "12px 16px 12px 40px",
    fontSize: "16px",
    background: "#faf8f5",
    border: "1.5px solid #c8c0bc",
    borderRadius: "2px",
    boxSizing: "border-box",
    fontFamily: "'Cormorant Garamond', serif"
  },

  nav: {
    display: "flex",
    gap: "38px",
    alignItems: "center"
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
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#0f0018",
    color: "#ffd6ff",
    fontSize: "11px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Cinzel"
  },

  /* hidden by default; CSS media query sets display:flex on ≤1024px */
  hamburger: {
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "1.5px solid #0f0018",
    borderRadius: "4px",
    width: "42px",
    height: "42px",
    fontSize: "20px",
    cursor: "pointer",
    color: "#0f0018",
    flexShrink: 0
  },

  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    borderTop: "1px solid #ddd8d2",
    padding: "10px 0",
    animation: "mobileMenuIn 0.22s ease"
  },

  mobileLink: {
    padding: "16px 40px",
    fontSize: "15px",
    fontFamily: "Cinzel",
    textDecoration: "none",
    letterSpacing: "0.12em",
    transition: "background 0.2s, color 0.2s"
  }
};

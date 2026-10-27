import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// ✅ Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_URL || "/api",
  withCredentials: true,
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginMode, setLoginMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("mode") === "admin" ? "admin" : "customer";
  });
  const [formData, setFormData] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("mode") === "admin"
      ? { email: "admin@gmail.com", password: "admin111" }
      : { email: "", password: "" };
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleSelectMode = (mode) => {
    setLoginMode(mode);
    setMessage("");
    setIsError(false);
    if (mode === "admin") {
      setFormData({ email: "admin@gmail.com", password: "admin111" });
    } else {
      setFormData({ email: "", password: "" });
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const executeLogin = async (email, password) => {
    setMessage("");
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      login({ token: data.token, user: data.user });

      setIsError(false);
      setMessage(`Welcome back, ${data.user.name}!`);

      setTimeout(() => {
        if (data.user.role?.toLowerCase() === "admin") navigate("/admin");
        else navigate("/home");
      }, 600);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setIsError(true);
      setMessage("Email and password are required.");
      return;
    }

    await executeLogin(email, password);
  };

  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
    executeLogin(email, password);
  };

  const handleSkipLogin = () => {
    const guestUser = {
      id: "guest_" + Date.now(),
      _id: "guest_" + Date.now(),
      name: "Guest Visitor",
      email: "guest@vaami.com",
      role: "user",
    };
    const guestToken = "guest_token_" + Date.now();
    localStorage.setItem("token", guestToken);
    localStorage.setItem("user", JSON.stringify(guestUser));
    login({ token: guestToken, user: guestUser });
    navigate("/home");
  };

  return (
    <>
      <style>{css}</style>
      <div className="lg-page">

        {/* Animated background blobs */}
        <div className="lg-blob lg-blob-1" />
        <div className="lg-blob lg-blob-2" />
        <div className="lg-blob lg-blob-3" />

        {/* Background image overlay */}
        <div className="lg-bg-img" />

        <div className="lg-card">

          {/* Top accent line */}
          <div className="lg-card-accent" />

          {/* Brand */}
          <div className="lg-brand">
            <div className="lg-brand-icon">✦</div>
            <span className="lg-brand-name">Vaami's Creation</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="lg-mode-tabs">
            <button
              type="button"
              className={`lg-mode-tab ${loginMode === "customer" ? "active" : ""}`}
              onClick={() => handleSelectMode("customer")}
            >
              <span>👤 Customer Login</span>
            </button>
            <button
              type="button"
              className={`lg-mode-tab ${loginMode === "admin" ? "active" : ""}`}
              onClick={() => handleSelectMode("admin")}
            >
              <span>🛡️ Admin Portal</span>
            </button>
          </div>

          <h1 className="lg-title">
            {loginMode === "admin" ? "Admin Access" : "Welcome Back"}
          </h1>
          <p className="lg-subtitle">
            {loginMode === "admin"
              ? "Sign in to manage catalog, orders, and users"
              : "Sign in to continue your journey"}
          </p>

          {/* Admin Helper Banner */}
          {loginMode === "admin" && (
            <div className="lg-admin-banner">
              <span className="lg-admin-badge">Admin Credentials</span>
              <p className="lg-admin-info">
                Email: <code>admin@gmail.com</code> &middot; Password: <code>admin111</code>
              </p>
              <button
                type="button"
                className="lg-admin-quick-btn"
                onClick={() => handleDemoLogin("admin@gmail.com", "admin111")}
                disabled={loading}
              >
                ⚡ 1-Click Sign In as Admin
              </button>
            </div>
          )}

          {/* Customer Quick Demo Access Bar */}
          {loginMode === "customer" && (
            <div className="lg-demo-box">
              <span className="lg-demo-label">Quick Access Options</span>
              <div className="lg-demo-buttons">
                <button
                  type="button"
                  className="lg-demo-btn"
                  onClick={() => handleDemoLogin("demo@vaami.com", "demo123")}
                  disabled={loading}
                >
                  <span>👤 Demo Customer</span>
                </button>
                <button
                  type="button"
                  className="lg-demo-btn"
                  onClick={() => handleSelectMode("admin")}
                >
                  <span>🛡️ Switch to Admin</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="lg-form">

            {/* Email */}
            <div className={`lg-field ${focused === "email" ? "lg-field-focused" : ""} ${formData.email ? "lg-field-filled" : ""}`}>
              <label className="lg-label" htmlFor="email">Email Address</label>
              <div className="lg-input-wrap">
                <svg className="lg-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  className="lg-input"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className={`lg-field ${focused === "password" ? "lg-field-focused" : ""} ${formData.password ? "lg-field-filled" : ""}`}>
              <label className="lg-label" htmlFor="password">Password</label>
              <div className="lg-input-wrap">
                <svg className="lg-input-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  className="lg-input"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lg-eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`lg-message ${isError ? "lg-message-error" : "lg-message-success"}`}>
                <span className="lg-message-icon">{isError ? "✕" : "✓"}</span>
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              className={`lg-submit ${loading ? "lg-submit-loading" : ""}`}
              type="submit"
              disabled={loading}
            >
              <span className="lg-submit-shimmer" />
              <span className="lg-submit-inner">
                {loading ? (
                  <>
                    <span className="lg-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </span>
            </button>

            {/* Skip Login / Guest Access */}
            <button
              type="button"
              className="lg-skip-btn"
              onClick={handleSkipLogin}
            >
              <span>Explore Collection as Guest</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

          </form>

          <div className="lg-divider">
            <span className="lg-divider-line" />
            <span className="lg-divider-text">New here?</span>
            <span className="lg-divider-line" />
          </div>

          <p className="lg-register">
            Don't have an account?{" "}
            <Link to="/register" className="lg-register-link">
              Create one →
            </Link>
          </p>

        </div>
      </div>
    </>
  );
}

export default Login;

/* ─── STYLES ─────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Jost', sans-serif;
    position: relative;
    overflow: hidden;
    background: #0a0612;
    padding: 24px;
  }

  /* Background image */
  .lg-bg-img {
    position: fixed;
    inset: 0;
    background-image: url("/login.webp");
    background-size: cover;
    background-position: center;
    opacity: 0.12;
    z-index: 0;
  }

  /* Animated blobs */
  .lg-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 1;
    animation: lgFloat 8s ease-in-out infinite;
  }
  .lg-blob-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(109,40,217,0.25), transparent 70%);
    top: -150px; left: -100px;
    animation-delay: 0s;
  }
  .lg-blob-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(0,210,255,0.12), transparent 70%);
    bottom: -120px; right: -80px;
    animation-delay: -3s;
  }
  .lg-blob-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%);
    top: 50%; left: 50%;
    animation-delay: -5s;
  }

  @keyframes lgFloat {
    0%,100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-30px) scale(1.05); }
  }

  /* ── CARD ── */
  .lg-card {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 480px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 28px;
    padding: 48px 44px 40px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04),
      0 8px 32px rgba(0,0,0,0.4),
      0 40px 80px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.08);
    animation: lgSlideUp 0.65s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes lgSlideUp {
    from { opacity: 0; transform: translateY(32px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Top accent bar */
  .lg-card-accent {
    position: absolute;
    top: 0; left: 40px; right: 40px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(109,40,217,0.8), rgba(168,85,247,0.9), rgba(0,210,255,0.5), transparent);
    border-radius: 0 0 2px 2px;
  }

  /* ── BRAND ── */
  .lg-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-bottom: 28px;
  }

  .lg-brand-icon {
    font-size: 14px;
    color: #a78bfa;
    animation: lgSpin 6s linear infinite;
  }

  @keyframes lgSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .lg-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
  }

  /* ── HEADINGS ── */
  .lg-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    line-height: 1.1;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }

  .lg-subtitle {
    text-align: center;
    font-size: 14px;
    color: rgba(255,255,255,0.38);
    font-weight: 300;
    letter-spacing: 0.3px;
    margin-bottom: 36px;
  }

  /* ── FORM ── */
  .lg-form { display: flex; flex-direction: column; gap: 0; }

  .lg-field {
    margin-bottom: 22px;
  }

  .lg-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin-bottom: 10px;
    transition: color 0.2s;
  }

  .lg-field-focused .lg-label,
  .lg-field-filled .lg-label {
    color: #a78bfa;
  }

  .lg-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .lg-input-icon {
    position: absolute;
    left: 16px;
    color: rgba(255,255,255,0.25);
    pointer-events: none;
    transition: color 0.2s;
    flex-shrink: 0;
  }

  .lg-field-focused .lg-input-icon {
    color: #a78bfa;
  }

  .lg-input {
    width: 100%;
    padding: 14px 48px 14px 46px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    color: #fff;
    font-family: 'Jost', sans-serif;
    font-size: 15px;
    font-weight: 400;
    outline: none;
    transition: all 0.25s ease;
  }

  .lg-input::placeholder { color: rgba(255,255,255,0.18); }

  .lg-input:focus {
    background: rgba(109,40,217,0.1);
    border-color: rgba(109,40,217,0.55);
    box-shadow: 0 0 0 3px rgba(109,40,217,0.12), inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .lg-eye-btn {
    position: absolute;
    right: 14px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }
  .lg-eye-btn:hover { color: #a78bfa; }

  /* ── MESSAGE ── */
  .lg-message {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 13.5px;
    font-weight: 500;
    margin-bottom: 18px;
    animation: lgFadeIn 0.3s ease;
  }

  @keyframes lgFadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lg-message-error {
    background: rgba(225,29,72,0.12);
    border: 1px solid rgba(225,29,72,0.25);
    color: #fb7185;
  }

  .lg-message-success {
    background: rgba(22,163,74,0.12);
    border: 1px solid rgba(22,163,74,0.25);
    color: #4ade80;
  }

  .lg-message-icon {
    width: 20px; height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
    background: currentColor;
    color: inherit;
    filter: brightness(0.2);
  }

  /* ── SUBMIT ── */
  .lg-submit {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #9333ea 100%);
    background-size: 200% auto;
    border: none;
    border-radius: 14px;
    color: #fff;
    font-family: 'Jost', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
    position: relative;
    overflow: hidden;
    margin-top: 4px;
    box-shadow:
      0 4px 20px rgba(109,40,217,0.4),
      inset 0 1px 0 rgba(255,255,255,0.15);
  }

  .lg-submit-shimmer {
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.6s ease;
    pointer-events: none;
  }
  .lg-submit:hover:not(:disabled) .lg-submit-shimmer { left: 100%; }

  .lg-submit:hover:not(:disabled) {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow:
      0 10px 36px rgba(109,40,217,0.55),
      inset 0 1px 0 rgba(255,255,255,0.15);
  }

  .lg-submit:active:not(:disabled) { transform: translateY(0); }

  .lg-submit:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }

  .lg-submit-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .lg-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: lgSpin2 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes lgSpin2 {
    to { transform: rotate(360deg); }
  }

  /* ── MODE TABS ── */
  .lg-mode-tabs {
    display: flex;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 4px;
    margin-bottom: 24px;
    gap: 4px;
  }

  .lg-mode-tab {
    flex: 1;
    padding: 10px 14px;
    background: transparent;
    border: none;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.6);
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .lg-mode-tab:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }

  .lg-mode-tab.active {
    background: linear-gradient(135deg, #6d28d9, #9333ea);
    color: #fff;
    box-shadow: 0 4px 16px rgba(109, 40, 217, 0.4);
  }

  /* ── ADMIN BANNER ── */
  .lg-admin-banner {
    background: rgba(109, 40, 217, 0.15);
    border: 1px solid rgba(168, 85, 247, 0.4);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .lg-admin-badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #ffd6ff;
    background: rgba(109, 40, 217, 0.5);
    padding: 3px 10px;
    border-radius: 100px;
  }

  .lg-admin-info {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }

  .lg-admin-info code {
    background: rgba(0, 0, 0, 0.35);
    padding: 2px 7px;
    border-radius: 4px;
    color: #ffd6ff;
    font-family: monospace;
    font-size: 12px;
  }

  .lg-admin-quick-btn {
    width: 100%;
    padding: 11px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #1a0f00;
    border: none;
    border-radius: 10px;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
  }

  .lg-admin-quick-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(245, 158, 11, 0.5);
    filter: brightness(1.08);
  }

  /* ── DEMO ACCESS & SKIP ── */
  .lg-demo-box {
    margin-bottom: 24px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px dashed rgba(168, 85, 247, 0.35);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .lg-demo-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: rgba(255, 255, 255, 0.45);
    font-weight: 600;
  }

  .lg-demo-buttons {
    display: flex;
    gap: 8px;
  }

  .lg-demo-btn {
    flex: 1;
    padding: 9px 12px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    color: #e2d9f3;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .lg-demo-btn:hover:not(:disabled) {
    background: rgba(109, 40, 217, 0.28);
    border-color: rgba(168, 85, 247, 0.6);
    color: #fff;
    transform: translateY(-1px);
  }

  .lg-demo-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .lg-skip-btn {
    margin-top: 12px;
    width: 100%;
    padding: 13px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 14px;
    color: #ffd6ff;
    font-family: 'Jost', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    letter-spacing: 0.4px;
    cursor: pointer;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .lg-skip-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 214, 255, 0.35);
    color: #fff;
    transform: translateY(-1px);
  }

  /* ── DIVIDER ── */
  .lg-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0 18px;
  }

  .lg-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.08);
  }

  .lg-divider-text {
    font-size: 12px;
    color: rgba(255,255,255,0.25);
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  /* ── REGISTER ── */
  .lg-register {
    text-align: center;
    font-size: 14px;
    color: rgba(255,255,255,0.35);
    font-weight: 400;
  }

  .lg-register-link {
    color: #a78bfa;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }

  .lg-register-link:hover {
    color: #c4b5fd;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 520px) {
    .lg-card { padding: 36px 24px 32px; border-radius: 22px; }
    .lg-title { font-size: 34px; }
  }
`;

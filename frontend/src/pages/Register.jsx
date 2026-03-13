import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setIsError(true);
      setMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/register", {
        name: username,
        email,
        password,
      });

      setIsError(false);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      id: "username",
      label: "Full Name",
      type: "text",
      placeholder: "Your full name",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "you@example.com",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
    },
    {
      id: "password",
      label: "Password",
      type: showPassword ? "text" : "password",
      placeholder: "Create a password",
      toggle: () => setShowPassword((p) => !p),
      shown: showPassword,
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      type: showConfirm ? "text" : "password",
      placeholder: "Repeat your password",
      toggle: () => setShowConfirm((p) => !p),
      shown: showConfirm,
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
  ];

  const EyeOpen = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeClosed = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <>
      <style>{css}</style>
      <div className="rg-page">
        <div className="rg-blob rg-blob-1" />
        <div className="rg-blob rg-blob-2" />
        <div className="rg-blob rg-blob-3" />
        <div className="rg-bg-img" />

        <div className="rg-card">
          <div className="rg-card-accent" />

          {/* Brand */}
          <div className="rg-brand">
            <div className="rg-brand-icon">✦</div>
            <span className="rg-brand-name">Vaami's Creation</span>
          </div>

          <h1 className="rg-title">Create Account</h1>
          <p className="rg-subtitle">Join us and start your journey today</p>

          <form onSubmit={handleSubmit} className="rg-form">
            {fields.map((field) => (
              <div
                key={field.id}
                className={`rg-field ${focused === field.id ? "rg-field-focused" : ""} ${formData[field.id] ? "rg-field-filled" : ""}`}
              >
                <label className="rg-label" htmlFor={field.id}>
                  {field.label}
                </label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">{field.icon}</span>
                  <input
                    className="rg-input"
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={handleChange}
                    onFocus={() => setFocused(field.id)}
                    onBlur={() => setFocused("")}
                    autoComplete="off"
                  />
                  {field.toggle && (
                    <button
                      type="button"
                      className="rg-eye-btn"
                      onClick={field.toggle}
                      tabIndex={-1}
                    >
                      {field.shown ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Message */}
            {message && (
              <div className={`rg-message ${isError ? "rg-message-error" : "rg-message-success"}`}>
                <span className="rg-message-dot">{isError ? "✕" : "✓"}</span>
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              className={`rg-submit ${loading ? "rg-submit-loading" : ""}`}
              type="submit"
              disabled={loading}
            >
              <span className="rg-submit-shimmer" />
              <span className="rg-submit-inner">
                {loading ? (
                  <>
                    <span className="rg-spinner" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="rg-divider">
            <span className="rg-divider-line" />
            <span className="rg-divider-text">Already have an account?</span>
            <span className="rg-divider-line" />
          </div>

          <p className="rg-login">
            <Link to="/login" className="rg-login-link">
              ← Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;

/* ─── STYLES ─────────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rg-page {
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

  .rg-bg-img {
    position: fixed;
    inset: 0;
    background-image: url("/login.webp");
    background-size: cover;
    background-position: center;
    opacity: 0.12;
    z-index: 0;
  }

  .rg-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 1;
    animation: rgFloat 8s ease-in-out infinite;
  }
  .rg-blob-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(109,40,217,0.25), transparent 70%);
    top: -150px; right: -100px;
    animation-delay: 0s;
  }
  .rg-blob-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(0,210,255,0.1), transparent 70%);
    bottom: -120px; left: -80px;
    animation-delay: -3s;
  }
  .rg-blob-3 {
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%);
    top: 30%; right: 20%;
    animation-delay: -5s;
  }

  @keyframes rgFloat {
    0%,100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-28px) scale(1.04); }
  }

  /* ── CARD ── */
  .rg-card {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 480px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 28px;
    padding: 44px 44px 38px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04),
      0 8px 32px rgba(0,0,0,0.4),
      0 40px 80px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.08);
    animation: rgSlideUp 0.65s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes rgSlideUp {
    from { opacity: 0; transform: translateY(32px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .rg-card-accent {
    position: absolute;
    top: 0; left: 40px; right: 40px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(109,40,217,0.8), rgba(168,85,247,0.9), rgba(0,210,255,0.5), transparent);
    border-radius: 0 0 2px 2px;
  }

  /* ── BRAND ── */
  .rg-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-bottom: 24px;
  }
  .rg-brand-icon {
    font-size: 14px;
    color: #a78bfa;
    animation: rgSpin 6s linear infinite;
  }
  @keyframes rgSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .rg-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
  }

  .rg-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    line-height: 1.1;
    letter-spacing: -0.5px;
    margin-bottom: 7px;
  }

  .rg-subtitle {
    text-align: center;
    font-size: 14px;
    color: rgba(255,255,255,0.35);
    font-weight: 300;
    margin-bottom: 30px;
  }

  /* ── FORM ── */
  .rg-form { display: flex; flex-direction: column; }

  .rg-field { margin-bottom: 18px; }

  .rg-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 9px;
    transition: color 0.2s;
  }
  .rg-field-focused .rg-label,
  .rg-field-filled .rg-label { color: #a78bfa; }

  .rg-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .rg-input-icon {
    position: absolute;
    left: 16px;
    color: rgba(255,255,255,0.22);
    pointer-events: none;
    transition: color 0.2s;
    display: flex;
  }
  .rg-field-focused .rg-input-icon { color: #a78bfa; }

  .rg-input {
    width: 100%;
    padding: 13px 48px 13px 46px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 13px;
    color: #fff;
    font-family: 'Jost', sans-serif;
    font-size: 15px;
    font-weight: 400;
    outline: none;
    transition: all 0.25s ease;
  }
  .rg-input::placeholder { color: rgba(255,255,255,0.16); }
  .rg-input:focus {
    background: rgba(109,40,217,0.1);
    border-color: rgba(109,40,217,0.55);
    box-shadow: 0 0 0 3px rgba(109,40,217,0.12), inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .rg-eye-btn {
    position: absolute;
    right: 14px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.28);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }
  .rg-eye-btn:hover { color: #a78bfa; }

  /* ── MESSAGE ── */
  .rg-message {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 11px 15px;
    border-radius: 11px;
    font-size: 13.5px;
    font-weight: 500;
    margin-bottom: 16px;
    animation: rgFadeIn 0.3s ease;
  }
  @keyframes rgFadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .rg-message-error {
    background: rgba(225,29,72,0.11);
    border: 1px solid rgba(225,29,72,0.22);
    color: #fb7185;
  }
  .rg-message-success {
    background: rgba(22,163,74,0.11);
    border: 1px solid rgba(22,163,74,0.22);
    color: #4ade80;
  }
  .rg-message-dot {
    width: 19px; height: 19px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 800;
    flex-shrink: 0;
    background: rgba(255,255,255,0.08);
  }

  /* ── SUBMIT ── */
  .rg-submit {
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
  .rg-submit-shimmer {
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.6s ease;
    pointer-events: none;
  }
  .rg-submit:hover:not(:disabled) .rg-submit-shimmer { left: 100%; }
  .rg-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(109,40,217,0.55), inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .rg-submit:active:not(:disabled) { transform: translateY(0); }
  .rg-submit:disabled { cursor: not-allowed; opacity: 0.7; transform: none; }

  .rg-submit-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .rg-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: rgSpin2 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes rgSpin2 { to { transform: rotate(360deg); } }

  /* ── DIVIDER ── */
  .rg-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 26px 0 16px;
  }
  .rg-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }
  .rg-divider-text {
    font-size: 12px;
    color: rgba(255,255,255,0.22);
    white-space: nowrap;
    letter-spacing: 0.3px;
  }

  .rg-login {
    text-align: center;
    font-size: 14px;
  }
  .rg-login-link {
    color: #a78bfa;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }
  .rg-login-link:hover { color: #c4b5fd; }

  @media (max-width: 520px) {
    .rg-card { padding: 36px 22px 30px; border-radius: 22px; }
    .rg-title { font-size: 32px; }
  }
`;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// ✅ Create axios instance (better practice)
const API = axios.create({
  baseURL: import.meta.env.VITE_URL || "https://vaami-s-creation.onrender.com/api",
  withCredentials: true, // ✅ important for CORS cookies/auth
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { email, password } = formData;

    if (!email || !password) {
      setIsError(true);
      setMessage("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });

      const data = res?.data;

      if (!data?.token || !data?.user) {
        throw new Error("Invalid response from server");
      }

      // ✅ Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      login({ token: data.token, user: data.user });

      setIsError(false);
      setMessage("Login successful!");

      setTimeout(() => {
        if (data?.user?.role?.toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }, 700);
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setIsError(true);
      setMessage(
        err?.response?.data?.message ||
        err?.message ||
        "Server error. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>

      <div className="lg-page">
        <div className="lg-blob lg-blob-1" />
        <div className="lg-blob lg-blob-2" />
        <div className="lg-blob lg-blob-3" />
        <div className="lg-bg-img" />

        <div className="lg-card">
          <div className="lg-card-accent" />

          <div className="lg-brand">
            <div className="lg-brand-icon">✦</div>
            <span className="lg-brand-name">Vaami's Creation</span>
          </div>

          <h1 className="lg-title">Welcome Back</h1>
          <p className="lg-subtitle">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} className="lg-form">

            {/* Email */}
            <div className={`lg-field ${focused === "email" ? "lg-field-focused" : ""}`}>
              <label className="lg-label">Email Address</label>
              <div className="lg-input-wrap">
                <input
                  className="lg-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                />
              </div>
            </div>

            {/* Password */}
            <div className={`lg-field ${focused === "password" ? "lg-field-focused" : ""}`}>
              <label className="lg-label">Password</label>
              <div className="lg-input-wrap">
                <input
                  className="lg-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                />
                <button
                  type="button"
                  className="lg-eye-btn"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`lg-message ${isError ? "lg-message-error" : "lg-message-success"}`}>
                {message}
              </div>
            )}

            {/* Submit */}
            <button className="lg-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

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
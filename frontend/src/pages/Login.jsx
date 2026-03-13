import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `
      linear-gradient(
        rgba(15, 12, 41, 0.85),
        rgba(36, 36, 62, 0.85)
      ),
      url("/login.webp")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  card: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: 70,
    width: 600,
    borderRadius: 20,
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
    color: "white",
    textAlign: "center",
    fontSize: "1.4rem"
  },

  title: {
    marginBottom: 10,
    fontWeight: 800,
  },

  label: {
    display: "block",
    textAlign: "left",
    marginBottom: 6,
    fontWeight: "600",
    color: "#ddd",
    fontSize: "1.4rem"
  },

  input: {
    width: "100%",
    padding: "12px 10px",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid #fff",
    outline: "none",
    color: "#fff",
    fontSize: "1.1rem",
    marginBottom: 25,
  },

  passwordWrapper: {
    position: "relative",
    marginBottom: 25,
  },

  toggleBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "#00d2ff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  button: {
    width: "100%",
    padding: 12,
    border: "none",
    borderRadius: 25,
    background: "#00d2ff",
    color: "#fff",
    fontSize: "1.4rem",
    fontWeight: "bold",
    cursor: "pointer",
  },

  message: {
    fontSize: "1.1rem",
    marginBottom: 20,
  },

  registerText: {
    fontSize: "1.1rem",
    color: "#ccc",
  },

  registerLink: {
    color: "#00d2ff",
    textDecoration: "none",
  },
};

function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const API_URL = import.meta.env.VITE_URL || "http://localhost:5000/api";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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

      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const data = res.data;

      /* SAVE TOKEN IN LOCALSTORAGE */
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      /* UPDATE AUTH CONTEXT */
      login({
        token: data.token,
        user: data.user,
      });

      setIsError(false);
      setMessage("Login successful!");

      setTimeout(() => {

        if (data.user.role?.toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }

      }, 600);

    } catch (err) {

      setIsError(true);
      setMessage(err.response?.data?.message || "Server error. Try again.");

    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Welcome To Vaami's Creation</h2>

        <form onSubmit={handleSubmit}>

          <label htmlFor="email" style={styles.label}>
            Email
          </label>

          <input
            style={styles.input}
            id="email"
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password" style={styles.label}>
            Password
          </label>

          <div style={styles.passwordWrapper}>
            <input
              style={styles.input}
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={styles.toggleBtn}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button style={styles.button} type="submit">
            Login
          </button>

        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              color: isError ? "#e11d48" : "#16a34a",
            }}
          >
            {message}
          </p>
        )}

        <p style={styles.registerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.registerLink}>
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;


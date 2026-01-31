import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(45deg, #0f0c29, #302b63, #24243e)",
  },
  card: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    padding: 60,
    width: 600,
    borderRadius: 20,
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
    color: "white",
    textAlign: "center",
    fontSize: "1.4rem",
  },
  label: {
    display: "block",
    textAlign: "left",
    marginBottom: 8,
    fontWeight: "600",
    color: "#ddd",
    fontSize: "1.4rem",
  },
  input: {
    width: "100%",
    padding: "12px 10px",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid #fff",
    outline: "none",
    color: "#fff",
    fontSize: "1rem",
    marginBottom: 25,
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
    fontSize: "0.9rem",
    marginTop: 15,
  },
};

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      return setMessage("All fields are required");
    }

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: username, // backend expects "name"
          email,
          password,
        }
      );

      setMessage("🎉 Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username" style={styles.label}>
            Username
          </label>
          <input
            style={styles.input}
            id="username"
            name="username"
            placeholder=" Enter Username"
            onChange={handleChange}
          />

          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            style={styles.input}
            id="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />

          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            style={styles.input}
            id="password"
            type="password"
            name="password"
            placeholder=" Enter Password"
            onChange={handleChange}
          />

          <label htmlFor="confirmPassword" style={styles.label}>
            Confirm Password
          </label>
          <input
            style={styles.input}
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder=" Enter Confirm Password"
            onChange={handleChange}
          />

          <button style={styles.button} type="submit">
            Register
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

export default Register;

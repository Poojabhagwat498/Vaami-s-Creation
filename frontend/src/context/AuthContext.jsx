import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem("auth");

    if (storedData) {
      const parsed = JSON.parse(storedData);
      setUser(parsed.user);
    }

    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setUser(data.user); // 🔥 VERY IMPORTANT
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

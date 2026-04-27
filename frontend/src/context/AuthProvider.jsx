import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import API from "../api/axios";
// import api from "../../api/axios";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // ✅ NEW

  const login = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // 🔥 Verify token on app load
 useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data.user);
      } catch {
        logout();
      }
    };

    if (token) fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{  token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

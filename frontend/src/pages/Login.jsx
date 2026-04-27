import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import "../styles/Login.css";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    if (!form.email || !form.password) {
      return alert("Please fill all fields");
    }
    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", form);

      login(data.token);

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={submit} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <p onClick={() => navigate("/signup")}>Don't have an account? Signup</p>
    </div>
  );
}

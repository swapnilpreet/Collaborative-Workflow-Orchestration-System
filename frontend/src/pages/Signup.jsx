import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
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

      await api.post("/auth/signup", form);

      alert("Signup successful! Please login.");

      navigate("/login"); // ✅ redirect
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <h2>Signup</h2>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

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
        {loading ? "Signing up..." : "Signup"}
      </button>
      <p onClick={() => navigate("/login")}>
        Already have an account?
        <span style={{ cursor: "pointer" }}> Login</span>
      </p>
    </div>
  );
}

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      background: "#111827",
      color: "#fff"
    }}>
      
      {/* LEFT */}
      <h3
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        🚀 Workflow App
      </h3>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* USER NAME */}
        <span>
          👤 {user?.name || "User"}
        </span>

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
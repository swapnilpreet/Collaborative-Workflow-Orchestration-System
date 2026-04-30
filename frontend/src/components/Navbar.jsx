import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FcWorkflow } from "react-icons/fc";
import "../styles/Navbar.css";

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      
      {/* LOGO */}
      <div className="logo" onClick={() => navigate("/")}>
        <FcWorkflow size={26} />
        <span>Orchest</span>
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">
        <div className="user">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <span>
            {user?.name
              ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
              : "User"}
          </span>
        </div>

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
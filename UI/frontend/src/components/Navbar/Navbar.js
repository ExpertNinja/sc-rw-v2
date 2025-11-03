import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import download from "../../Data/Images/download.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={download} alt="Standard Chartered GBS" className="img" />
          <span className="brand-text">Standard Chartered GBS</span>
        </div>

        <div className="navbar-actions">
          <span className="user-name">{user || "User"}</span>
          <button 
            onClick={handleLogout} 
            className="logout-button"
            type="button"
          >
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

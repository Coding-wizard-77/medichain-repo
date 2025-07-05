// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">MediChain</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/patient-login">Patient Login</Link>
        <Link to="/doctor-login">Doctor Login</Link>
        <Link to="/upload">Upload</Link>
      </div>
    </nav>
  );
};

export default Navbar;

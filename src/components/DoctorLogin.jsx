// src/components/DoctorLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const DoctorLogin = () => {
  const [doctorId, setDoctorId] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (doctorId.trim()) {
      localStorage.setItem("userType", "doctor");
      localStorage.setItem("userId", doctorId);
      navigate("/dashboard/doctor");
    }
  };

  return (
    <div className="login-container">
      <h2>Doctor Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>Doctor ID:</label>
        <input
          type="text"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          placeholder="Enter your doctor ID"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default DoctorLogin;

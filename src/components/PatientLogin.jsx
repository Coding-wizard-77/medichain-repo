// src/components/PatientLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const PatientLogin = () => {
  const [patientId, setPatientId] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (patientId.trim()) {
      localStorage.setItem("userType", "patient");
      localStorage.setItem("userId", patientId);
      navigate("/dashboard/patient");
    }
  };

  return (
    <div className="login-container">
      <h2>Patient Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>Patient ID:</label>
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter your patient ID"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default PatientLogin;

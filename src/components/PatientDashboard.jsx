// src/components/PatientDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const PatientDashboard = () => {
  const [patientId, setPatientId] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      setPatientId(id);
      // Simulate fetching files (in real case: fetch from backend/IPFS)
      const storedDocs = JSON.parse(localStorage.getItem("uploadedDocs")) || [];
      setDocuments(storedDocs);
    }
  }, []);

  return (
    <div className="dashboard">
      <h2>Welcome, Patient {patientId}</h2>

      <div className="dashboard-section">
        <h3>Your Medical Records</h3>
        {documents.length === 0 ? (
          <p>No records found. Go to upload page.</p>
        ) : (
          <ul className="doc-list">
            {documents.map((doc, index) => (
              <li key={index}>
                <strong>{doc.name}</strong> ({doc.type}, {(doc.size / 1024).toFixed(1)} KB)
                <br />
                <small>Uploaded on: {doc.uploadedAt}</small>
              </li>
            ))}
          </ul>
        )}

        <Link to="/upload">
          <button className="upload-btn">Upload New Record</button>
        </Link>
      </div>
    </div>
  );
};

export default PatientDashboard;

// src/components/UploadDocuments.jsx
import React, { useState } from "react";
import "./UploadDocuments.css";

const UploadDocuments = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
  if (!selectedFile) return;

  const newFile = {
    name: selectedFile.name,
    size: selectedFile.size,
    type: selectedFile.type,
    uploadedAt: new Date().toLocaleString(),
  };

  const updatedFiles = [newFile, ...uploadedFiles];
  setUploadedFiles(updatedFiles);
  setSelectedFile(null);
  document.getElementById("fileInput").value = "";

  // Save to localStorage
  localStorage.setItem("uploadedDocs", JSON.stringify(updatedFiles));
};

  return (
    <div className="upload-container">
      <h2>Upload Medical Document</h2>
      <div className="upload-box">
        <input type="file" id="fileInput" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="file-list">
          <h3>Uploaded Files</h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                <strong>{file.name}</strong> ({file.type}, {(file.size / 1024).toFixed(1)} KB)
                <br />
                <small>Uploaded on: {file.uploadedAt}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;

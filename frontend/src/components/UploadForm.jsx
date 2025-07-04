import React, { useState } from 'react';

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cidUrl, setCidUrl] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setCidUrl(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setCidUrl(data.url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white">
      <h1 className="text-3xl font-bold mb-6">Upload Medical File</h1>
      <input
        type="file"
        onChange={handleChange}
        className="mb-4 text-black"
      />
      <button
        onClick={handleUpload}
        className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-indigo-100 disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {cidUrl && (
        <p className="mt-4">
          File stored at:{' '}
          <a href={cidUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {cidUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default UploadFile;

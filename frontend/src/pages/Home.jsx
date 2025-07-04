import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white px-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">MediChain</h1>
        <p className="text-lg max-w-md mx-auto">
          Secure, decentralized health record management using blockchain and IPFS.
        </p>

        <div className="space-x-4">
          <button
            onClick={() => navigate('/patient')}
            className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-md hover:bg-indigo-100 transition"
          >
            Patient Login
          </button>
          <button
            onClick={() => navigate('/doctor')}
            className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-md hover:bg-indigo-100 transition"
          >
            Doctor Login
          </button>
        </div>
      </div>
    </div>
  );
}

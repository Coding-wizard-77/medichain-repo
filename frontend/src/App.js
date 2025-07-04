import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard'; // 👈 Import this

function App() {
return (
<Router>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/patient" element={<PatientDashboard />} />
<Route path="/doctor" element={<DoctorDashboard />} /> {/* 👈 Route added */}
</Routes>
</Router>
);
}

export default App;
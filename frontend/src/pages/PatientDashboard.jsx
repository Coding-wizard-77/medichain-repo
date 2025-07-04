import React from 'react';
import UploadForm from '../components/UploadForm';
import RecordViewer from '../components/RecordViewer';
import RequestList from '../components/RequestList';

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-indigo-700">Patient Dashboard</h1>
        <p className="text-md text-gray-600">Upload your medical records and manage access.</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Upload New Record</h2>
        <UploadForm />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Records</h2>
        <RecordViewer />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Access Requests</h2>
        <RequestList />
      </section>
    </div>
  );
}
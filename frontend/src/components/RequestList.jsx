import React from 'react';

export default function RequestViewer() {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>no request yet</li>
      
      </ul>
    </div>
  );
}

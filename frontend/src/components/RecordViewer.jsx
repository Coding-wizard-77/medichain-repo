import React, { useEffect, useState } from 'react';

export default function RecordViewer({ contract, account }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contract || !account) return;

    const fetchRecords = async () => {
      try {
        setLoading(true);
        const fetchedRecords = await contract.getMyRecords();
        setRecords(fetchedRecords);
      } catch (err) {
        console.error('Failed to fetch records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [contract, account]);

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-gray-600">Loading your records...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-500">No medical records found.</p>
      ) : (
        records.map((record, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4 border border-gray-200"
          >
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Uploaded By:</span> {record.uploadedBy}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Timestamp:</span>{' '}
              {new Date(Number(record.timestamp) * 1000).toLocaleString()}
            </p>
            <p className="text-blue-600 break-words">
              <span className="font-medium">IPFS Hash:</span>{' '}
              <a
                href={`https://ipfs.io/ipfs/${record.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {record.ipfsHash}
              </a>
            </p>
          </div>
        ))
      )}
    </div>
  );
}


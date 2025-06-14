import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function HistoryPage() {
  const { auth } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(history)
  // Fetch saved detections on mount
  useEffect(() => {
    if (!auth?.token) return;
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/detection-history/', {
      headers: { Authorization: `Token ${auth.token}` },
    })
    .then(res => setHistory(res.data.data))  // <-- here
    .catch(() => alert('Failed to load history'))
    .finally(() => setLoading(false));
  }, [auth]);

  // Delete a detection by ID
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/detection-delete/${id}/`, {
        headers: { Authorization: `Token ${auth.token}` },
      });
      setHistory(history.filter(item => item.id !== id));
    } catch {
      alert('Failed to delete record');
    }
  };

  if (!auth) return <p>Please login to view your detection history.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Detection History</h1>

      {loading && <p>Loading...</p>}

      {!loading && history.length === 0 && <p>No history found.</p>}

      <div className="space-y-6">
        {history.map(({ id, image, label, confidence, plant_name, disease_name }) => (
          <div key={id} className="flex items-center border rounded p-4 gap-4">
            <img
              src={`http://127.0.0.1:8000/${image}`}
              alt={label}
              className="w-32 h-32 object-cover rounded"
            />
            <div className="flex-1">
              <p><strong>Label:</strong> {label}</p>
              <p><strong>Confidence:</strong> {confidence}%</p>
              <p><strong>Plant:</strong> {plant_name}</p>
              <p><strong>Disease:</strong> {disease_name}</p>
            </div>
            <button
              onClick={() => handleDelete(id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

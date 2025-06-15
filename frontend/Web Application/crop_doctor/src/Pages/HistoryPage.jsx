import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiTrash2, FiInfo, FiLoader } from "react-icons/fi";

export default function HistoryPage() {
  const { auth } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch saved detections on mount
  useEffect(() => {
    if (!auth?.token) return;

    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/detection-history/", {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then((res) => setHistory(res.data.data))
      .catch(() => toast.error("Failed to load history"))
      .finally(() => setLoading(false));
  }, [auth]);

  // Delete a detection by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/detection-delete/${id}/`, {
        headers: { Authorization: `Token ${auth.token}` },
      });
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("Record deleted successfully!");
    } catch {
      toast.error("Failed to delete record");
    }
  };

  if (!auth)
    return (
      <p className="text-center mt-10 text-gray-600">
        Please login to view your detection history.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700 flex items-center gap-2">
        <FiInfo className="text-green-700" />
        Detection History
      </h1>

      {loading ? (
        <div className="flex justify-center my-16">
          <FiLoader className="animate-spin text-4xl text-green-600" />
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center text-gray-500 mt-16 space-y-3">
          <FiInfo className="text-6xl" />
          <p>No detection history found.</p>
        </div>
      ) : (
        <div
          className="space-y-6 overflow-y-auto border rounded p-4"
          style={{ maxHeight: "600px" }}
        >
          {history.map(
            ({ id, image, label, confidence, plant_name, disease_name }) => (
              <div
                key={id}
                className="flex items-center border rounded p-4 gap-6 shadow hover:shadow-lg transition-shadow"
              >
                <img
                  src={`http://127.0.0.1:8000/${image}`}
                  alt={label}
                  className="w-32 h-32 object-cover rounded"
                />
                <div className="flex-1 space-y-1 text-gray-700">
                  <p>
                    <strong>Label:</strong> {label}
                  </p>
                  <p>
                    <strong>Confidence:</strong> {confidence}%
                  </p>
                  <p>
                    <strong>Plant:</strong> {plant_name}
                  </p>
                  <p>
                    <strong>Disease:</strong> {disease_name}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                  title="Delete record"
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

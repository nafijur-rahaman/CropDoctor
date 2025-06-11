import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const Dashboard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) navigate("/login");
  }, [auth, navigate]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Welcome, {auth?.username} 👋</h1>

      <div className="flex flex-col gap-4 mt-6">
        <button
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => navigate("/add-disease")}
        >
          ➕ Add New Disease Report
        </button>

        <button
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/my-reports")}
        >
          📄 View My Reports
        </button>

        <button
          className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

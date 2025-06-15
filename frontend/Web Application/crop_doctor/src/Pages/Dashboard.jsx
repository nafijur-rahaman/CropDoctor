import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiEdit2, FiLock, FiClock, FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const menu = [
    { name: "Profile", to: "/dashboard/profile", icon: <FiUser size={20} /> },
    { name: "Update Profile", to: "/dashboard/update-profile", icon: <FiEdit2 size={20} /> },
    { name: "Change Password", to: "/dashboard/change-password", icon: <FiLock size={20} /> },
    { name: "Detection History", to: "/dashboard/detection-history", icon: <FiClock size={20} /> },
  ];

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();  // assuming logout returns a Promise
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-green-600 select-none">Dashboard</h2>
        <nav className="flex flex-col gap-4 flex-grow">
          {menu.map(({ name, to, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded hover:bg-green-100 text-lg transition-colors ${
                  isActive ? "bg-green-200 font-semibold" : "text-gray-700"
                }`
              }
            >
              <span className="text-green-600">{icon}</span>
              {name}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-3 text-left text-lg px-4 py-2 rounded hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <RotatingLines strokeColor="#dc2626" strokeWidth="3" width="20" visible={true} />
          ) : (
            <>
              <FiLogOut size={20} />
              Logout
            </>
          )}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-white shadow-inner rounded-l-lg overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

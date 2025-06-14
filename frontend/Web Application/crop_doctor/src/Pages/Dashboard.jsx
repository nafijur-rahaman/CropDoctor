import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menu = [
    { name: "Profile", to: "/dashboard/profile" },
    { name: "Update Profile", to: "/dashboard/update-profile" },
    { name: "Change Password", to: "/dashboard/change-password" },
    { name: "Detection History", to: "/dashboard/detection-history" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-8 text-green-600">Dashboard</h2>
        <nav className="flex flex-col gap-4">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-green-100 text-lg ${
                  isActive ? "bg-green-200 font-semibold" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-left text-lg px-4 py-2 rounded hover:bg-red-100 text-red-600"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}

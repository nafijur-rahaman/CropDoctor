import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-green-700">
              🌾 CropDoctor
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 font-semibold"
                  : "text-gray-700 hover:text-green-700 font-medium"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/detect"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 font-semibold"
                  : "text-gray-700 hover:text-green-700 font-medium"
              }
            >
              Disease Detection
            </NavLink>

            <NavLink
              to="/diseases"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 font-semibold"
                  : "text-gray-700 hover:text-green-700 font-medium"
              }
            >
              Disease Library
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-green-700 font-semibold"
                  : "text-gray-700 hover:text-green-700 font-medium"
              }
            >
              About
            </NavLink>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center justify-center space-x-4">
            {!auth ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <img
                  src={`http://127.0.0.1:8000${auth.image}`}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="text-gray-700 text-lg font-semibold">
                  {auth.username}
                </span>

                <Link
                  to="/dashboard"
                  className="text-black font-semibold hover:text-green-600"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

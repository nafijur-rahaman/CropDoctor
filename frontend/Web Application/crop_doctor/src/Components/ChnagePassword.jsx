import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiLock } from "react-icons/fi";
import { RotatingLines } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword() {
  const { auth } = useAuth();
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      return toast.error("New passwords do not match!");
    }

    try {
      setLoading(true);
      await axios.post(
        "http://127.0.0.1:8000/api/change-password/",
        {
          old_password: form.old_password,
          new_password: form.new_password,
        },
        {
          headers: {
            Authorization: `Token ${auth.token}`,
          },
        }
      );
      toast.success("Password changed successfully!");
      setForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-yellow-600">
        <FiLock size={28} />
        Change Password
      </h2>

      {loading && (
        <div className="flex justify-center mb-6">
          <RotatingLines strokeColor="#D97706" strokeWidth="4" width="36" visible={true} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`space-y-5 transition-opacity duration-300 ${loading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          type="password"
          name="old_password"
          placeholder="Current Password"
          value={form.old_password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
        <input
          type="password"
          name="new_password"
          placeholder="New Password"
          value={form.new_password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm New Password"
          value={form.confirm_password}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-md hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

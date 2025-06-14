import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const { auth } = useAuth();
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      return alert("New passwords do not match!");
    }

    try {
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
      alert("Password changed successfully!");
    } catch {
      alert("Failed to change password.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">🔐 Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="old_password"
          placeholder="Current Password"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          name="new_password"
          placeholder="New Password"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm New Password"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

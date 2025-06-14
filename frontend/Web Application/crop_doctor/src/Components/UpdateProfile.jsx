import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function UpdateProfile() {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    location: "",
    image: null,
  });

  useEffect(() => {
    if (!auth?.token) return;

    axios
      .get("http://127.0.0.1:8000/api/user-profile/", {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then((res) => {
        const { first_name, last_name, location } = res.data.data;
        setFormData((prev) => ({ ...prev, first_name, last_name, location }));
      })
      .catch(() => alert("Failed to load profile"));
  }, [auth]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("first_name", formData.first_name);
    form.append("last_name", formData.last_name);
    form.append("location", formData.location);
    if (formData.image) form.append("image", formData.image);

    try {
      await axios.put("http://127.0.0.1:8000/api/update-profile/", form, {
        headers: {
          Authorization: `Token ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully!");
    } catch {
      alert("Update failed.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">✏️ Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

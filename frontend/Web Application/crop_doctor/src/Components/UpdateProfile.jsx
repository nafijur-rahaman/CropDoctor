import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiEdit3, FiUpload } from "react-icons/fi";
import { RotatingLines } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateProfile() {
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    location: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!auth?.token) return;

    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/user-profile/", {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then((res) => {
        const { first_name, last_name, location, image } = res.data.data;
        setFormData((prev) => ({ ...prev, first_name, last_name, location }));
        if (image) setPreview(`http://127.0.0.1:8000${image}`);
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [auth]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
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
      setLoading(true);
      await axios.put("http://127.0.0.1:8000/api/update-profile/", form, {
        headers: {
          Authorization: `Token ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3 text-blue-600">
        <FiEdit3 size={28} />
        Update Profile
      </h2>

      {loading && (
        <div className="flex justify-center mb-6">
          <RotatingLines strokeColor="#2563EB" strokeWidth="4" width="36" visible={true} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`space-y-5 transition-opacity duration-300 ${loading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <div>
          <label htmlFor="first_name" className="block mb-1 font-medium text-gray-700">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block mb-1 font-medium text-gray-700">
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block mb-1 font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Profile Image</label>
          <label
            htmlFor="image"
            className="flex cursor-pointer items-center gap-2 border border-dashed border-gray-400 rounded-md px-4 py-3 hover:bg-blue-50 transition-colors text-gray-600"
          >
            <FiUpload size={20} />
            <span>{formData.image ? formData.image.name : "Choose a file..."}</span>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="hidden"
            />
          </label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-md border border-gray-300"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

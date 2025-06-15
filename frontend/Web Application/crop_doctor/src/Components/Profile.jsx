import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiUser, FiLoader, FiMapPin, FiUserCheck, FiUserPlus } from "react-icons/fi";
import { RotatingLines } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth?.token) return;

    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/user-profile/", {
        headers: { Authorization: `Token ${auth.token}` },
      })
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch(() => {
        toast.error("Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, [auth]);

  if (!auth)
    return (
      <p className="text-center mt-10 text-gray-600">Please login to view your profile.</p>
    );

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <RotatingLines strokeColor="#4F46E5" strokeWidth="4" width="48" visible={true} />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 flex items-center gap-3">
        <FiUser size={32} className="text-indigo-600" />
        Your Profile
      </h2>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <img
          src={`http://127.0.0.1:8000${profile.image}`}
          alt="Profile"
          className="w-36 h-36 md:w-40 md:h-40 object-cover rounded-full border-4 border-indigo-500 shadow-sm hover:shadow-lg transition-shadow duration-300"
        />
        <div className="flex-1 space-y-5">
          <InfoRow icon={<FiUserCheck />} label="Username" value={profile.username} />
          <InfoRow icon={<FiUserPlus />} label="First Name" value={profile.first_name} />
          <InfoRow icon={<FiUserPlus />} label="Last Name" value={profile.last_name} />
          <InfoRow icon={<FiMapPin />} label="Location" value={profile.location || "Not specified"} />
        </div>
      </div>
    </div>
  );
}

// Small reusable info row component with icon
function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-center gap-3 text-gray-700 text-lg">
      <span className="text-indigo-500">{icon}</span>
      <p>
        <span className="font-semibold">{label}:</span> {value}
      </p>
    </div>
  );
}

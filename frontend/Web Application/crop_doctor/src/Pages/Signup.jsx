import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/register/", form);
      if (res.data.success) {
        navigate("/login");
      }
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4 font-semibold">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="text" name="username" placeholder="Username" className="w-full p-2 border mb-3 rounded" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="w-full p-2 border mb-3 rounded" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 border mb-3 rounded" onChange={handleChange} required />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Signup;

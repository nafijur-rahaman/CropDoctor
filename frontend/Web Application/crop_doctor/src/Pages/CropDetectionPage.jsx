import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { FaUpload, FaFlask, FaBan, FaVideo } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { FaLeaf } from "react-icons/fa";


export default function CropDetectionPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/api/predict/", formData);
      setResult(res.data);
      toast.success("Detection successful!");

      if (auth?.token) {
        const saveForm = new FormData();
        saveForm.append("image", image);
        saveForm.append("label", res.data.label);
        saveForm.append("confidence", res.data.confidence);
        saveForm.append("plant_name", res.data.plant_name);
        saveForm.append("disease_name", res.data.disease_name);

        await axios.post("http://127.0.0.1:8000/api/save-detection-history/", saveForm, {
          headers: {
            Authorization: `Token ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
    } catch (error) {
      toast.error("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
           Crop Disease Detection
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side: Input + Preview + Button */}
          <div className="md:w-1/2 flex flex-col items-center">
            <label
              htmlFor="image-upload"
              className="mb-6 flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-300 hover:bg-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 p-2.5"
            >
              <FaUpload className="text-green-600" size={20} />
              <span>Select Image</span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-64 h-64 object-cover rounded-md border"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-200 rounded-md border text-gray-500">
                <FaBan size={40} className="mr-2" />
                No Image Selected
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !image}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <RotatingLines
                  strokeColor="#fff"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="24"
                  visible={true}
                />
              ) : (
                "Detect Disease"
              )}
            </button>
          </div>

          {/* Right side: Result display */}
          <div className="md:w-1/2">
            {result ? (
              <>
                <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                  <FaFlask /> Result
                </h2>
                <p>
                  <strong>Label:</strong> {result.label}
                </p>
                <p>
                  <strong>Confidence:</strong> {result.confidence}%
                </p>
                <p>
                  <strong>Plant:</strong> {result.plant_name}
                </p>
                <p>
                  <strong>Disease:</strong> {result.disease_name}
                </p>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Treatment Solutions:</h3>
                  {result.solutions.map((sol, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-100 p-4 mb-3 rounded-md border-l-4 border-green-500"
                    >
                      <p className="mb-1">
                        <strong>Type:</strong> {sol.treatment_type || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Solution:</strong> {sol.solution_text}
                      </p>
                      {sol.product_name && (
                        <p>
                          <strong>Product:</strong> {sol.product_name}
                        </p>
                      )}
                      {sol.application_instructions && (
                        <p>
                          <strong>Instructions:</strong> {sol.application_instructions}
                        </p>
                      )}
                      {sol.video_url && (
                        <a
                          href={sol.video_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline flex items-center gap-1"
                        >
                          <FaVideo /> Watch Video
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-500 italic text-center mt-20 flex items-center justify-center gap-2">
                <FaBan size={30} />
                No result to show. Please upload an image and click "Detect Disease".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

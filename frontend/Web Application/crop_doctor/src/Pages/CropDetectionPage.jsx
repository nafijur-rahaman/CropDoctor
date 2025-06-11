import { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

export default function CropDetectionPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const {auth}= useAuth()
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
    formData.append('image', image);

    try {
      setLoading(true);

      // First: Predict
      const res = await axios.post('http://127.0.0.1:8000/api/predict/', formData);
      setResult(res.data);

      // Then: If logged in, save result
      if (auth?.token) {
        const saveForm = new FormData();
        saveForm.append('image', image);
        saveForm.append('label', res.data.label);
        saveForm.append('confidence', res.data.confidence);
        saveForm.append('plant_name', res.data.plant_name);
        saveForm.append('disease_name', res.data.disease_name);

        await axios.post('http://127.0.0.1:8000/api/save-detection-history/', saveForm, {
          headers: {
            Authorization: `Token ${auth.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
    } catch (error) {
      alert('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">🌾 Crop Disease Detection</h1>

        <div className="flex flex-col items-center gap-4">
          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-64 h-64 object-cover rounded-md border"
            />
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mt-4 shadow disabled:opacity-50"
          >
            {loading ? 'Detecting...' : 'Detect Disease'}
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-green-700 mb-2">🧪 Result</h2>
            <p><strong>Label:</strong> {result.label}</p>
            <p><strong>Confidence:</strong> {result.confidence}%</p>
            <p><strong>Plant:</strong> {result.plant_name}</p>
            <p><strong>Disease:</strong> {result.disease_name}</p>

            {/* Solutions */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Treatment Solutions:</h3>
              {result.solutions.map((sol, idx) => (
                <div key={idx} className="bg-gray-100 p-4 mb-3 rounded-md border-l-4 border-green-500">
                  <p className="mb-1"><strong>Type:</strong> {sol.treatment_type || 'N/A'}</p>
                  <p className="mb-1"><strong>Solution:</strong> {sol.solution_text}</p>
                  {sol.product_name && <p><strong>Product:</strong> {sol.product_name}</p>}
                  {sol.application_instructions && (
                    <p><strong>Instructions:</strong> {sol.application_instructions}</p>
                  )}
                  {sol.video_url && (
                    <a
                      href={sol.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Watch Video
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

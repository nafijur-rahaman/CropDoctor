import React, { useEffect, useState } from "react";
import { FaLeaf, FaSearch } from "react-icons/fa";

function DiseaseLibrary() {
  const [diseases, setDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/diseases/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch diseases");
        return res.json();
      })
      .then((data) => {
        setDiseases(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter diseases based on search term
  const filteredDiseases = diseases.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.plant_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-green-700 flex items-center gap-3">
        <FaLeaf /> Disease Library
      </h1>

      <div className="relative mb-6 max-w-md">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="search"
          placeholder="Search by disease or plant name..."
          className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading diseases...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-lg font-semibold">{error}</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Disease List */}
          <ul className="md:w-1/3 max-h-[600px] overflow-y-auto border border-gray-200 rounded-lg shadow-sm bg-white">
            {filteredDiseases.length === 0 ? (
              <li className="p-4 text-center text-gray-500 italic select-none">
                No diseases found
              </li>
            ) : (
              filteredDiseases.map((disease) => (
                <li
                  key={disease.id}
                  className={`cursor-pointer px-4 py-3 border-b last:border-b-0 hover:bg-green-50 transition rounded-r-lg ${
                    selectedDisease?.id === disease.id
                      ? "bg-green-100 font-semibold text-green-700 border-l-4 border-green-500"
                      : "text-gray-700"
                  }`}
                  onClick={() => setSelectedDisease(disease)}
                >
                  <span className="block text-lg">{disease.name}</span>
                  <span className="text-sm text-gray-500 italic">{disease.plant_name}</span>
                </li>
              ))
            )}
          </ul>

          {/* Disease Details or Placeholder */}
          <div className="md:w-2/3 min-h-[600px] border border-gray-200 rounded-lg shadow-sm bg-white p-6 overflow-auto">
            {selectedDisease ? (
              <>
                <h2 className="text-3xl font-bold mb-4 text-green-700">
                  {selectedDisease.name}
                </h2>
                <p className="text-xl italic mb-4 text-gray-600">
                  Plant: {selectedDisease.plant_name}
                </p>

                <img
                  src={selectedDisease.image}
                  alt={`${selectedDisease.name} on ${selectedDisease.plant_name}`}
                  className="mb-6 w-full max-h-72 object-contain rounded-md shadow"
                />

                <p className="mb-6 text-gray-800 leading-relaxed">
                  {selectedDisease.symptoms}
                </p>

                <h3 className="text-2xl font-semibold mb-4 text-green-600">
                  Treatment Solutions
                </h3>
                {selectedDisease.solutions.length === 0 ? (
                  <p className="text-gray-500 italic">No solutions available.</p>
                ) : (
                  <ul className="space-y-5">
                    {selectedDisease.solutions.map((sol) => (
                      <li
                        key={sol.id}
                        className="p-4 border rounded-md bg-green-50 shadow-sm"
                      >
                        <p>
                          <strong>Treatment Type:</strong> {sol.treatment_type || "N/A"}
                        </p>
                        <p>
                          <strong>Product:</strong> {sol.product_name || "N/A"}
                        </p>
                        <p>
                          <strong>Instructions:</strong> {sol.application_instructions || "N/A"}
                        </p>
                        {sol.video_url && (
                          <video
                            src={sol.video_url}
                            controls
                            className="mt-3 rounded-md w-full max-h-48 object-cover shadow"
                          />
                        )}
                        <p className="mt-3">{sol.solution_text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-start h-full text-center text-gray-400 select-none">
                <FaLeaf size={80} className="mb-6 opacity-40" />
                <p className="text-xl font-semibold mb-2">Select a disease to view details</p>
                <p className="max-w-md">
                  Browse the list on the left or use the search above to find a disease or plant.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiseaseLibrary;

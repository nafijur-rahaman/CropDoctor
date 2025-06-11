import React, { useEffect, useState } from "react";

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Disease Library</h1>

      <input
        type="search"
        placeholder="Search by disease or plant name..."
        className="w-full p-2 mb-6 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p>Loading diseases...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex flex-col md:flex-row gap-6">
        <ul className="md:w-1/3 max-h-[500px] overflow-y-auto border rounded p-2">
          {filteredDiseases.length === 0 && <li>No diseases found</li>}
          {filteredDiseases.map((disease) => (
            <li
              key={disease.id}
              className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
                selectedDisease?.id === disease.id ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedDisease(disease)}
            >
              <strong>{disease.name}</strong> - <em>{disease.plant_name}</em>
            </li>
          ))}
        </ul>

        {selectedDisease && (
          <div className="md:w-2/3 border rounded p-4 overflow-auto max-h-[500px]">
            <h2 className="text-2xl font-semibold mb-2">{selectedDisease.name}</h2>
            <p className="italic mb-4">Plant: {selectedDisease.plant_name}</p>

            <img
              src={selectedDisease.image}
              alt={`${selectedDisease.name} on ${selectedDisease.plant_name}`}
              className="mb-4 max-h-64 object-contain"
            />

            <p className="mb-4">{selectedDisease.symptoms}</p>

            <h3 className="text-xl font-semibold mb-2">Solutions:</h3>
            {selectedDisease.solutions.length === 0 ? (
              <p>No solutions available.</p>
            ) : (
              <ul className="space-y-4">
                {selectedDisease.solutions.map((sol) => (
                  <li key={sol.id} className="border rounded p-3 bg-gray-50">
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
                        className="mt-2 max-w-full h-auto rounded"
                      />
                    )}
                    <p className="mt-2">{sol.solution_text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DiseaseLibrary;

import React from 'react';

const teamMembers = [
  {
    name: "Tanjid Nafis",
    image: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Moynapakhi",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Md. Nafijur Rahaman",
    image: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Your Name",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "Your Name",
    image: "https://i.pravatar.cc/150?img=4",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-green-700 text-center mb-6">About Us</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
          We are on a mission to help farmers detect crop diseases early using AI technology. Our platform empowers users to protect their crops, reduce losses, and increase yields sustainably.
        </p>

        {/* Hero Image */}
        <div className="mb-10">
          <img
            src="plant-growing-from-soil.jpg"
            alt="Agriculture AI"
            className="w-full rounded-xl shadow-md"
          />
        </div>

        {/* Mission */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Our Mission</h2>
          <p className="text-gray-700">
            Our goal is to bridge the gap between technology and farming. With our AI-based detection tools, we help farmers diagnose diseases with ease and accuracy.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Key Features</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>AI-powered crop disease detection</li>
            <li>Treatment solutions with video guides</li>
            <li>Detection history saving and review</li>
            <li>Simple and user-friendly interface</li>
          </ul>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow hover:shadow-md p-4 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-2"
                />
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

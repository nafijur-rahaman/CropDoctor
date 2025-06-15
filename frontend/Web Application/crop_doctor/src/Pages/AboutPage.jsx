import React from 'react';

const teamMembers = [
    {
      name: "Md. Nafijur Rahaman",
      image: "/nafi.jpg",
    },

  {
    name: "Alhanullah Sajib",
    image: "/sajib.jpg",
  },
  {
    name: "Shad Mohammad",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Vasha Quddus",
    image: "https://i.pravatar.cc/150?img=4",
  },
  {
    name: "Sadia Afrin Khan",
    image: "ira.jpeg",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-white min-h-screen py-16 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-green-700 text-center mb-10 drop-shadow-sm">
          About Us
        </h1>
        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-16 text-lg leading-relaxed">
          We are on a mission to help farmers detect crop diseases early using AI technology. Our platform empowers users to protect their crops, reduce losses, and increase yields sustainably.
        </p>

        {/* Hero Image */}
        <div className="mb-16 rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto">
          <img
            src="plant-growing-from-soil.jpg"
            alt="Agriculture AI"
            className="w-full object-cover"
          />
        </div>

        {/* Mission */}
        <section className="mb-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-green-700 mb-6 border-b-4 border-green-300 inline-block pb-2">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our goal is to bridge the gap between technology and farming. With our AI-based detection tools, we help farmers diagnose diseases with ease and accuracy.
          </p>
        </section>

        {/* Features */}
        <section className="mb-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-green-700 mb-8 border-b-4 border-green-300 inline-block pb-2">
            Key Features
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-gray-700 text-lg list-disc list-inside">
            <li>AI-powered crop disease detection</li>
            <li>Treatment solutions with video guides</li>
            <li>Detection history saving and review</li>
            <li>Simple and user-friendly interface</li>
          </ul>
        </section>

{/* Team Section */}
<section className="max-w-6xl mx-auto">
  <h2 className="text-3xl font-semibold text-green-700 mb-12 text-center border-b-4 border-green-300 inline-block pb-2">
    Our Team
  </h2>

  {/* Top row: 4 members */}
  <div className="grid grid-cols-4 gap-10 mb-12">
    {teamMembers.slice(0, 4).map((member, idx) => (
      <div
        key={idx}
        className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transform transition-transform duration-300"
      >
        <img
          src={member.image}
          alt={member.name}
          className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-green-300"
        />
        <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
      </div>
    ))}
  </div>

  {/* Bottom row: 1 member centered */}
  <div className="grid grid-cols-3 gap-10">
    <div></div> {/* empty for centering */}
    {teamMembers.slice(4, 5).map((member, idx) => (
      <div
        key={idx + 4}
        className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transform transition-transform duration-300"
      >
        <img
          src={member.image}
          alt={member.name}
          className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-green-300"
        />
        <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
      </div>
    ))}
    <div></div> {/* empty for centering */}
  </div>
</section>

      </div>
    </div>
  );
}

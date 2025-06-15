import { Link } from 'react-router';
import { motion } from 'framer-motion';


const Home = () => {
 return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold mb-4 text-green-700"
          >
            Welcome to CropDoctor
          </motion.h1>
          <p className="text-xl text-gray-700 mb-8">
            Detect crop diseases in real-time using AI. Stay ahead, protect your plants.
          </p>
          <div className="space-x-4">
            <Link
              to="/detect"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md shadow-md transition"
            >
              Try Disease Detection
            </Link>
            <Link
              to="/diseases"
              className="bg-white border border-green-600 text-green-700 px-6 py-3 rounded-md shadow-md hover:bg-green-50"
            >
              Browse Disease Library
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-12">Why Use CropDoctor?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Real-time Disease Detection"
              description="Upload a crop image and get instant AI-based diagnosis with confidence score."
              icon="🧠"
            />
            <FeatureCard
              title="Anonymous Mode"
              description="No login needed! Use it anonymously if you're in a hurry or want to test quickly."
              icon="👤"
            />
            <FeatureCard
              title="Full Disease Library"
              description="Find solutions by disease name, plant name, or treatment recommendations."
              icon="📚"
            />
          </div>
        </div>
      </section>

      {/* Testimonials / Reviews (Optional) */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-semibold mb-6 text-green-700">What Farmers Are Saying</h2>
          <blockquote className="text-lg italic text-gray-600">
            “CropDoctor saved my tomato farm! It detected early blight and gave treatment options
            I never knew existed. Total game changer.” <br />
            <span className="mt-2 block font-semibold text-green-600">– Abdul Karim, Farmer</span>
          </blockquote>
        </div>
      </section>
    </div>
  );
};
function FeatureCard({ title, description, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white shadow-lg rounded-xl p-6 text-center border-t-4 border-green-600"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
export default Home;



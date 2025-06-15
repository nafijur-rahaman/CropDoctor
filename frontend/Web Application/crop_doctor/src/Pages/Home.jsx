import { Link } from "react-router";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white text-gray-900"
    >
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            "url('/bannerimg2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

        <div className="relative z-10 max-w-4xl px-6 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Welcome to <span className="text-green-400">CropDoctor</span>
          </h1>
          <p className="text-xl md:text-2xl font-semibold mb-8 drop-shadow-md">
            Detect crop diseases in real-time using AI. Stay ahead, protect your plants.
          </p>

          <Link
            to="/detect"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Start Detecting
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-green-700 mb-16 drop-shadow-sm">
            Why Use CropDoctor?
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
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

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-8 text-green-700 drop-shadow-sm">
            What Farmers Are Saying
          </h2>
          <blockquote className="text-lg italic text-gray-700 relative px-8 before:absolute before:left-2 before:top-0 before:text-green-400 before:text-7xl before:content-['“'] after:absolute after:right-2 after:bottom-0 after:text-green-400 after:text-7xl after:content-['”']">
            CropDoctor saved my tomato farm! It detected early blight and gave treatment options I never knew existed. Total game changer.
            <footer className="mt-4 font-semibold text-green-600">– Abdul Karim, Farmer</footer>
          </blockquote>
        </div>
      </section>
    </motion.div>
  );
};

function FeatureCard({ title, description, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.07, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white shadow-lg rounded-xl p-8 text-center border-t-8 border-green-600 cursor-pointer select-none"
    >
      <div className="text-6xl mb-6">{icon}</div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-700 text-base leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default Home;

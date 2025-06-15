import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-9xl font-extrabold text-green-600 mb-6">404</h1>
      <p className="text-2xl font-semibold mb-4 text-gray-800">Page Not Found</p>
      <p className="text-gray-600 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow"
      >
        Go to Home
      </Link>
    </div>
  );
}

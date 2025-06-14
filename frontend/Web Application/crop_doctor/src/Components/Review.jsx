import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ReviewComponent() {
  const { auth } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/get-all-review/');
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please enter a comment.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await axios.post('http://127.0.0.1:8000/api/review/', 
        { rating, comment },
        {
          headers: {
            Authorization: `Token ${auth?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">Leave a Review</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block mb-2 font-medium" htmlFor="rating">Rating</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mb-4 w-full p-2 border rounded"
        >
          {[5,4,3,2,1].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
          ))}
        </select>

        <label className="block mb-2 font-medium" htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="mb-4 w-full p-2 border rounded resize-none"
          placeholder="Write your review here..."
          required
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-4 text-green-700">All Reviews</h3>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((rev) => (
            <li key={rev.id} className="border p-4 rounded shadow-sm bg-gray-50">
              <div className="flex items-center mb-2">
                <div className="text-yellow-500 mr-2">
                  {'⭐'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating)}
                </div>
                <span className="text-gray-700 font-medium">{rev.user || 'Anonymous'}</span>
                <span className="ml-auto text-gray-400 text-sm">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-800">{rev.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

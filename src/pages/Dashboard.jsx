import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBooks } from "../store/slices/booksSlice";
import Layout from "../components/layout/Layout";

export default function Dashboard() {
  const { books, loading, error } = useSelector((state) => state.books);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  return (
    <Layout>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Books</h2>

        {loading && <p>Loading books...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && books.length === 0 && (
          <p>No books found.</p>
        )}

        <div className="grid grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book._id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">
                {book.author}
              </p>
              <p className="text-sm mt-2">
                Available: {book.availableCopies}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
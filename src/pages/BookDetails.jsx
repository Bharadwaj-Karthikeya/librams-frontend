import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookById } from "../store/slices/booksSlice";
import Layout from "../components/layout/Layout";

export default function BookDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedBook } = useSelector(
    (state) => state.books
  );

  useEffect(() => {
    dispatch(fetchBookById(id));
  }, [dispatch, id]);

  if (!selectedBook) return null;

  return (
    <Layout>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          {selectedBook.title}
        </h2>

        <p>Author: {selectedBook.author}</p>
        <p>Category: {selectedBook.category}</p>
        <p>Published: {selectedBook.publishedYear}</p>
        <p>
          Available Copies:{" "}
          {selectedBook.availableCopies}
        </p>
      </div>
    </Layout>
  );
}
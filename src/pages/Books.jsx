import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
  deleteBookPermanently,
} from "../store/slices/booksSlice";
import Layout from "../components/layout/Layout";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ui/ConfirmModal";
import BookForm from "../components/books/BookForm";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Books() {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  /* ---------------- CREATE ---------------- */
  const handleCreate = async (data) => {
    const result = await dispatch(createBook(data));

    if (!result.error) {
      toast.success("Book created");
      setShowCreate(false);
    } else {
      toast.error(result.payload);
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = async (data) => {
    const result = await dispatch(
      updateBook({
        bookId: editingBook._id,
        data,
      })
    );

    if (!result.error) {
      toast.success("Book updated");
      setShowEdit(false);
      setEditingBook(null);
    } else {
      toast.error(result.payload);
    }
  };

  /* ---------------- SEARCH ---------------- */
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Books</h2>

          {(user?.role === "admin" ||
            user?.role === "staff") && (
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              + Add Book
            </button>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by title..."
          className="w-full mb-6 p-2 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* States */}
        {loading && <p>Loading books...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && filteredBooks.length === 0 && (
          <p>No books found.</p>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="border p-4 rounded-lg hover:shadow-md transition"
            >
              <Link to={`/books/${book._id}`}>
                <h3 className="font-semibold">
                  {book.title}
                </h3>
              </Link>

              <p className="text-sm text-gray-600">
                {book.author}
              </p>

              <p className="text-sm mt-2">
                Available: {book.availableCopies}
              </p>

              {/* Status Badges */}
              <div className="flex gap-2 mt-2">
                {!book.isActive && (
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    Inactive
                  </span>
                )}

                {!book.isAvailableforIssue && (
                  <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                    Not Issuable
                  </span>
                )}
              </div>

              {/* Admin Controls */}
              {(user?.role === "admin" ||
                user?.role === "staff") && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setEditingBook(book);
                      setShowEdit(true);
                    }}
                    className="text-yellow-600 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setConfirmState({
                        type: "soft",
                        bookId: book._id,
                      })
                    }
                    className="text-red-600 text-sm"
                  >
                    Soft Delete
                  </button>

                  {user?.role === "admin" && (
                    <button
                      onClick={() =>
                        setConfirmState({
                          type: "hard",
                          bookId: book._id,
                        })
                      }
                      className="text-red-800 text-sm"
                    >
                      Hard Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)}>
          <h2 className="text-lg font-semibold mb-4">
            Create Book
          </h2>
          <BookForm
            onSubmit={handleCreate}
            loading={loading}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEdit && editingBook && (
        <Modal
          onClose={() => {
            setShowEdit(false);
            setEditingBook(null);
          }}
        >
          <h2 className="text-lg font-semibold mb-4">
            Edit Book
          </h2>
          <BookForm
            initialData={editingBook}
            onSubmit={handleEdit}
            loading={loading}
          />
        </Modal>
      )}

      {/* CONFIRM MODAL */}
      {confirmState && (
        <ConfirmModal
          title={
            confirmState.type === "hard"
              ? "Permanent Delete"
              : "Deactivate Book"
          }
          message={
            confirmState.type === "hard"
              ? "This will permanently remove the book from the database."
              : "This will mark the book as inactive."
          }
          confirmText="Proceed"
          onCancel={() => setConfirmState(null)}
          onConfirm={async () => {
            let result;

            if (confirmState.type === "soft") {
              result = await dispatch(
                deleteBook(confirmState.bookId)
              );
            } else {
              result = await dispatch(
                deleteBookPermanently(
                  confirmState.bookId
                )
              );
            }

            if (!result.error) {
              toast.success("Action successful");
            } else {
              toast.error(result.payload);
            }

            setConfirmState(null);
          }}
        />
      )}
    </Layout>
  );
}
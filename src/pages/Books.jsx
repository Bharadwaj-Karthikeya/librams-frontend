import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
  deleteBookPermanently,
  searchBooksByTerm,
  fetchBooksByCategory,
} from "../store/slices/booksSlice";
import Layout from "../components/layout/Layout";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ui/ConfirmModal";
import BookForm from "../components/books/BookForm";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Books() {
  const dispatch = useDispatch();
  const { books, allBooks, loading, error } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalState, setModalState] = useState({ type: null, book: null });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const lastSearchTerm = useRef("");

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch.length >= 1) {
      lastSearchTerm.current = debouncedSearch;
      dispatch(searchBooksByTerm(debouncedSearch));
      return;
    }

    if (
      debouncedSearch.length === 0 &&
      lastSearchTerm.current.length >= 1
    ) {
      lastSearchTerm.current = "";
      if (selectedCategory === "all") {
        dispatch(fetchBooks());
      } else {
        dispatch(fetchBooksByCategory(selectedCategory));
      }
    }
  }, [debouncedSearch, dispatch, selectedCategory]);

  const categories = useMemo(() => {
    const unique = new Set();
    allBooks.forEach((book) => {
      if (book.category) {
        unique.add(book.category);
      }
    });
    return Array.from(unique);
  }, [allBooks]);

  const openModal = (type, book = null) => {
    setModalState({ type, book });
    setIsEditing(type === "create");
  };

  const closeModal = () => {
    setModalState({ type: null, book: null });
    setIsEditing(false);
  };

  /* ---------------- CREATE ---------------- */
  const handleCreate = async (data) => {
    const result = await dispatch(createBook(data));

    if (!result.error) {
      toast.success("Book created");
      closeModal();
    } else {
      toast.error(result.payload);
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = async (data) => {
    if (!modalState.book) return;
    const result = await dispatch(
      updateBook({
        bookId: modalState.book._id,
        data,
      })
    );

    if (!result.error) {
      toast.success("Book updated");
      closeModal();
    } else {
      toast.error(result.payload);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearch("");
    lastSearchTerm.current = "";

    if (category === "all") {
      dispatch(fetchBooks());
    } else {
      dispatch(fetchBooksByCategory(category));
    }
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Books</h2>

          {(user?.role === "admin" ||
            user?.role === "staff") && (
            <button
              onClick={() => openModal("create")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              + Add Book
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search books"
            className="w-full p-2 border rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Server search starts after a short pause.
          </p>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-3 py-1 rounded-full text-sm border ${selectedCategory === "all" ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1 rounded-full text-sm border ${selectedCategory === category ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* States */}
        {loading && <p>Loading books...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && books.length === 0 && (
          <p>No books found.</p>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="flex gap-4 border p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={book.bookCover}
                alt={`${book.title} cover`}
                className="w-28 h-36 object-cover rounded-lg border"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/books/${book._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Category: {book.category || "—"}
                  </p>
                  <p className="text-sm mt-2 font-medium">
                    Available Copies: {book.availableCopies}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {!book.isActive && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-200">
                        Inactive
                      </span>
                    )}

                    {!book.isAvailableforIssue && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200">
                        Not Issuable
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openModal("details", book)}
                  className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM MODAL */}
      {modalState.type && (
        <Modal onClose={closeModal}>
          <div className="w-full ">
            <div className="flex flex-wrap items-center justify-between gap-3 ">
              <div>
                <h2 className="text-xl font-semibold">
                  {modalState.type === "create"
                    ? "Add Book"
                    : isEditing
                      ? "Edit Book"
                      : "Book Details"}
                </h2>
                {modalState.book && (
                  <p className="text-sm text-gray-500">ISBN: {modalState.book.isbn}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {modalState.type === "details" && (user?.role === "admin" || user?.role === "staff") && (
                  <button
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="px-4 py-2 text-sm rounded-md border border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    {isEditing ? "Cancel Editing" : "Edit Book"}
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>

            <BookForm
              initialData={modalState.book}
              onSubmit={modalState.type === "create" ? handleCreate : handleEdit}
              loading={loading}
              readOnly={modalState.type === "details" && !isEditing}
            />

            {modalState.type === "details" && (user?.role === "admin" || user?.role === "staff") && (
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() =>
                    setConfirmState({
                      type: "soft",
                      bookId: modalState.book._id,
                    })
                  }
                  className="px-4 py-2 rounded-md text-sm border border-yellow-300 text-yellow-700"
                >
                  Soft Delete
                </button>

                {user?.role === "admin" && (
                  <button
                    onClick={() =>
                      setConfirmState({
                        type: "hard",
                        bookId: modalState.book._id,
                      })
                    }
                    className="px-4 py-2 rounded-md text-sm border border-red-300 text-red-700"
                  >
                    Hard Delete
                  </button>
                )}
              </div>
            )}
          </div>
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
              closeModal();
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
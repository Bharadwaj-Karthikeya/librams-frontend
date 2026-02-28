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
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
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
    if (debouncedSearch.length >= 2) {
      lastSearchTerm.current = debouncedSearch;
      dispatch(searchBooksByTerm(debouncedSearch));
      return;
    }

    if (
      debouncedSearch.length === 0 &&
      lastSearchTerm.current.length >= 2
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
              onClick={() => setShowCreate(true)}
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
            placeholder="Search books (min. 2 characters)"
            className="w-full p-2 border rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Searches run against the server after you stop typing.
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
        <div className="grid grid-cols-3 gap-4">
          {books.map((book) => (
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
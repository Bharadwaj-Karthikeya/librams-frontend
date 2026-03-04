import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout.jsx";
import Modal from "../components/ui/Modal.jsx";
import ConfirmModal from "../components/ui/ConfirmModal.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import FilterPill from "../components/ui/FilterPill.jsx";
import { Plus } from "lucide-react";
import BookForm from "../components/Books/BookForm.jsx";
import BookDetailsSummary from "../components/Books/BookDetailsSummary.jsx";
import BookList from "../components/Books/BookList.jsx";
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBookPermanently,
  searchBooksByTerm,
} from "../store/slices/booksSlice.js";
import {
  fetchBookIssueHistory,
  fetchIssueDetails,
} from "../store/slices/issueSlice.js";
import useAuth from "../hooks/useAuth.js";

const splitCategories = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeCategoryKey = (value) => value.trim().toLowerCase();

export default function Books() {
  const dispatch = useDispatch();
  const { books, allBooks, loading, error } = useSelector((state) => state.books);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalState, setModalState] = useState({ type: null, book: null });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [historyDetail, setHistoryDetail] = useState(null);
  const [historyDetailLoading, setHistoryDetailLoading] = useState(false);
  const { user, canManageBooks } = useAuth();
  const [historyDetailId, setHistoryDetailId] = useState(null);
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

    if (debouncedSearch.length === 0 && lastSearchTerm.current.length >= 1) {
      lastSearchTerm.current = "";
      dispatch(fetchBooks());
    }
  }, [debouncedSearch, dispatch]);

  const categories = useMemo(() => {
    const source = allBooks.length ? allBooks : books;
    const unique = new Map();
    source.forEach((book) => {
      splitCategories(book.category).forEach((category) => {
        const key = normalizeCategoryKey(category);
        if (!unique.has(key)) {
          unique.set(key, category);
        }
      });
    });
    return Array.from(unique.values());
  }, [allBooks, books]);

  const displayedBooks = useMemo(() => {
    const baseBooks = debouncedSearch.length >= 1
      ? books
      : allBooks.length
        ? allBooks
        : books;

    if (selectedCategory === "all") {
      return baseBooks;
    }

    const selectedKey = normalizeCategoryKey(selectedCategory);
    return baseBooks.filter((book) => {
      const categoryKeys = splitCategories(book.category).map(normalizeCategoryKey);
      return categoryKeys.includes(selectedKey);
    });
  }, [allBooks, books, debouncedSearch, selectedCategory]);

  const availableTitles = useMemo(
    () => displayedBooks.filter((book) => (book.availableCopies || 0) > 0).length,
    [displayedBooks]
  );

  const openModal = (type, book = null) => {
    setModalState({ type, book });
    setIsEditing(type === "create");
  };

  const closeHistoryPanel = () => {
    setShowHistoryPanel(false);
    setHistoryEntries([]);
    setHistoryError(null);
    setHistoryDetail(null);
    setHistoryDetailId(null);
  };

  const closeModal = () => {
    setModalState({ type: null, book: null });
    setIsEditing(false);
    closeHistoryPanel();
  };

  const loadIssueHistory = (bookId) => {
    if (!bookId) return;
    setHistoryLoading(true);
    setHistoryError(null);
    dispatch(fetchBookIssueHistory(bookId))
      .unwrap()
      .then((data) => {
        setHistoryEntries(data?.history || []);
      })
      .catch(() => {
        setHistoryEntries([]);
        setHistoryError("Unable to load issue history right now.");
      })
      .finally(() => {
        setHistoryLoading(false);
      });
  };

  const openHistoryPanel = () => {
    if (!modalState.book || !canManageBooks) return;
    setShowHistoryPanel(true);
    loadIssueHistory(modalState.book._id);
  };

  const viewHistoryDetail = async (issueId) => {
    if (!issueId) return;
    setHistoryDetailLoading(true);
    setHistoryDetailId(issueId);
    try {
      const data = await dispatch(fetchIssueDetails(issueId)).unwrap();
      setHistoryDetail(data.issue || null);
    } catch {
      setHistoryDetail(null);
      toast.error("Unable to load issue details right now.");
    } finally {
      setHistoryDetailLoading(false);
      setHistoryDetailId(null);
    }
  };

  const handleCreate = async (data) => {
    const result = await dispatch(createBook(data));
    if (!result.error) {
      toast.success("Book created");
      closeModal();
    } else {
      toast.error(result.payload);
    }
  };

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
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Catalog
            </p>
            <h2 className="text-2xl font-semibold text-[var(--text-strong)]">Books</h2>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              Browse, search, and manage the full collection.
            </p>
          </div>

          {canManageBooks && (
            <Button onClick={() => openModal("create")}>
              <span className="inline-flex items-center justify-center gap-2">
                <Plus size={16} />
                Add book
              </span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Total titles
            </p>
            <p className="text-2xl font-semibold text-[var(--text-strong)] mt-2">
              {displayedBooks.length}
            </p>
          </div>
          <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Available now
            </p>
            <p className="text-2xl font-semibold text-[var(--text-strong)] mt-2">
              {availableTitles}
            </p>
          </div>
          <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Categories
            </p>
            <p className="text-2xl font-semibold text-[var(--text-strong)] mt-2">
              {categories.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Input
              type="text"
              placeholder="Search books by title, author, or ISBN"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Server search starts after a short pause.
            </p>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={selectedCategory === "all"}
              onClick={() => handleCategoryChange("all")}
            >
              All
            </FilterPill>
            {categories.map((category) => (
              <FilterPill
                key={category}
                active={selectedCategory === category}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </FilterPill>
            ))}
          </div>
        )}

        {loading && <p>Loading books...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && displayedBooks.length === 0 && <p>No books found.</p>}

        {!loading && displayedBooks.length > 0 && (
          <BookList
            books={displayedBooks}
            onView={(book) => openModal("details", book)}
          />
        )}
      </div>

      {modalState.type && (
        <Modal
          onClose={closeModal}
          contentClassName={
            modalState.type === "details" && !isEditing ? "max-w-2xl" : ""
          }
          scrollable={!(modalState.type === "details" && !isEditing)}
        >
          <div className="w-full">
              <div >
                <h2 className="text-xl font-semibold">
                  {modalState.type === "create"
                    ? "Add Book"
                    : isEditing
                      ? "Edit Book"
                      : "Book Details"}
                </h2>
              </div>

            {modalState.type === "details" && !isEditing ? (
              <BookDetailsSummary
                book={modalState.book}
                onEdit={canManageBooks ? () => setIsEditing(true) : undefined}
                onViewHistory={canManageBooks ? openHistoryPanel : undefined}
                onDeletePermanent={
                  user?.role === "admin"
                    ? () =>
                        setConfirmState({
                          type: "hard",
                          bookId: modalState.book._id,
                        })
                    : undefined
                }
                canManageBooks={canManageBooks}
                canDelete={user?.role === "admin"}
              />
            ) : (
              <BookForm
                key={modalState.book?._id || "new"}
                initialData={modalState.book}
                onSubmit={modalState.type === "create" ? handleCreate : handleEdit}
                loading={loading}
                onCancel={modalState.type === "details" ? () => setIsEditing(false) : undefined}
                readOnly={modalState.type === "details" && !isEditing}
              />
            )}
          </div>
        </Modal>
      )}

      {confirmState && (
        <ConfirmModal
          title="Permanent Delete"
          message="This will permanently remove the book from the database."
          confirmText="Proceed"
          onCancel={() => setConfirmState(null)}
          onConfirm={async () => {
            const result = await dispatch(
              deleteBookPermanently(confirmState.bookId)
            );

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

      {showHistoryPanel && modalState.book && canManageBooks && (
        <Modal
          onClose={closeHistoryPanel}
          position="right"
          contentClassName="max-w-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Issue history</h3>
              <p className="text-sm text-gray-500">{modalState.book.title}</p>
            </div>
          </div>

          {historyLoading ? (
            <p>Loading issue history...</p>
          ) : historyError ? (
            <p className="text-sm text-red-500">{historyError}</p>
          ) : historyEntries.length === 0 ? (
            <p className="text-sm text-gray-500">No issues recorded for this book yet.</p>
          ) : (
            <div className="space-y-4 overflow-y-auto pr-2 max-h-[65vh]">
              {historyEntries.map((issue) => (
                <div key={issue._id} className="border rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {issue.toUser?.name || issue.toUser?.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Issued on {new Date(issue.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        issue.status === "issued"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : issue.status === "overdue"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Due {new Date(issue.dueDate).toLocaleDateString()}
                  </p>
                  {issue.returnedDate && (
                    <p className="text-sm text-gray-700">
                      Returned {new Date(issue.returnedDate).toLocaleDateString()}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewHistoryDetail(issue._id)}
                    disabled={historyDetailLoading && historyDetailId === issue._id}
                    className="mt-3"
                  >
                    {historyDetailLoading && historyDetailId === issue._id
                      ? "Loading..."
                      : "View details"}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {historyDetail && (
            <div className="mt-6 border-t border-blue-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-blue-900">Issue detail</h4>
                <Button variant="ghost" size="sm" onClick={() => setHistoryDetail(null)}>
                  Clear
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900">
                <p>
                  Borrower: {historyDetail.toUser?.name || historyDetail.toUser?.email || "—"}
                </p>
                <p>Status: {historyDetail.status}</p>
                <p>
                  Issued: {historyDetail.issueDate
                    ? new Date(historyDetail.issueDate).toLocaleString()
                    : "—"}
                </p>
                <p>
                  Due: {historyDetail.dueDate
                    ? new Date(historyDetail.dueDate).toLocaleString()
                    : "—"}
                </p>
                <p>
                  Processed by: {historyDetail.byUser?.name || historyDetail.byUser?.email || "—"}
                </p>
                {historyDetail.returnedDate && (
                  <p>Returned {new Date(historyDetail.returnedDate).toLocaleString()}</p>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}
    </Layout>
  );
}
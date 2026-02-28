import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { fetchBookById } from "../store/slices/booksSlice";
import {
  fetchBookIssueHistory,
  fetchIssueDetails,
} from "../store/slices/issueSlice";
import Modal from "../components/ui/Modal";

export default function BookDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedBook, loading, error } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);

  const [issueHistory, setIssueHistory] = useState([]);
  const [issueLoading, setIssueLoading] = useState(false);
  const [issueDetail, setIssueDetail] = useState(null);
  const [issueDetailLoading, setIssueDetailLoading] = useState(false);
  const [detailRequestId, setDetailRequestId] = useState(null);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const canViewIssueHistory = user?.role === "admin" || user?.role === "staff";

  useEffect(() => {
    if (!id) return;
    dispatch(fetchBookById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!id || !canViewIssueHistory) {
      setIssueHistory([]);
      setIssueDetail(null);
      return;
    }

    setIssueLoading(true);
    setHistoryError(null);
    dispatch(fetchBookIssueHistory(id))
      .unwrap()
      .then((data) => {
        setIssueHistory(data?.history || []);
      })
      .catch(() => {
        setIssueHistory([]);
        setHistoryError("Unable to load history right now.");
      })
      .finally(() => {
        setIssueLoading(false);
      });
  }, [dispatch, id, canViewIssueHistory]);

  const statusBadges = useMemo(() => {
    if (!selectedBook) return [];
    return [
      {
        key: "active",
        label: selectedBook.isActive ? "Active" : "Inactive",
        classes: selectedBook.isActive
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
          : "bg-gray-100 text-gray-600 border border-gray-200",
      },
      {
        key: "issuable",
        label: selectedBook.isAvailableforIssue
          ? "Available for issue"
          : "Not issuable",
        classes: selectedBook.isAvailableforIssue
          ? "bg-blue-50 text-blue-700 border border-blue-100"
          : "bg-yellow-50 text-yellow-700 border border-yellow-200",
      },
    ];
  }, [selectedBook]);

  const bookMeta = useMemo(() => {
    if (!selectedBook) return [];
    return [
      { label: "ISBN", value: selectedBook.isbn || "—" },
      { label: "Category", value: selectedBook.category || "—" },
      { label: "Published Year", value: selectedBook.publishedYear || "—" },
      { label: "Total Copies", value: selectedBook.copies ?? "—" },
      { label: "Available Copies", value: selectedBook.availableCopies ?? "—" },
      {
        label: "Last Updated",
        value: selectedBook.updatedAt
          ? new Date(selectedBook.updatedAt).toLocaleDateString()
          : "—",
      },
    ];
  }, [selectedBook]);

  const activeIssue = useMemo(() => {
    if (!issueHistory.length) return null;
    return (
      issueHistory.find(
        (issue) => issue.status === "issued" || issue.status === "overdue",
      ) || null
    );
  }, [issueHistory]);

  const handleViewIssueDetails = async (issueId) => {
    setIssueDetailLoading(true);
    setDetailRequestId(issueId);
    try {
      const data = await dispatch(fetchIssueDetails(issueId)).unwrap();
      setIssueDetail(data.issue || null);
    } catch (err) {
      setIssueDetail(null);
      toast.error("Unable to load issue details right now.");
    } finally {
      setIssueDetailLoading(false);
      setDetailRequestId(null);
    }
  };

  const clearIssueDetail = () => setIssueDetail(null);

  const openHistoryPanel = (issueId) => {
    if (!canViewIssueHistory) return;
    setShowHistoryPanel(true);
    if (issueId) {
      handleViewIssueDetails(issueId);
    }
  };

  const closeHistoryPanel = () => {
    setShowHistoryPanel(false);
    setIssueDetail(null);
    setDetailRequestId(null);
  };

  if (loading && !selectedBook) {
    return (
      <Layout>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <p>Loading book details...</p>
        </div>
      </Layout>
    );
  }

  if (!selectedBook) {
    return (
      <Layout>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <p className="text-red-500">
            {error || "We couldn't find that book."}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500">ISBN {selectedBook.isbn}</p>
            <h1 className="text-3xl font-semibold text-gray-900 mt-1">
              {selectedBook.title}
            </h1>
            <p className="text-base text-gray-600 mb-4">
              {selectedBook.author}
            </p>

            <div className="flex flex-wrap gap-2">
              {statusBadges.map((badge) => (
                <span
                  key={badge.key}
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.classes}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>

            {canViewIssueHistory && (
              <button
                onClick={() => openHistoryPanel()}
                className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                View issue history
              </button>
            )}

            {selectedBook.description && (
              <section className="mt-6">
                <h3 className="text-lg font-semibold mb-2">About this book</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedBook.description}
                </p>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {bookMeta.map((item) => (
                <div
                  key={item.label}
                  className="border border-gray-100 rounded-xl p-4 bg-gray-50"
                >
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {item.label}
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {canViewIssueHistory && (
              <div className="mt-6">
                {activeIssue ? (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Currently issued
                    </p>
                    <p className="text-sm text-blue-900">
                      {activeIssue.toUser?.name || activeIssue.toUser?.email} · due{" "}
                      {new Date(activeIssue.dueDate).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => openHistoryPanel(activeIssue._id)}
                      className="mt-3 text-sm font-medium text-blue-700 hover:text-blue-900"
                      disabled={issueDetailLoading && detailRequestId === activeIssue._id}
                    >
                      {issueDetailLoading && detailRequestId === activeIssue._id
                        ? "Loading..."
                        : "View in issue history"}
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-900 text-sm">
                    This book is currently available for circulation.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4">
            {selectedBook.bookCover ? (
              <img
                src={selectedBook.bookCover}
                alt={`${selectedBook.title} cover`}
                className="w-full rounded-xl object-cover h-72 border border-gray-100"
              />
            ) : (
              <div className="w-full h-72 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                No cover available
              </div>
            )}
            <div className="text-sm text-gray-600">
              <p>Copies on hand: {selectedBook.copies ?? "—"}</p>
              <p>Available now: {selectedBook.availableCopies ?? "—"}</p>
            </div>
          </div>
        </div>

      </div>
      </Layout>
      {showHistoryPanel && canViewIssueHistory && (
        <Modal
          onClose={closeHistoryPanel}
          position="right"
          contentClassName="max-w-xl"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Issue history</h3>
              <p className="text-sm text-gray-500">
                {selectedBook.title}
              </p>
            </div>
            <button
              onClick={closeHistoryPanel}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Close
            </button>
          </div>

          {issueLoading ? (
            <p>Loading issue history...</p>
          ) : historyError ? (
            <p className="text-red-500 text-sm">{historyError}</p>
          ) : issueHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No issues recorded for this book yet.
            </p>
          ) : (
            <div className="space-y-4 overflow-y-auto pr-2 max-h-[65vh]">
              {issueHistory.map((issue) => (
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
                  <button
                    onClick={() => handleViewIssueDetails(issue._id)}
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
                    disabled={issueDetailLoading && detailRequestId === issue._id}
                  >
                    {issueDetailLoading && detailRequestId === issue._id
                      ? "Loading..."
                      : "View details"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {issueDetail && (
            <div className="mt-6 border-t border-blue-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-blue-900">
                  Issue detail
                </h4>
                <button
                  onClick={clearIssueDetail}
                  className="text-sm text-blue-700 hover:text-blue-900"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900">
                <p>
                  Borrower: {issueDetail.toUser?.name || issueDetail.toUser?.email || "—"}
                </p>
                <p>Status: {issueDetail.status}</p>
                <p>
                  Issued: {issueDetail.issueDate
                    ? new Date(issueDetail.issueDate).toLocaleString()
                    : "—"}
                </p>
                <p>
                  Due: {issueDetail.dueDate
                    ? new Date(issueDetail.dueDate).toLocaleString()
                    : "—"}
                </p>
                <p>
                  Processed by: {issueDetail.byUser?.name || issueDetail.byUser?.email || "—"}
                </p>
                {issueDetail.returnedDate && (
                  <p>
                    Returned {new Date(issueDetail.returnedDate).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
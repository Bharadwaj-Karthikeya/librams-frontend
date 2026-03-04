import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout.jsx";
import { formatDate } from "../utils/formatDate.js";
import useAuth from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import { fetchBookById } from "../store/slices/booksSlice.js";
import {
  fetchBookIssueHistory,
  fetchIssueDetails,
} from "../store/slices/issueSlice.js";
import Modal from "../components/ui/Modal.jsx";

export default function BookDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedBook, loading, error } = useSelector((state) => state.books);
  const { canManageIssues } = useAuth();

  const [issueHistory, setIssueHistory] = useState([]);
  const [issueLoading, setIssueLoading] = useState(false);
  const [issueDetail, setIssueDetail] = useState(null);
  const [issueDetailLoading, setIssueDetailLoading] = useState(false);
  const [detailRequestId, setDetailRequestId] = useState(null);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const canViewIssueHistory = canManageIssues;

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
        variant: selectedBook.isActive ? "success" : "neutral",
      },
      {
        key: "issuable",
        label: selectedBook.isAvailableforIssue
          ? "Available for issue"
          : "Not issuable",
        variant: selectedBook.isAvailableforIssue ? "info" : "warning",
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
        value: formatDate(selectedBook.updatedAt),
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
    } catch {
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
        <Card>
          <p>Loading book details...</p>
        </Card>
      </Layout>
    );
  }

  if (!selectedBook) {
    return (
      <Layout>
        <Card>
          <p className="text-red-500">
            {error || "We couldn't find that book."}
          </p>
        </Card>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              ISBN {selectedBook.isbn}
            </p>
            <h1 className="text-3xl font-semibold text-[var(--text-strong)] mt-2">
              {selectedBook.title}
            </h1>
            <p className="text-base text-[var(--text-muted)] mb-4">
              {selectedBook.author}
            </p>

            <div className="flex flex-wrap gap-2">
              {statusBadges.map((badge) => (
                <Badge key={badge.key} variant={badge.variant}>
                  {badge.label}
                </Badge>
              ))}
            </div>

            {canViewIssueHistory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openHistoryPanel()}
                className="mt-4"
              >
                View issue history
              </Button>
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
                  className="border border-gray-100 p-4 bg-gray-50"
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
                  <div className="bg-[rgba(28,79,215,0.1)] border border-[rgba(28,79,215,0.2)] p-4">
                    <p className="text-sm font-semibold text-[var(--text-strong)] mb-1">
                      Currently issued
                    </p>
                    <p className="text-sm text-[var(--text-strong)]">
                      {activeIssue.toUser?.name || activeIssue.toUser?.email} · due{" "}
                      {formatDate(activeIssue.dueDate)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openHistoryPanel(activeIssue._id)}
                      disabled={issueDetailLoading && detailRequestId === activeIssue._id}
                      className="mt-3"
                    >
                      {issueDetailLoading && detailRequestId === activeIssue._id
                        ? "Loading..."
                        : "View in issue history"}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-[rgba(42,157,143,0.12)] border border-[rgba(42,157,143,0.25)] p-4 text-[var(--text-strong)] text-sm">
                    This book is currently available for circulation.
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-4">
            {selectedBook.bookCover ? (
              <img
                src={selectedBook.bookCover}
                alt={`${selectedBook.title} cover`}
                className="w-full object-cover h-72 border border-[var(--line)]"
              />
            ) : (
              <div className="w-full h-72 border border-dashed border-[var(--line)] flex items-center justify-center text-[var(--text-muted)] text-sm">
                No cover available
              </div>
            )}
            <div className="text-sm text-[var(--text-muted)]">
              <p>Copies on hand: {selectedBook.copies ?? "—"}</p>
              <p>Available now: {selectedBook.availableCopies ?? "—"}</p>
            </div>
          </Card>
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
            <Button variant="outline" size="sm" onClick={closeHistoryPanel}>
              ✕
            </Button>
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
                        Issued on {formatDate(issue.issueDate)}
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
                    Due {formatDate(issue.dueDate)}
                  </p>
                  {issue.returnedDate && (
                    <p className="text-sm text-gray-700">
                      Returned {formatDate(issue.returnedDate)}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewIssueDetails(issue._id)}
                    disabled={issueDetailLoading && detailRequestId === issue._id}
                    className="mt-3"
                  >
                    {issueDetailLoading && detailRequestId === issue._id
                      ? "Loading..."
                      : "View details"}
                  </Button>
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
                <Button variant="ghost" size="sm" onClick={clearIssueDetail}>
                  Clear
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900">
                <p>
                  Borrower: {issueDetail.toUser?.name || issueDetail.toUser?.email || "—"}
                </p>
                <p>Status: {issueDetail.status}</p>
                <p>
                  Issued: {formatDate(issueDetail.issueDate, true)}
                </p>
                <p>
                  Due: {formatDate(issueDetail.dueDate, true)}
                </p>
                <p>
                  Processed by: {issueDetail.byUser?.name || issueDetail.byUser?.email || "—"}
                </p>
                  {issueDetail.returnedDate && (
                    <p>
                      Returned {formatDate(issueDetail.returnedDate, true)}
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
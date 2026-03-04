import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import {
  Bell,
  BookOpenCheck,
  BookOpen,
  BookX,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { fetchAllIssues, fetchUserIssues } from "../store/slices/issueSlice";
import { fetchBooks } from "../store/slices/booksSlice";
import { formatDate } from "../utils/formatDate";

export default function Dashboard() {
  const { issues, loading, error } = useSelector((state) => state.issues);
  const { books, loading: booksLoading, error: booksError } = useSelector(
    (state) => state.books
  );
  const dispatch = useDispatch();
  const { canManageIssues } = useAuth();

  useEffect(() => {
    if (canManageIssues) {
      dispatch(fetchAllIssues());
      dispatch(fetchBooks());
    } else {
      dispatch(fetchUserIssues());
    }
  }, [dispatch, canManageIssues]);

  const issuedCount = useMemo(
    () => issues.filter((issue) => issue.status === "issued").length,
    [issues]
  );
  const overdueCount = useMemo(
    () => issues.filter((issue) => issue.status === "overdue").length,
    [issues]
  );
  const activeCount = useMemo(
    () => issues.filter((issue) => ["issued", "overdue"].includes(issue.status)).length,
    [issues]
  );

  const studentActiveIssues = useMemo(
    () => issues.filter((issue) => ["issued", "overdue"].includes(issue.status)),
    [issues]
  );
  const studentIssuesByDue = useMemo(() => {
    return [...studentActiveIssues].sort((a, b) => {
      const aDate = new Date(a.dueDate || 0).getTime();
      const bDate = new Date(b.dueDate || 0).getTime();
      return aDate - bDate;
    });
  }, [studentActiveIssues]);
  const nextDueDate = studentIssuesByDue[0]?.dueDate;

  const activeTitles = useMemo(
    () => books.filter((book) => book.isActive).length,
    [books]
  );
  const inactiveTitles = useMemo(
    () => books.filter((book) => book.isActive === false).length,
    [books]
  );
  const issuableTitles = useMemo(
    () => books.filter((book) => book.isAvailableforIssue).length,
    [books]
  );
  const unissuableTitles = useMemo(
    () => books.filter((book) => book.isAvailableforIssue === false).length,
    [books]
  );
  const availableNow = useMemo(
    () => books.filter((book) => (book.availableCopies || 0) > 0).length,
    [books]
  );

  const notificationsCount = 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Dashboard
          </p>
          <h2 className="text-2xl font-semibold text-[var(--text-strong)]">
              Overview
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            {canManageIssues
              ? "Prioritize circulation tasks that need staff attention."
              : "Focus on your active loans and urgent notices."}
          </p>
        </div>

        {canManageIssues ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <AlertTriangle size={18} />
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Overdue issues
                  </p>
                </div>
                <p className="text-3xl font-semibold text-[var(--text-strong)] mt-3">
                  {overdueCount}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Act on late returns immediately.
                </p>
              </div>
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <BookOpenCheck size={18} />
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Active issues
                  </p>
                </div>
                <p className="text-3xl font-semibold text-[var(--text-strong)] mt-3">
                  {activeCount}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Books currently checked out.
                </p>
              </div>
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <Clock size={18} />
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Total issues
                  </p>
                </div>
                <p className="text-3xl font-semibold text-[var(--text-strong)] mt-3">
                  {issues.length}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Today’s circulation workload.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <BookOpen size={18} />
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Active titles
                  </p>
                </div>
                <p className="text-3xl font-semibold text-[var(--text-strong)] mt-3">
                  {activeTitles}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Visible in catalog.
                </p>
              </div>
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <BookX size={18} />
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Inactive titles
                  </p>
                </div>
                <p className="text-3xl font-semibold text-[var(--text-strong)] mt-3">
                  {inactiveTitles}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Hidden from circulation.
                </p>
              </div>
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <BookOpenCheck size={18} />
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Available now
                  </p>
                </div>
                <p className="text-3xl font-semibold text-[var(--text-strong)] mt-3">
                  {availableNow}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Titles with copies in stock.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <CheckCircle2 size={18} />
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Issuable titles
                  </p>
                </div>
                <p className="text-3xl font-semibold text-[var(--text-strong)] mt-3">
                  {issuableTitles}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Ready for checkout.
                </p>
              </div>
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <XCircle size={18} />
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Unavailable for issue
                  </p>
                </div>
                <p className="text-3xl font-semibold text-[var(--text-strong)] mt-3">
                  {unissuableTitles}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Restricted or processing.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <BookOpenCheck size={18} />
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Books on loan
                  </p>
                </div>
                <p className="text-3xl font-semibold text-[var(--text-strong)] mt-3">
                  {issuedCount + overdueCount}
                </p>
              </div>
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <AlertTriangle size={18} />
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Overdue
                  </p>
                </div>
                <p className="text-3xl font-semibold text-[var(--text-strong)] mt-3">
                  {overdueCount}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Return immediately to avoid penalties.
                </p>
              </div>
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <Clock size={18} />
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Next due
                  </p>
                </div>
                <p className="text-2xl font-semibold text-[var(--text-strong)] mt-3">
                  {nextDueDate ? formatDate(nextDueDate) : "—"}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Earliest due date on your list.
                </p>
              </div>
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)] flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 text-[var(--accent)]">
                    <Bell size={18} />
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Notifications
                    </p>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mt-3">
                    {notificationsCount === 0
                      ? "No urgent alerts. Watch for hold pickups."
                      : "You have messages to attend."}
                  </p>
                </div>
                <Button className="w-full">
                  <span className="inline-flex items-center justify-center gap-2">
                    <Bell size={16} />
                    {notificationsCount === 0
                      ? "Check notifications"
                      : `View notifications (${notificationsCount})`}
                  </span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                    Books with you
                  </h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {studentActiveIssues.length} items
                  </span>
                </div>
                {studentActiveIssues.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">
                    You have no active books right now.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {studentActiveIssues.slice(0, 5).map((issue) => (
                      <div
                        key={issue._id}
                        className="flex items-center justify-between border border-[var(--line)] p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-strong)]">
                            {issue.book?.title || "Untitled"}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            Due {formatDate(issue.dueDate)}
                          </p>
                        </div>
                        <span className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                          {issue.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                    Issues by due date
                  </h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Sorted
                  </span>
                </div>
                {studentIssuesByDue.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">
                    Your issue list is empty.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {studentIssuesByDue.slice(0, 6).map((issue) => (
                      <div
                        key={issue._id}
                        className="flex items-center justify-between border border-[var(--line)] p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-strong)]">
                            {issue.book?.title || "Untitled"}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            Due {formatDate(issue.dueDate)}
                          </p>
                        </div>
                        <span className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
                          {issue.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
        {booksError && canManageIssues && (
          <p className="text-red-500">{booksError}</p>
        )}
        {(loading || (canManageIssues && booksLoading)) && (
          <p>Loading dashboard...</p>
        )}
      </div>
    </Layout>
  );
}
import { useEffect, useMemo, useState } from "react";
import Modal from "../ui/Modal";

export default function IssueDetailsModal({
  issue,
  onClose,
  canManageIssues = false,
  onReturn,
  onExtend,
  actionLoading = false,
}) {
  const [extendDate, setExtendDate] = useState("");

  useEffect(() => {
    if (issue?.dueDate) {
      setExtendDate(issue.dueDate.slice(0, 10));
    } else {
      setExtendDate("");
    }
  }, [issue]);

  const statusBadge = useMemo(() => {
    if (!issue?.status) return null;
    const baseClasses = "text-xs font-semibold px-3 py-1 rounded-full border";
    switch (issue.status) {
      case "issued":
        return `${baseClasses} bg-green-50 text-green-700 border-green-100`;
      case "overdue":
        return `${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-100`;
      case "returned":
        return `${baseClasses} bg-gray-100 text-gray-600 border-gray-200`;
      default:
        return `${baseClasses} bg-blue-50 text-blue-700 border-blue-100`;
    }
  }, [issue?.status]);

  if (!issue) {
    return null;
  }

  const canActOnIssue = canManageIssues && issue.status === "issued";

  const formatDate = (value, withTime = false) => {
    if (!value) return "—";
    const date = new Date(value);
    return withTime
      ? date.toLocaleString()
      : date.toLocaleDateString();
  };

  return (
    <Modal onClose={onClose} contentClassName="max-w-3xl" showCloseButton={false}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Issue reference
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {issue.book?.title}
            </h2>
            <p className="text-sm text-gray-600">
              Borrowed by {issue.toUser?.name || issue.toUser?.email || "Unknown user"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {statusBadge && <span className={statusBadge}>{issue.status}</span>}
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-gray-500 hover:text-gray-800"
            >
              Close ✕
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Borrower email
            </p>
            <p className="text-base font-semibold text-gray-900">
              {issue.toUser?.email || "—"}
            </p>
          </div>
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Processed by
            </p>
            <p className="text-base font-semibold text-gray-900">
              {issue.byUser?.name || issue.byUser?.email || "—"}
            </p>
          </div>
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Issued on
            </p>
            <p className="text-base font-semibold text-gray-900">
              {formatDate(issue.issueDate, true)}
            </p>
          </div>
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Due on
            </p>
            <p className="text-base font-semibold text-gray-900">
              {formatDate(issue.dueDate, true)}
            </p>
          </div>
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Returned on
            </p>
            <p className="text-base font-semibold text-gray-900">
              {formatDate(issue.returnedDate, true)}
            </p>
          </div>
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Notes
            </p>
            <p className="text-base font-semibold text-gray-900">
              {issue.notes || "—"}
            </p>
          </div>
        </div>

        {canActOnIssue && (
          <div className="border-t pt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700" htmlFor="extend-date">
                Extend due date
              </label>
              <input
                id="extend-date"
                type="date"
                value={extendDate}
                onChange={(event) => setExtendDate(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onExtend?.(extendDate)}
                disabled={!extendDate || actionLoading}
                className="px-4 py-2 rounded-md text-sm font-semibold text-blue-700 border border-blue-200 hover:bg-blue-50 disabled:opacity-60"
              >
                Extend due date
              </button>
              <button
                type="button"
                onClick={onReturn}
                disabled={actionLoading}
                className="px-4 py-2 rounded-md text-sm font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-50 disabled:opacity-60"
              >
                Mark as returned
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

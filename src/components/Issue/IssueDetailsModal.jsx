import { useMemo, useState } from "react";
import Modal from "../ui/Modal";
import { formatDate } from "../../utils/formatDate";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function IssueDetailsModal({
  issue,
  onClose,
  canManageIssues = false,
  onReturn,
  onExtend,
  actionLoading = false,
}) {
  const [extendDate, setExtendDate] = useState(() =>
    issue?.dueDate ? issue.dueDate.slice(0, 10) : ""
  );

  const statusBadge = useMemo(() => {
    if (!issue?.status) return null;
    switch (issue.status) {
      case "issued":
        return "success";
      case "overdue":
        return "warning";
      case "returned":
        return "neutral";
      default:
        return "info";
    }
  }, [issue?.status]);

  if (!issue) {
    return null;
  }

  const canActOnIssue =
    canManageIssues && (issue.status === "issued" || issue.status === "overdue");

  return (
    <Modal onClose={onClose} contentClassName="max-w-3xl">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Issue reference
            </p>
            <h2 className="text-2xl font-semibold text-gray-900">
              {issue.book?.title}
            </h2>
            {canManageIssues && (
              <p className="text-sm text-gray-600">
                Borrowed by {issue.toUser?.name || issue.toUser?.email || "Unknown user"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {statusBadge && <Badge variant={statusBadge}>{issue.status}</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {canManageIssues && (
            <div className="border rounded-xl p-4 bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Borrower email
              </p>
              <p className="text-base font-semibold text-gray-900">
                {issue.toUser?.email || "—"}
              </p>
            </div>
          )}
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
          
        </div>

        {canActOnIssue && (
          <div className="border-t pt-4 space-y-4">
            <Input
              id="extend-date"
              type="date"
              label="Extend due date"
              value={extendDate}
              onChange={(event) => setExtendDate(event.target.value)}
            />
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onExtend?.(extendDate)}
                disabled={!extendDate || actionLoading}
              >
                Extend due date
              </Button>
              <Button
                type="button"
                onClick={onReturn}
                disabled={actionLoading}
              >
                Mark as returned
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

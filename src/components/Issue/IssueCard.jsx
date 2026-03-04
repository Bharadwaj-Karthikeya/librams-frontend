import { formatDate } from "../../utils/formatDate.js";
import Button from "../ui/Button.jsx";

export default function IssueCard({
  issue,
  onSelect,
  showRecipient = true,
}) {

  const handleSelect = () => {
    if (typeof onSelect === "function") {
      onSelect(issue);
    }
  };

  const statusLabel = issue.status?.toUpperCase();

  return (
    <div
      className="border border-[var(--line)] p-4 rounded-2xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition cursor-pointer focus-within:ring-2 focus-within:ring-[rgba(28,79,215,0.25)]"
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelect();
        }
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-[var(--text-strong)]">{issue.book?.title}</h3>
          {showRecipient && (
            <p className="text-sm text-[var(--text-muted)]">
              Issued To: {issue.toUser?.email}
            </p>
          )}
          <p className="text-sm text-[var(--text-strong)]">
            Due {formatDate(issue.dueDate)}
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          {statusLabel}
        </span>
      </div>

      <p className="text-xs text-[var(--text-muted)] mt-2">
        Issued {formatDate(issue.issueDate)}
      </p>

      <div className="mt-4 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(event) => {
            event.stopPropagation();
            handleSelect();
          }}
        >
          View details
        </Button>
      </div>
    </div>
  );
}
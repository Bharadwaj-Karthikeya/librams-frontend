export default function IssueCard({
  issue,
  onSelect,
  canManageIssues = false,
  showRecipient = true,
}) {
  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString();
  };

  const handleSelect = () => {
    if (typeof onSelect === "function") {
      onSelect(issue);
    }
  };

  const statusLabel = issue.status?.toUpperCase();

  return (
    <div
      className="border p-4 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer focus-within:ring-2 focus-within:ring-blue-200"
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
          <h3 className="font-semibold text-gray-900">{issue.book?.title}</h3>
          {showRecipient && (
            <p className="text-sm text-gray-600">
              Issued To: {issue.toUser?.email}
            </p>
          )}
          <p className="text-sm text-gray-700">
            Due {formatDate(issue.dueDate)}
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {statusLabel}
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Issued {formatDate(issue.issueDate)}
      </p>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleSelect();
          }}
          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          View details
        </button>
      </div>
    </div>
  );
}
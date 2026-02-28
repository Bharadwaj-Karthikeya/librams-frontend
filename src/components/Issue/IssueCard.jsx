export default function IssueCard({
  issue,
  onReturn,
  onExtend,
  canManageIssues = false,
  allowSelfActions = false,
}) {
  const canActOnIssue =
    issue.status === "issued" && (canManageIssues || allowSelfActions);

  return (
    <div className="border p-4 rounded-lg">
      <h3 className="font-semibold">{issue.book?.title}</h3>
      <p className="text-sm text-gray-600">
        Issued To: {issue.toUser?.email}
      </p>
      <p className="text-sm">
        Due: {new Date(issue.dueDate).toLocaleDateString()}
      </p>

      <p className="text-xs mt-1 uppercase tracking-wide text-gray-500">
        Status: {issue.status}
      </p>

      {canActOnIssue && (
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => onReturn(issue._id)}
            className="text-green-600 text-sm"
          >
            Return
          </button>

          <button
            onClick={() => onExtend(issue._id)}
            className="text-yellow-600 text-sm"
          >
            Extend
          </button>
        </div>
      )}
    </div>
  );
}
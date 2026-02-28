import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import IssueForm from "../components/issue/IssueForm";
import IssueCard from "../components/issue/IssueCard";
import {
  issueBook,
  returnIssue,
  extendDueDate,
  fetchUserIssues,
  fetchAllIssues,
} from "../store/slices/issueSlice";

export default function Issues() {
  const dispatch = useDispatch();
  const { issues, loading, error } = useSelector((state) => state.issues);
  const { user } = useSelector((state) => state.auth);

  const canManageIssues = user?.role === "admin" || user?.role === "staff";

  const refreshIssues = () => {
    if (!user) return;
    if (canManageIssues) {
      dispatch(fetchAllIssues());
    } else {
      dispatch(fetchUserIssues());
    }
  };

  useEffect(() => {
    refreshIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManageIssues]);

  const handleIssueBook = async (data) => {
    const result = await dispatch(issueBook(data));
    if (!result.error) {
      toast.success("Book issued successfully");
      refreshIssues();
    } else {
      toast.error(result.payload || "Failed to issue book");
    }
  };

  const handleReturnBook = async (id) => {
    const result = await dispatch(returnIssue(id));
    if (!result.error) {
      toast.success("Issue marked as returned");
      refreshIssues();
    } else {
      toast.error(result.payload || "Failed to return issue");
    }
  };

  const handleExtend = async (id) => {
    const newDueDate = window.prompt("Enter new due date (YYYY-MM-DD)");
    if (!newDueDate) return;
    const result = await dispatch(
      extendDueDate({ id, newDueDate }),
    );
    if (!result.error) {
      toast.success("Due date updated");
      refreshIssues();
    } else {
      toast.error(result.payload || "Failed to extend due date");
    }
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Issues</h2>
            <p className="text-sm text-gray-500">
              {canManageIssues
                ? "Manage all issued books"
                : "Track the books you currently have"}
            </p>
          </div>

          <button
            onClick={refreshIssues}
            className="self-start md:self-auto px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {canManageIssues && (
          <div className="mb-8 bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-4">Issue a book</h3>
            <IssueForm onSubmit={handleIssueBook} />
          </div>
        )}

        {loading && <p>Loading issues...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && issues.length === 0 && (
          <p className="text-gray-500">No issues found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {issues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onReturn={handleReturnBook}
              onExtend={handleExtend}
              canManageIssues={canManageIssues}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import IssueForm from "../components/issue/IssueForm";
import IssueCard from "../components/issue/IssueCard";
import IssueDetailsModal from "../components/issue/IssueDetailsModal";
import Modal from "../components/ui/Modal";
import {
  issueBook,
  returnIssue,
  extendDueDate,
  fetchUserIssues,
  fetchAllIssues,
  fetchOverdueIssues,
} from "../store/slices/issueSlice";

export default function Issues() {
  const dispatch = useDispatch();
  const { issues, loading, error } = useSelector((state) => state.issues);
  const { user } = useSelector((state) => state.auth);

  const canManageIssues = user?.role === "admin" || user?.role === "staff";
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeAdminTab, setActiveAdminTab] = useState("all");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueActionLoading, setIssueActionLoading] = useState(false);
  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Issued", value: "issued" },
    { label: "Returned", value: "returned" },
    { label: "Overdue", value: "overdue" },
  ];
  const adminTabs = [
    { label: "All Issues", value: "all" },
    { label: "Overdue", value: "overdue" },
  ];

  const refreshIssues = () => {
    if (!user) return;
    if (canManageIssues) {
      if (activeAdminTab === "overdue") {
        dispatch(fetchOverdueIssues());
      } else {
        dispatch(fetchAllIssues());
      }
    } else {
      dispatch(fetchUserIssues());
    }
  };

  useEffect(() => {
    refreshIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManageIssues, activeAdminTab]);

  useEffect(() => {
    if (canManageIssues) {
      setStatusFilter("all");
    }
  }, [canManageIssues]);

  const filteredIssues = useMemo(() => {
    if (canManageIssues || statusFilter === "all") {
      return issues;
    }
    return issues.filter((issue) => issue.status === statusFilter);
  }, [issues, canManageIssues, statusFilter]);

  const handleIssueBook = async (data) => {
    const result = await dispatch(issueBook(data));
    if (!result.error) {
      toast.success("Book issued successfully");
      refreshIssues();
      setShowIssueModal(false);
    } else {
      toast.error(result.payload || "Failed to issue book");
    }
  };

  const handleReturnBook = async (id) => {
    const result = await dispatch(returnIssue(id));
    if (!result.error) {
      toast.success("Issue marked as returned");
      refreshIssues();
      return true;
    }
    toast.error(result.payload || "Failed to return issue");
    return false;
  };

  const handleExtend = async (id, newDueDate) => {
    if (!newDueDate) {
      toast.error("Please select a new due date");
      return false;
    }

    const result = await dispatch(extendDueDate({ id, newDueDate }));
    if (!result.error) {
      toast.success("Due date updated");
      refreshIssues();
      return true;
    }
    toast.error(result.payload || "Failed to extend due date");
    return false;
  };

  const openIssueDetails = (issue) => {
    setSelectedIssue(issue);
  };

  const closeIssueDetails = () => {
    setSelectedIssue(null);
    setIssueActionLoading(false);
  };

  const handleDetailReturn = async () => {
    if (!selectedIssue) return;
    setIssueActionLoading(true);
    const success = await handleReturnBook(selectedIssue._id);
    setIssueActionLoading(false);
    if (success) {
      closeIssueDetails();
    }
  };

  const handleDetailExtend = async (newDueDate) => {
    if (!selectedIssue) return;
    setIssueActionLoading(true);
    const success = await handleExtend(selectedIssue._id, newDueDate);
    setIssueActionLoading(false);
    if (success) {
      closeIssueDetails();
    }
  };

  return (
    <>
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

          <div className="flex items-center gap-3 self-start md:self-auto">
            {canManageIssues && (
              <button
                onClick={() => setShowIssueModal(true)}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                + Issue Book
              </button>
            )}
            <button
              onClick={refreshIssues}
              className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {canManageIssues && (
          <div className="flex flex-wrap gap-2 mb-6">
            {adminTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveAdminTab(tab.value)}
                className={`px-3 py-1 rounded-full text-sm border transition ${activeAdminTab === tab.value ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {!canManageIssues && (
          <div className="flex flex-wrap gap-2 mb-6">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-3 py-1 rounded-full text-sm border transition ${statusFilter === status.value ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}
              >
                {status.label}
              </button>
            ))}
          </div>
        )}

        {loading && <p>Loading issues...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && filteredIssues.length === 0 && (
          <p className="text-gray-500">No issues found for this view.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onSelect={openIssueDetails}
              canManageIssues={canManageIssues}
              showRecipient={canManageIssues}
            />
          ))}
        </div>
      </div>
      </Layout>

      {showIssueModal && (
        <Modal onClose={() => setShowIssueModal(false)}>
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Issue a book</h3>
                <p className="text-sm text-gray-500">
                  Provide ISBN, student email, and due date to issue.
                </p>
              </div>
            </div>
            <IssueForm onSubmit={handleIssueBook} />
          </div>
        </Modal>
      )}

      {selectedIssue && (
        <IssueDetailsModal
          issue={selectedIssue}
          onClose={closeIssueDetails}
          canManageIssues={canManageIssues}
          onReturn={canManageIssues ? handleDetailReturn : undefined}
          onExtend={canManageIssues ? handleDetailExtend : undefined}
          actionLoading={issueActionLoading}
        />
      )}
    </>
  );
}

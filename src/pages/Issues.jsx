import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import IssueForm from "../components/issue/IssueForm";
import IssueDetailsModal from "../components/issue/IssueDetailsModal";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import IssueList from "../components/issue/IssueList";
import useAuth from "../hooks/useAuth";
import FilterPill from "../components/ui/FilterPill";
import { BookPlus } from "lucide-react";
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
  const { user, canManageIssues } = useAuth();
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

  const issuedCount = issues.filter((issue) => issue.status === "issued").length;
  const overdueCount = issues.filter((issue) => issue.status === "overdue").length;

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
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Circulation
              </p>
              <h2 className="text-2xl font-semibold text-[var(--text-strong)]">Issues</h2>
              <p className="text-sm text-[var(--text-muted)] mt-2">
                {canManageIssues
                  ? "Manage issued books and overdue circulation."
                  : "Track the books you currently have."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {canManageIssues && (
                <Button onClick={() => setShowIssueModal(true)}>
                  <span className="inline-flex items-center gap-2">
                    <BookPlus size={16} />
                    Issue book
                  </span>
                </Button>
              )}
              <Button variant="outline" onClick={refreshIssues}>
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Total issues
              </p>
              <p className="text-2xl font-semibold text-[var(--text-strong)] mt-2">
                {issues.length}
              </p>
            </div>
            <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Issued
              </p>
              <p className="text-2xl font-semibold text-[var(--text-strong)] mt-2">
                {issuedCount}
              </p>
            </div>
            <div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Overdue
              </p>
              <p className="text-2xl font-semibold text-[var(--text-strong)] mt-2">
                {overdueCount}
              </p>
            </div>
          </div>

          {canManageIssues && (
            <div className="flex flex-wrap gap-2">
              {adminTabs.map((tab) => (
                <FilterPill
                  key={tab.value}
                  onClick={() => setActiveAdminTab(tab.value)}
                  active={activeAdminTab === tab.value}
                >
                  {tab.label}
                </FilterPill>
              ))}
            </div>
          )}

          {!canManageIssues && (
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <FilterPill
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  active={statusFilter === status.value}
                >
                  {status.label}
                </FilterPill>
              ))}
            </div>
          )}

          {loading && <p>Loading issues...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && (
            <IssueList
              issues={filteredIssues}
              onSelect={openIssueDetails}
              showRecipient={canManageIssues}
            />
          )}
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
            <IssueForm
              onSubmit={handleIssueBook}
              onCancel={() => setShowIssueModal(false)}
            />
          </div>
        </Modal>
      )}

      {selectedIssue && (
        <IssueDetailsModal
          key={selectedIssue._id}
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

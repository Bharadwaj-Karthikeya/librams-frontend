import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout/Layout.jsx";
import IssueDetailsModal from "../components/Issue/IssueDetailsModal.jsx";
import { fetchUserIssues } from "../store/slices/issueSlice.js";
import Button from "../components/ui/Button.jsx";
import IssueList from "../components/Issue/IssueList.jsx";
import FilterPill from "../components/ui/FilterPill.jsx";

const STATUS_OPTIONS = [
	{ label: "All", value: "all" },
	{ label: "Issued", value: "issued" },
	{ label: "Returned", value: "returned" },
	{ label: "Overdue", value: "overdue" },
];

export default function UserIssues() {
	const dispatch = useDispatch();
	const { issues, loading, error } = useSelector((state) => state.issues);
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedIssue, setSelectedIssue] = useState(null);

	const refreshIssues = () => {
		dispatch(fetchUserIssues());
	};

	useEffect(() => {
		refreshIssues();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const filteredIssues = useMemo(() => {
		if (statusFilter === "all") {
			return issues;
		}
		return issues.filter((issue) => issue.status === statusFilter);
	}, [issues, statusFilter]);

	const issuedCount = issues.filter((issue) => issue.status === "issued").length;
	const overdueCount = issues.filter((issue) => issue.status === "overdue").length;

	const openIssueDetails = (issue) => {
		setSelectedIssue(issue);
	};

	const closeIssueDetails = () => {
		setSelectedIssue(null);
	};

	return (
		<Layout>
			<div className="space-y-6">
				<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
					<div>
						<p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
							My shelf
						</p>
						<h2 className="text-2xl font-semibold text-[var(--text-strong)]">My Issues</h2>
						<p className="text-sm text-[var(--text-muted)] mt-2">
							Review the books you have borrowed and their current status.
						</p>
					</div>

					<Button variant="outline" onClick={refreshIssues}>
						Refresh
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="border border-[var(--line)] p-4 bg-[var(--surface)]">
						<p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
							All issues
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

				<div className="flex flex-wrap gap-2">
					{STATUS_OPTIONS.map((status) => (
						<FilterPill
							key={status.value}
							onClick={() => setStatusFilter(status.value)}
							active={statusFilter === status.value}
						>
							{status.label}
						</FilterPill>
					))}
				</div>

				{loading && <p>Loading issues...</p>}
				{error && <p className="text-red-500">{error}</p>}
				{!loading && (
					<IssueList
						issues={filteredIssues}
						onSelect={openIssueDetails}
						showRecipient={false}
					/>
				)}
			</div>
			{selectedIssue && (
				<IssueDetailsModal
					key={selectedIssue._id}
					issue={selectedIssue}
					onClose={closeIssueDetails}
				/>
			)}
		</Layout>
	);
}

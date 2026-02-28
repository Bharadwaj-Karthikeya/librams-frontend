import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import IssueCard from "../components/issue/IssueCard";
import IssueDetailsModal from "../components/issue/IssueDetailsModal";
import { fetchUserIssues } from "../store/slices/issueSlice";

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

	const openIssueDetails = (issue) => {
		setSelectedIssue(issue);
	};

	const closeIssueDetails = () => {
		setSelectedIssue(null);
	};

	return (
		<Layout>
			<div className="bg-white p-6 rounded-2xl shadow-sm">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
					<div>
						<h2 className="text-2xl font-semibold">My Issues</h2>
						<p className="text-sm text-gray-500">
							Review the books you have borrowed and their current status.
						</p>
					</div>

					<button
						onClick={refreshIssues}
						className="self-start md:self-auto px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
					>
						Refresh
					</button>
				</div>

				<div className="flex flex-wrap gap-2 mb-6">
					{STATUS_OPTIONS.map((status) => (
						<button
							key={status.value}
							onClick={() => setStatusFilter(status.value)}
							className={`px-3 py-1 rounded-full text-sm border transition ${statusFilter === status.value ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 text-gray-700 border-gray-200"}`}
						>
							{status.label}
						</button>
					))}
				</div>

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
							showRecipient={false}
						/>
					))}
				</div>
			</div>
		{selectedIssue && (
			<IssueDetailsModal issue={selectedIssue} onClose={closeIssueDetails} />
		)}
		</Layout>
	);
}

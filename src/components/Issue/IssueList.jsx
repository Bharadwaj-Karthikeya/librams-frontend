import IssueCard from "./IssueCard.jsx";

export default function IssueList({ issues, onSelect, showRecipient }) {
	if (!issues?.length) {
		return <p className="text-gray-500">No issues found for this view.</p>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{issues.map((issue) => (
				<IssueCard
					key={issue._id}
					issue={issue}
					onSelect={onSelect}
					showRecipient={showRecipient}
				/>
			))}
		</div>
	);
}

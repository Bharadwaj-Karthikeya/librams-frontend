import { Link } from "react-router-dom";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";

export default function BookCard({ book, onView }) {
	if (!book) return null;

	return (
		<div className="flex gap-4 border border-[var(--line)] p-4 rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition">
			<img
				src={book.bookCover}
				alt={`${book.title} cover`}
				className="w-28 h-36 object-cover rounded-lg border border-[var(--line)]"
			/>

			<div className="flex-1 flex flex-col justify-between">
				<div>
					<Link to={`/books/${book._id}`}>
						<h3 className="text-lg font-semibold text-[var(--text-strong)]">{book.title}</h3>
					</Link>
					<p className="text-sm text-[var(--text-muted)]">{book.author}</p>
					<p className="text-xs text-[var(--text-muted)] mt-1">Category: {book.category || "—"}</p>
					<p className="text-sm mt-2 font-medium text-[var(--text-strong)]">
						Available Copies: {book.availableCopies}
					</p>
					<div className="flex flex-wrap gap-2 mt-3">
						{!book.isActive && <Badge>Inactive</Badge>}
						{!book.isAvailableforIssue && (
							<Badge variant="warning">Not Issuable</Badge>
						)}
					</div>
				</div>

				<Button
					onClick={() => onView?.(book)}
					variant="outline"
					size="sm"
					className="mt-4 self-start"
				>
					View Details
				</Button>
			</div>
		</div>
	);
}

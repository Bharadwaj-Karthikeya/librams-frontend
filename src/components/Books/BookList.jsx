import BookCard from "./BookCard.jsx";

export default function BookList({ books, onView }) {
	if (!books?.length) {
		return <p className="text-gray-500">No books found.</p>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{books.map((book) => (
				<BookCard key={book._id} book={book} onView={onView} />
			))}
		</div>
	);
}

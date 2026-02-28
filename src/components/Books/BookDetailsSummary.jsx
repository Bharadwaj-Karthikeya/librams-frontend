import { useMemo } from "react";

export default function BookDetailsSummary({ book }) {
  const statusBadges = useMemo(() => {
    if (!book) return [];
    return [
      {
        key: "active",
        label: book.isActive ? "Active" : "Inactive",
        classes: book.isActive
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
          : "bg-gray-100 text-gray-600 border border-gray-200",
      },
      {
        key: "issuable",
        label: book.isAvailableforIssue ? "Available for issue" : "Not issuable",
        classes: book.isAvailableforIssue
          ? "bg-blue-50 text-blue-700 border border-blue-100"
          : "bg-yellow-50 text-yellow-700 border border-yellow-200",
      },
    ];
  }, [book]);

  const metadata = useMemo(() => {
    if (!book) return [];
    return [
      { label: "ISBN", value: book.isbn || "—" },
      { label: "Author", value: book.author || "—" },
      { label: "Category", value: book.category || "—" },
      { label: "Published Year", value: book.publishedYear ?? "—" },
      { label: "Total Copies", value: book.copies ?? "—" },
      { label: "Available Copies", value: book.availableCopies ?? "—" },
    ];
  }, [book]);

  if (!book) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            ISBN {book.isbn}
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-1">
            {book.title}
          </h2>
          <p className="text-base text-gray-600 mb-3">{book.author}</p>

          <div className="flex flex-wrap gap-2">
            {statusBadges.map((badge) => (
              <span
                key={badge.key}
                className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.classes}`}
              >
                {badge.label}
              </span>
            ))}
          </div>

          {book.description && (
            <section className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {book.description}
              </p>
            </section>
          )}
        </div>

        <div className="w-full lg:w-64">
          {book.bookCover ? (
            <img
              src={book.bookCover}
              alt={`${book.title} cover`}
              className="w-full h-72 rounded-xl object-cover border border-gray-100"
            />
          ) : (
            <div className="w-full h-72 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
              No cover available
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metadata.map((item) => (
          <div
            key={item.label}
            className="border border-gray-100 rounded-xl p-4 bg-gray-50"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {item.label}
            </p>
            <p className="text-base font-semibold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useMemo } from "react";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";

export default function BookDetailsSummary({
  book,
  onEdit,
  onViewHistory,
  onDeletePermanent,
  canManageBooks,
  canDelete,
}) {
  const statusBadges = useMemo(() => {
    if (!book) return [];
    return [
      {
        key: "active",
        label: book.isActive ? "Active" : "Inactive",
        variant: book.isActive ? "success" : "neutral",
      },
      {
        key: "issuable",
        label: book.isAvailableforIssue ? "Available for issue" : "Not issuable",
        variant: book.isAvailableforIssue ? "info" : "warning",
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
          <h2 className="text-2xl font-semibold text-[var(--text-strong)] mt-2">
            {book.title}
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            ISBN {book.isbn}
          </p>
          <p className="text-base text-[var(--text-muted)] mb-3">{book.author}</p>

          <div className="flex flex-wrap gap-2">
            {statusBadges.map((badge) => (
              <Badge key={badge.key} variant={badge.variant}>
                {badge.label}
              </Badge>
            ))}
          </div>

          {book.description && (
            <section className="mt-4">
              <h3 className="text-sm font-semibold text-[var(--text-strong)] mb-1">
                Description
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm">
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
              className="w-full h-72 rounded-xl object-cover border border-[var(--line)]"
            />
          ) : (
            <div className="w-full h-72 rounded-xl border border-dashed border-[var(--line)] flex items-center justify-center text-[var(--text-muted)] text-sm">
              No cover available
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metadata.map((item) => (
          <div
            key={item.label}
            className="border border-[var(--line)] rounded-xl p-4 bg-[var(--surface-elevated)]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {item.label}
            </p>
            <p className="text-base font-semibold text-[var(--text-strong)]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {(onEdit || onViewHistory || (canManageBooks && canDelete && onDeletePermanent)) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
          <div className="flex flex-wrap gap-3">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                Edit book
              </Button>
            )}
            {onViewHistory && (
              <Button variant="ghost" size="sm" onClick={onViewHistory}>
                Issue history
              </Button>
            )}
          </div>

          {canManageBooks && canDelete && onDeletePermanent && (
            <Button variant="danger" onClick={onDeletePermanent}>
              Delete permanently
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

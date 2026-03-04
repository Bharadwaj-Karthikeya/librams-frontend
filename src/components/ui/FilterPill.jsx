import { classNames } from "../../utils/helpers.js";

export default function FilterPill({
  active = false,
  onClick,
  children,
  className,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "px-3 py-1 rounded-full text-sm border transition",
        active
          ? "bg-[var(--accent)] text-white border-[var(--accent)]"
          : "bg-[var(--surface-muted)] text-[var(--text-muted)] border-[var(--line)]",
        className
      )}
    >
      {children}
    </button>
  );
}

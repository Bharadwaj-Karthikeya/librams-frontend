import { classNames } from "../../utils/helpers.js";

const VARIANT_CLASSES = {
	primary: "bg-[var(--accent)] text-white hover:bg-[#1642b6]",
	secondary: "bg-[var(--text-strong)] text-white hover:bg-[#141b26]",
	outline: "border border-[var(--line)] text-[var(--text-strong)] hover:bg-[var(--surface-muted)]",
	ghost: "bg-transparent text-[var(--accent)] hover:bg-[rgba(28,79,215,0.08)]",
	danger: "bg-[var(--danger)] text-white hover:bg-[#b23a3a]",
};

const SIZE_CLASSES = {
	sm: "px-3 py-2 text-sm",
	md: "px-4 py-2 text-sm",
	lg: "px-6 py-3 text-base",
};

export default function Button({
	type = "button",
	variant = "primary",
	size = "md",
	className,
	disabled,
	children,
	...props
}) {
	return (
		<button
			type={type}
			disabled={disabled}
			className={classNames(
				"rounded-md font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed",
				VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
				SIZE_CLASSES[size] || SIZE_CLASSES.md,
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
}

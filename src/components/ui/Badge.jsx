import { classNames } from "../../utils/helpers.js";

const VARIANTS = {
	neutral: "bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--line)]",
	info: "bg-[rgba(28,79,215,0.12)] text-[var(--accent)] border border-[rgba(28,79,215,0.2)]",
	success: "bg-[rgba(42,157,143,0.14)] text-[#1f7a70] border border-[rgba(42,157,143,0.25)]",
	warning: "bg-[rgba(240,180,41,0.16)] text-[#b7791f] border border-[rgba(240,180,41,0.3)]",
	danger: "bg-[rgba(214,69,69,0.12)] text-[#b03b3b] border border-[rgba(214,69,69,0.25)]",
};

export default function Badge({
	variant = "neutral",
	className,
	children,
}) {
	return (
		<span
			className={classNames(
				"text-xs font-semibold px-3 py-1 rounded-full",
				VARIANTS[variant] || VARIANTS.neutral,
				className
			)}
		>
			{children}
		</span>
	);
}

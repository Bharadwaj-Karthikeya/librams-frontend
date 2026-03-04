import { classNames } from "../../utils/helpers";

export default function Select({
	id,
	label,
	helperText,
	error,
	className,
	selectClassName,
	children,
	...props
}) {
	const selectId = id || props.name;
	return (
		<label
			className={classNames(
				"flex flex-col gap-1 text-sm text-[var(--text-strong)]",
				className
			)}
		>
			{label && <span className="font-medium text-[var(--text-strong)]">{label}</span>}
			<select
				id={selectId}
				className={classNames(
					"w-full rounded-md border border-[var(--line)] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--text-strong)] focus:border-[var(--accent)] focus:outline-none",
					error ? "border-[var(--danger)]" : "",
					selectClassName
				)}
				{...props}
			>
				{children}
			</select>
			{helperText && !error && (
				<span className="text-xs text-gray-500">{helperText}</span>
			)}
			{error && <span className="text-xs text-red-500">{error}</span>}
		</label>
	);
}

import { classNames } from "../../utils/helpers.js";

export default function Input({
	id,
	label,
	helperText,
	error,
	className,
	inputClassName,
	...props
}) {
	const inputId = id || props.name;
	return (
		<label
			className={classNames(
				"flex flex-col gap-1 text-sm text-[var(--text-strong)]",
				className
			)}
		>
			{label && <span className="font-medium text-[var(--text-strong)]">{label}</span>}
			<input
				id={inputId}
				className={classNames(
					"w-full rounded-md border border-[var(--line)] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--text-strong)] focus:border-[var(--accent)] focus:outline-none",
					error ? "border-[var(--danger)]" : "",
					inputClassName
				)}
				{...props}
			/>
			{helperText && !error && (
				<span className="text-xs text-gray-500">{helperText}</span>
			)}
			{error && <span className="text-xs text-red-500">{error}</span>}
		</label>
	);
}

import { classNames } from "../../utils/helpers.js";

export default function Textarea({
	id,
	label,
	helperText,
	error,
	className,
	textareaClassName,
	...props
}) {
	const textareaId = id || props.name;
	return (
		<label
			className={classNames(
				"flex flex-col gap-1 text-sm text-[var(--text-strong)]",
				className
			)}
		>
			{label && <span className="font-medium text-[var(--text-strong)]">{label}</span>}
			<textarea
				id={textareaId}
				className={classNames(
					"w-full rounded-md border border-[var(--line)] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--text-strong)] focus:border-[var(--accent)] focus:outline-none",
					error ? "border-[var(--danger)]" : "",
					textareaClassName
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

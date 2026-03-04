export const classNames = (...values) =>
	values
		.flat()
		.filter(Boolean)
		.join(" ");

export const formatDate = (value, withTime = false) => {
	if (!value) return "—";
	const date = new Date(value);
	return withTime ? date.toLocaleString() : date.toLocaleDateString();
};

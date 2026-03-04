export default function Spinner({ className = "" }) {
	return (
		<div
			className={`h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${className}`}
			aria-label="Loading"
		/>
	);
}

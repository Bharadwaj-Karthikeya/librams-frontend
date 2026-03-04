import { useSelector } from "react-redux";

export default function useAuth() {
	const { user } = useSelector((state) => state.auth);
	const role = user?.role || "student";
	const isAdmin = role === "admin";
	const isStaff = role === "staff";
	const isStudent = role === "student";

	return {
		user,
		role,
		isAdmin,
		isStaff,
		isStudent,
		canManageBooks: isAdmin || isStaff,
		canManageIssues: isAdmin || isStaff,
	};
}

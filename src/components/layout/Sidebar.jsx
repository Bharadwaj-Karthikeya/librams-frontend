import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";

export default function Sidebar({ user, onLogout }) {
	return (
		<aside className="w-64 h-screen sticky top-0 bg-[var(--accent)] text-white p-6 flex flex-col gap-6">
			<div>
				<p className="text-xs uppercase tracking-[0.25em] text-white/70">
					Liberams
				</p>
				<h2 className="text-xl font-semibold">Library Desk</h2>
			</div>

			<div>
				<p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3">
					Navigation
				</p>
				<nav className="flex flex-col gap-2">
					<Link to="/dashboard" className="text-white/80 hover:text-[var(--accent-2)]">
						Dashboard
					</Link>

					<Link to="/books" className="text-white/80 hover:text-[var(--accent-2)]">
						Books
					</Link>

					{user?.role !== "student" && (
						<Link to="/issues" className="text-white/80 hover:text-[var(--accent-2)]">
							Issues
						</Link>
					)}

					{user?.role === "student" && (
						<Link to="/my-issues" className="text-white/80 hover:text-[var(--accent-2)]">
							My Issues
						</Link>
					)}

					<Link to="/profile" className="text-white/80 hover:text-[var(--accent-2)]">
						Profile
					</Link>
				</nav>
			</div>

			<div className="mt-auto flex flex-col gap-3">
				<div className="text-xs text-white/70">
					{user?.name || user?.email || "Library user"}
				</div>
				<Button variant="danger" onClick={onLogout} className="w-full">
					Logout
				</Button>
			</div>
		</aside>
	);
}

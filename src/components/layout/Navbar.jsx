import Button from "../ui/Button";

export default function Navbar({ user, onLogout }) {
	return (
		<div className="flex flex-wrap justify-between items-center gap-4 mb-8">
			<div>
				<p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
					Library workspace
				</p>
				<h1 className="text-2xl font-semibold text-[var(--text-strong)]">
				Welcome, {user?.name || user?.email}
				</h1>
			</div>

			<Button onClick={onLogout} variant="danger">
				Logout
			</Button>
		</div>
	);
}

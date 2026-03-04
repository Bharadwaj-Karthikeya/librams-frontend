import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import useAuth from "../hooks/useAuth";
import { KeyRound, Pencil, Save } from "lucide-react";
import {
	fetchProfile,
	updateProfile,
	resetUserPassword,
	changePassword,
	updateUserRole,
} from "../store/slices/authSlice";

export default function Profile() {
	const dispatch = useDispatch();
	const {
		user,
		loading,
		profileUpdating,
		adminActionLoading,
		passwordUpdating,
		roleUpdating,
	} = useSelector((state) => state.auth);
	const { isAdmin, isStaff } = useAuth();

	const [name, setName] = useState("");
	const [avatarFile, setAvatarFile] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [roleUserId, setRoleUserId] = useState("");
	const [roleValue, setRoleValue] = useState("student");
	const [resetEmail, setResetEmail] = useState("");
	const [resetPasswordValue, setResetPasswordValue] = useState("");

	useEffect(() => {
		dispatch(fetchProfile());
	}, [dispatch]);

	const handleToggleEditing = () => {
		if (isEditing) {
			setName("");
			setAvatarFile(null);
			setAvatarPreview(null);
			setPassword("");
			setPasswordConfirm("");
			setIsEditing(false);
			return;
		}
		setName(user?.name || "");
		setAvatarFile(null);
		setAvatarPreview(null);
		setPassword("");
		setPasswordConfirm("");
		setIsEditing(true);
	};

	const handleAvatarChange = (event) => {
		const file = event.target.files?.[0];
		setAvatarFile(file || null);
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => setAvatarPreview(e.target.result?.toString() || null);
			reader.readAsDataURL(file);
		} else {
			setAvatarPreview(user?.profilePicture || null);
		}
	};

	const handleProfileSubmit = async (event) => {
		event.preventDefault();
		if (!user) {
			toast.error("No user data available");
			return;
		}
		if (!isEditing) {
			return;
		}

		const formData = new FormData();
		let hasChanges = false;

		if (name && name.trim() && name.trim() !== user.name) {
			formData.append("name", name.trim());
			hasChanges = true;
		}

		if (avatarFile) {
			formData.append("profilePic", avatarFile);
			hasChanges = true;
		}

		const wantsPasswordChange = Boolean(password.trim());
		if (wantsPasswordChange && password.trim() !== passwordConfirm.trim()) {
			toast.error("Passwords do not match");
			return;
		}
		if (!hasChanges && !wantsPasswordChange) {
			toast.error("Make a change before saving");
			return;
		}

		try {
			if (hasChanges) {
				await dispatch(updateProfile(formData)).unwrap();
			}
			if (wantsPasswordChange) {
				await dispatch(changePassword({ newPassword: password.trim() })).unwrap();
			}

			if (hasChanges && wantsPasswordChange) {
				toast.success("Profile and password updated");
			} else if (hasChanges) {
				toast.success("Profile updated");
			} else {
				toast.success("Password updated");
			}

			setAvatarFile(null);
			setAvatarPreview(null);
			setName("");
			setPassword("");
			setPasswordConfirm("");
			setIsEditing(false);
		} catch (error) {
			toast.error(error || "Unable to update profile");
		}
	};

	const handleResetPassword = async (event) => {
		event.preventDefault();
		if (!resetEmail.trim() || !resetPasswordValue.trim()) {
			toast.error("Email and new password are required");
			return;
		}

		try {
			await dispatch(
				resetUserPassword({
					email: resetEmail.trim(),
					newPassword: resetPasswordValue.trim(),
				})
			).unwrap();
			toast.success("Password reset successfully");
			setResetPasswordValue("");
		} catch (error) {
			toast.error(error || "Unable to reset password");
		}
	};

	const handleUpdateRole = async (event) => {
		event.preventDefault();
		if (!roleUserId.trim()) {
			toast.error("Provide a user id to update role");
			return;
		}

		try {
			await dispatch(
				updateUserRole({ userId: roleUserId.trim(), newRole: roleValue })
			).unwrap();
			toast.success("Role updated successfully");
			setRoleUserId("");
		} catch (error) {
			toast.error(error || "Unable to update role");
		}
	};

	if (loading && !user) {
		return (
			<Layout>
				<Card>
					<p>Loading profile...</p>
				</Card>
			</Layout>
		);
	}

	if (!user) {
		return (
			<Layout>
				<Card>
					<p className="text-red-500">Unable to load profile information.</p>
				</Card>
			</Layout>
		);
	}

	const displayAvatar = avatarPreview || user.profilePicture;

	return (
		<Layout>
			<div className="space-y-6">
				<div>
					<p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
						Profile
					</p>
					<h2 className="text-2xl font-semibold text-[var(--text-strong)]">
						Account overview
					</h2>
					<p className="text-sm text-[var(--text-muted)] mt-2">
						Manage your profile details and account settings.
					</p>
				</div>
				<Card>
					<form className="space-y-6" onSubmit={handleProfileSubmit}>
						<div className="flex flex-col lg:flex-row gap-6">
							<div className="flex flex-col items-center gap-3 lg:w-64">
								{displayAvatar ? (
									<img
										src={displayAvatar}
										alt={`${user.name} avatar`}
										className="w-56 h-56 rounded-full object-cover border border-[var(--line)]"
									/>
								) : (
									<div className="w-32 h-32 rounded-full bg-[var(--surface-muted)] text-[var(--accent)] flex items-center justify-center text-4xl font-semibold">
										{user.name?.charAt(0)?.toUpperCase() || "?"}
									</div>
								)}
								<Input
									id="avatar"
									type="file"
									label="Profile photo"
									helperText="JPEG or PNG up to 5MB."
									accept="image/*"
									onChange={handleAvatarChange}
									disabled={!isEditing}
								/>
							</div>

							<div className="flex-1 space-y-4">
								<Input
									id="name"
									label="Full name"
									value={isEditing ? name || user.name || "" : user.name || ""}
									onChange={(event) => setName(event.target.value)}
									placeholder="Enter your name"
									disabled={!isEditing}
								/>
								<Input
									id="email"
									label="Email"
									value={user.email || ""}
									disabled
									readOnly
								/>
								<Input
									id="role"
									label="Role"
									value={user.role || ""}
									disabled
									readOnly
								/>
							</div>
						</div>

						{isEditing && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Input
									id="new-password"
									type="password"
									label="New password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									disabled={!isEditing}
									minLength={6}
								/>
								{password.trim() && (
									<Input
										id="confirm-password"
										type="password"
										label="Retype new password"
										value={passwordConfirm}
										onChange={(event) => setPasswordConfirm(event.target.value)}
										disabled={!isEditing}
										minLength={6}
									/>
								)}
							</div>
						)}

						<div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-[var(--line)]">
							{isEditing ? (
								<>
									<Button
										type="button"
										variant="outline"
										onClick={handleToggleEditing}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={profileUpdating || passwordUpdating}
									>
										<span className="inline-flex items-center gap-2">
											<Save size={16} />
											{profileUpdating || passwordUpdating ? "Saving..." : "Save changes"}
										</span>
									</Button>
								</>
							) : (
								<Button type="button" onClick={handleToggleEditing} disabled={loading}>
									<span className="inline-flex items-center gap-2">
										<Pencil size={16} />
										Edit profile
									</span>
								</Button>
							)}
						</div>
					</form>
				</Card>

				{(isAdmin || isStaff) && (
					<div className="space-y-4">
						<div>
							<p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
								Admin & staff tools
							</p>
							<h3 className="text-lg font-semibold text-[var(--text-strong)]">
								Account controls
							</h3>
							<p className="text-sm text-[var(--text-muted)]">
								Update roles or reset account passwords.
							</p>
						</div>
						<div className="grid gap-6 lg:grid-cols-2">
							{isAdmin && (
								<Card>
									<h3 className="text-lg font-semibold text-[var(--text-strong)]">
										Change user role
									</h3>
									<p className="text-sm text-[var(--text-muted)] mb-4">
										Provide a user ID and assign a new role.
									</p>
									<form className="space-y-4" onSubmit={handleUpdateRole}>
										<Input
											id="role-user-id"
											label="User ID"
											value={roleUserId}
											onChange={(event) => setRoleUserId(event.target.value)}
										/>
										<Select
											id="role-value"
											label="New role"
											value={roleValue}
											onChange={(event) => setRoleValue(event.target.value)}
										>
											<option value="student">Student</option>
											<option value="staff">Staff</option>
											<option value="admin">Admin</option>
										</Select>
										<Button
											type="submit"
											disabled={roleUpdating}
										>
											{roleUpdating ? "Updating..." : "Update role"}
										</Button>
									</form>
								</Card>
							)}

							<Card>
								<h3 className="text-lg font-semibold text-[var(--text-strong)]">Reset password</h3>
								<p className="text-sm text-[var(--text-muted)] mb-4">
									Issue a password reset by supplying the user email and a new password.
								</p>
								<form className="space-y-4" onSubmit={handleResetPassword}>
									<Input
										id="reset-email"
										type="email"
										label="Email"
										value={resetEmail}
										onChange={(event) => setResetEmail(event.target.value)}
										placeholder="user@example.com"
									/>
									<Input
										id="reset-password"
										type="password"
										label="New password"
										value={resetPasswordValue}
										onChange={(event) => setResetPasswordValue(event.target.value)}
										minLength={6}
									/>
									<Button
										type="submit"
										variant="primary"
										disabled={adminActionLoading}
									>
										<span className="inline-flex items-center gap-2">
											<KeyRound size={16} />
											{adminActionLoading ? "Processing..." : "Reset password"}
										</span>
									</Button>
								</form>
							</Card>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}

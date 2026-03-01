import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import {
	fetchProfile,
	updateProfile,
	deleteUserAccount,
	resetUserPassword,
} from "../store/slices/authSlice";

export default function Profile() {
	const dispatch = useDispatch();
	const { user, loading, profileUpdating, adminActionLoading } = useSelector((state) => state.auth);

	const [name, setName] = useState("");
	const [avatarFile, setAvatarFile] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [deleteUserId, setDeleteUserId] = useState("");
	const [resetEmail, setResetEmail] = useState("");
	const [resetPasswordValue, setResetPasswordValue] = useState("");

	const isAdmin = user?.role === "admin" || user?.role === "staff";

	useEffect(() => {
		if (!user) {
			dispatch(fetchProfile());
		}
	}, [dispatch, user]);

	const resetEditableFields = () => {
		setName(user?.name || "");
		setAvatarPreview(user?.profilePicture || null);
		setAvatarFile(null);
	};

	useEffect(() => {
		resetEditableFields();
		setIsEditing(false);
		if (user?._id) {
			setDeleteUserId(user._id);
			setResetEmail(user.email || "");
		}
	}, [user]);

	const handleToggleEditing = () => {
		if (isEditing) {
			resetEditableFields();
		}
		setIsEditing((prev) => !prev);
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

		if (!hasChanges) {
			toast.error("Make a change before saving");
			return;
		}

		try {
			await dispatch(updateProfile(formData)).unwrap();
			toast.success("Profile updated");
			setAvatarFile(null);
			setIsEditing(false);
		} catch (error) {
			toast.error(error || "Unable to update profile");
		}
	};

	const handleDeleteUser = async (event) => {
		event.preventDefault();
		if (!deleteUserId.trim()) {
			toast.error("Provide a user id to delete");
			return;
		}

		try {
			await dispatch(deleteUserAccount({ userId: deleteUserId.trim() })).unwrap();
			toast.success("Delete request completed");
		} catch (error) {
			toast.error(error || "Unable to delete user");
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

	if (loading && !user) {
		return (
			<Layout>
				<div className="bg-white p-6 rounded-2xl shadow-sm">
					<p>Loading profile...</p>
				</div>
			</Layout>
		);
	}

	if (!user) {
		return (
			<Layout>
				<div className="bg-white p-6 rounded-2xl shadow-sm">
					<p className="text-red-500">Unable to load profile information.</p>
				</div>
			</Layout>
		);
	}

	const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : null;
	const displayAvatar = avatarPreview || user.profilePicture;

	return (
		<Layout>
			<div className="space-y-6">
				<div className="grid gap-6 lg:grid-cols-3">
					<section className="bg-white p-6 rounded-2xl shadow-sm lg:col-span-1">
						<div className="flex flex-col items-center text-center">
							{displayAvatar ? (
								<img
									src={displayAvatar}
									alt={`${user.name} avatar`}
									className="w-32 h-32 rounded-full object-cover border border-gray-200"
								/>
							) : (
								<div className="w-32 h-32 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-semibold">
									{user.name?.charAt(0)?.toUpperCase() || "?"}
								</div>
							)}
							<h1 className="text-2xl font-semibold text-gray-900 mt-4">{user.name}</h1>
							<p className="text-sm text-gray-500">{user.email}</p>
							<span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
								{user.role}
							</span>
						</div>

						<div className="mt-6 space-y-3 text-sm text-gray-600">
							{joinedDate && (
								<div className="flex items-center justify-between">
									<span className="text-gray-500">Joined</span>
									<span>{joinedDate}</span>
								</div>
							)}
						</div>
					</section>

					<section className="bg-white p-6 rounded-2xl shadow-sm lg:col-span-2">
						<div className="flex flex-wrap gap-4 items-center justify-between mb-4">
							<div>
								<h2 className="text-xl font-semibold text-gray-900">Edit profile</h2>
								<p className="text-sm text-gray-500">Update your name or upload a new avatar.</p>
							</div>
							<div className="flex gap-3">
								<button
									type="button"
									onClick={handleToggleEditing}
									className="text-sm font-medium text-white bg-gray-900 px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-60"
									disabled={loading}
								>
									{isEditing ? "Cancel" : "Edit profile"}
								</button>
								<button
									type="button"
									onClick={() => dispatch(fetchProfile())}
									className="text-sm font-medium text-blue-700 hover:text-blue-900"
									disabled={loading}
								>
									Refresh
								</button>
							</div>
						</div>

						<form className="space-y-6" onSubmit={handleProfileSubmit}>
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-700">
									Full name
								</label>
								<input
									id="name"
									type="text"
									value={name}
									onChange={(event) => setName(event.target.value)}
									className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
									placeholder="Enter your name"
									disabled={!isEditing}
								/>
							</div>

							<div>
								<label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
									Profile picture
								</label>
								<input
									id="avatar"
									type="file"
									accept="image/*"
									onChange={handleAvatarChange}
									className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
									disabled={!isEditing}
								/>
								<p className="text-xs text-gray-500 mt-1">JPEG or PNG up to 5MB.</p>
							</div>

							<button
								type="submit"
								className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
								disabled={!isEditing || profileUpdating}
							>
								{profileUpdating ? "Saving..." : "Save changes"}
							</button>
						</form>
					</section>
				</div>

				{isAdmin && (
					<div className="grid gap-6 lg:grid-cols-2">
						<section className="bg-white p-6 rounded-2xl shadow-sm">
							<h3 className="text-lg font-semibold text-gray-900">Delete user</h3>
							<p className="text-sm text-gray-500 mb-4">
								Provide a user ID to remove the account permanently. This action cannot be undone.
							</p>
							<form className="space-y-4" onSubmit={handleDeleteUser}>
								<div>
									<label htmlFor="delete-user" className="block text-sm font-medium text-gray-700">
										User ID
									</label>
									<input
										id="delete-user"
										type="text"
										value={deleteUserId}
										onChange={(event) => setDeleteUserId(event.target.value)}
										className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none"
									/>
								</div>
								<button
									type="submit"
									className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
									disabled={adminActionLoading}
								>
									{adminActionLoading ? "Processing..." : "Delete user"}
								</button>
							</form>
						</section>

						<section className="bg-white p-6 rounded-2xl shadow-sm">
							<h3 className="text-lg font-semibold text-gray-900">Reset password</h3>
							<p className="text-sm text-gray-500 mb-4">
								Issue a password reset by supplying the user email and a new password.
							</p>
							<form className="space-y-4" onSubmit={handleResetPassword}>
								<div>
									<label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
										Email
									</label>
									<input
										id="reset-email"
										type="email"
										value={resetEmail}
										onChange={(event) => setResetEmail(event.target.value)}
										className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
										placeholder="user@example.com"
									/>
								</div>
								<div>
									<label htmlFor="reset-password" className="block text-sm font-medium text-gray-700">
										New password
									</label>
									<input
										id="reset-password"
										type="password"
										value={resetPasswordValue}
										onChange={(event) => setResetPasswordValue(event.target.value)}
										className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
										minLength={6}
									/>
								</div>
								<button
									type="submit"
									className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
									disabled={adminActionLoading}
								>
									{adminActionLoading ? "Processing..." : "Reset password"}
								</button>
							</form>
						</section>
					</div>
				)}
			</div>
		</Layout>
	);
}

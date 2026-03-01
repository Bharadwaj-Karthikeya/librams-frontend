import api from "./axios";

export const registerUser = (data) =>
  api.post("/auth/signup", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const getProfile = () =>
  api.get("/auth/profile");

export const updateProfileRequest = (formData) =>
  api.put("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteUserAccountRequest = (payload) =>
  api.delete("/auth/delete", { data: payload });

export const resetUserPasswordRequest = (payload) =>
  api.post("/auth/reset-password", payload);
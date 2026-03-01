import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getProfile,
  updateProfileRequest,
  deleteUserAccountRequest,
  resetUserPasswordRequest,
} from "../../api/auth.api";

/*
-----------------------------------
LOGIN
-----------------------------------
*/
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/*
-----------------------------------
REGISTER
-----------------------------------
*/
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || "Registration failed");
    }
  }
);

/*
-----------------------------------
PROFILE
-----------------------------------
*/
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await updateProfileRequest(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Profile update failed");
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  "auth/deleteUserAccount",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await deleteUserAccountRequest(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Delete request failed");
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "auth/resetUserPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await resetUserPasswordRequest(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Password reset failed");
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  profileUpdating: false,
  adminActionLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.user)
        );
        console.log("Login successful:", action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.profileUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileUpdating = false;
        if (action.payload?.user) {
          state.user = action.payload.user;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileUpdating = false;
        state.error = action.payload;
      })

      // DELETE USER ACCOUNT
      .addCase(deleteUserAccount.pending, (state) => {
        state.adminActionLoading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state, action) => {
        state.adminActionLoading = false;
        const deletedUserId = action.meta?.arg?.userId;
        if (deletedUserId && state.user?._id === deletedUserId) {
          state.user = null;
          state.token = null;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.adminActionLoading = false;
        state.error = action.payload;
      })

      // RESET PASSWORD
      .addCase(resetUserPassword.pending, (state) => {
        state.adminActionLoading = true;
        state.error = null;
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.adminActionLoading = false;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.adminActionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
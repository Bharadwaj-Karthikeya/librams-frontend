import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  issueBookAPI,
  returnIssueAPI,
  extendDueDateAPI,
  fetchUserIssuesAPI,
  fetchAllIssuesAPI,
  fetchOverdueIssuesAPI,
} from "../../api/issue.api";

export const issueBook = createAsyncThunk(
  "issues/issueBook",
  async (data, { rejectWithValue }) => {
    try {
      const res = await issueBookAPI(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Issue failed");
    }
  }
);

export const returnIssue = createAsyncThunk(
  "issues/returnIssue",
  async (id, { rejectWithValue }) => {
    try {
      const res = await returnIssueAPI(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Return failed");
    }
  }
);

export const extendDueDate = createAsyncThunk(
  "issues/extendDueDate",
  async ({ id, newDueDate }, { rejectWithValue }) => {
    try {
      const res = await extendDueDateAPI(id, newDueDate);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Extend failed");
    }
  }
);

export const fetchUserIssues = createAsyncThunk(
  "issues/fetchUserIssues",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchUserIssuesAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch");
    }
  }
);

export const fetchAllIssues = createAsyncThunk(
  "issues/fetchAllIssues",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchAllIssuesAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch");
    }
  }
);

export const fetchOverdueIssues = createAsyncThunk(
  "issues/fetchOverdueIssues",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchOverdueIssuesAPI();
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch");
    }
  }
);

const issueSlice = createSlice({
  name: "issues",
  initialState: {
    issues: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith("issues/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("issues/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          if (Array.isArray(action.payload)) {
            state.issues = action.payload;
          }
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("issues/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default issueSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  issueBookAPI,
  returnIssueAPI,
  extendDueDateAPI,
  fetchUserIssuesAPI,
  fetchAllIssuesAPI,
  fetchOverdueIssuesAPI,
  fetchBookIssueHistoryAPI,
  fetchIssueDetailsAPI,
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

export const fetchBookIssueHistory = createAsyncThunk(
  "issues/fetchBookIssueHistory",
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await fetchBookIssueHistoryAPI(bookId);
      return { history: res.data };
    } catch (err) {
      return rejectWithValue("Failed to load issue history");
    }
  }
);

export const fetchIssueDetails = createAsyncThunk(
  "issues/fetchIssueDetails",
  async (issueId, { rejectWithValue }) => {
    try {
      const res = await fetchIssueDetailsAPI(issueId);
      return { issue: res.data };
    } catch (err) {
      return rejectWithValue("Failed to load issue details");
    }
  }
);

const setListPending = (state) => {
  state.loading = true;
  state.error = null;
};

const setListRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const issueSlice = createSlice({
  name: "issues",
  initialState: {
    issues: [],
    loading: false,
    error: null,
    bookIssueHistory: [],
    selectedIssueDetails: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserIssues.pending, setListPending)
      .addCase(fetchUserIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload;
      })
      .addCase(fetchUserIssues.rejected, setListRejected)

      .addCase(fetchAllIssues.pending, setListPending)
      .addCase(fetchAllIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload;
      })
      .addCase(fetchAllIssues.rejected, setListRejected)

      .addCase(fetchOverdueIssues.pending, setListPending)
      .addCase(fetchOverdueIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload;
      })
      .addCase(fetchOverdueIssues.rejected, setListRejected)

      .addCase(fetchBookIssueHistory.fulfilled, (state, action) => {
        state.bookIssueHistory = action.payload.history || [];
      })
      .addCase(fetchBookIssueHistory.rejected, (state) => {
        state.bookIssueHistory = [];
      })
      .addCase(fetchIssueDetails.fulfilled, (state, action) => {
        state.selectedIssueDetails = action.payload.issue || null;
      })
      .addCase(fetchIssueDetails.rejected, (state) => {
        state.selectedIssueDetails = null;
      });
  },
});

export default issueSlice.reducer;
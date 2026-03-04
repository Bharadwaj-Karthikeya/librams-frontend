import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import booksReducer from "./slices/booksSlice.js";
import issuesReducer from "./slices/issueSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    issues: issuesReducer,
  },
});
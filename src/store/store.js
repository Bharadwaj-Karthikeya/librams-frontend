import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import booksReducer from "./slices/booksSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
  },
});
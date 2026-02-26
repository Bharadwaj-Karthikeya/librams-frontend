import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBooks } from "../../api/book.api";

/*
------------------------------------
FETCH BOOKS
------------------------------------
*/
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBooks();
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch books");
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default booksSlice.reducer;
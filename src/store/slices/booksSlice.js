import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBooks,
  getBookById,
  createBook as createBookAPI,
  updateBook as updateBookAPI,
  deleteBook as deleteBookAPI,
  deleteBookPermanently as deleteBookPermanentlyAPI,
} from "../../api/books.api";

/* FETCH ALL */
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getBooks();
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.message);
    }
  }
);

/* FETCH SINGLE */
export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getBookById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.message);
    }
  }
);

/* CREATE */
export const createBook = createAsyncThunk(
  "books/createBook",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      const res = await createBookAPI(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Create failed"
      );
    }
  }
);

/* UPDATE */
export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ bookId, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Required
      formData.append("bookId", bookId);

      // Only allowed editable fields
      const allowedFields = [
        "title",
        "author",
        "copies",
        "availableCopies",
        "publishedYear",
        "category",
        "isActive",
        "isAvailableforIssue",
        "bookCover",
      ];

      allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
          formData.append(field, data[field]);
        }
        console.log(field, data[field]);
      });

      const res = await updateBookAPI(formData);
      return res.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Update failed"
      );
    }
  }
);

/* DELETE */
export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (bookId, { rejectWithValue }) => {
    try {
      await deleteBookAPI(bookId);
      return bookId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);

export const deleteBookPermanently = createAsyncThunk(
  "books/deleteBookPermanently",
  async (bookId, { rejectWithValue }) => {
    try {
      await deleteBookPermanentlyAPI(bookId);
      return bookId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Hard delete failed"
      );
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    selectedBook: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.selectedBook = action.payload;
      })

      .addCase(createBook.fulfilled, (state, action) => {
        state.books.unshift(action.payload);
      })

      .addCase(updateBook.fulfilled, (state, action) => {
        state.books = state.books.map((b) =>
          b._id === action.payload._id
            ? action.payload
            : b
        );
      })

      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(
          (b) => b._id !== action.payload
        );
      })

      .addCase(deleteBookPermanently.fulfilled, (state, action) => {
        state.books = state.books.filter(
          (b) => b._id !== action.payload
        );
      });
  },
});

export default booksSlice.reducer;
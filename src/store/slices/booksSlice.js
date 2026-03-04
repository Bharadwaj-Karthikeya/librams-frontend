import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBooks,
  getBookById,
  createBook as createBookAPI,
  updateBook as updateBookAPI,
  deleteBook as deleteBookAPI,
  deleteBookPermanently as deleteBookPermanentlyAPI,
  searchBooks as searchBooksAPI,
  getBooksByCategory as getBooksByCategoryAPI,
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

/* SEARCH */
export const searchBooksByTerm = createAsyncThunk(
  "books/searchBooksByTerm",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const res = await searchBooksAPI(searchTerm);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.message || err?.response?.data?.message || "Search failed"
      );
    }
  }
);

/* CATEGORY */
export const fetchBooksByCategory = createAsyncThunk(
  "books/fetchBooksByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const res = await getBooksByCategoryAPI(category);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.message || err?.response?.data?.message || "Category fetch failed"
      );
    }
  }
);

/* CREATE */
export const createBook = createAsyncThunk(
  "books/createBook",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const allowedFields = [
        "title",
        "author",
        "isbn",
        "category",
        "description",
        "publishedYear",
        "copies",
      ];

      allowedFields.forEach((field) => {
        const value = data[field];
        if (value === undefined || value === null || value === "") {
          return;
        }
        formData.append(field, value);
      });

      if (data.bookCoverFile) {
        formData.append("bookCover", data.bookCoverFile);
      }

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
        "publishedYear",
        "copies",
        "availableCopies",
        "category",
        "description",
        "isActive",
        "isAvailableforIssue",
      ];

      allowedFields.forEach((field) => {
        const value = data[field];
        if (value === undefined || value === null || value === "") {
          return;
        }
        formData.append(field, value);
      });

      if (data.bookCoverFile) {
        formData.append("bookCover", data.bookCoverFile);
      }

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
    allBooks: [],
    selectedBook: null,
    loading: false,
    error: null,
    currentSearchTerm: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentSearchTerm = "";
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
        state.allBooks = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load books";
      })

      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedBook = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load book";
        state.selectedBook = null;
      })

      .addCase(searchBooksByTerm.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentSearchTerm = action.meta.arg || "";
      })
      .addCase(searchBooksByTerm.fulfilled, (state, action) => {
        if (action.meta.arg !== state.currentSearchTerm) {
          return;
        }
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(searchBooksByTerm.rejected, (state, action) => {
        if (action.meta.arg !== state.currentSearchTerm) {
          return;
        }
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBooksByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentSearchTerm = "";
      })
      .addCase(fetchBooksByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooksByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createBook.fulfilled, (state, action) => {
        state.books.unshift(action.payload);
        state.allBooks.unshift(action.payload);
      })

      .addCase(updateBook.fulfilled, (state, action) => {
        state.books = state.books.map((b) =>
          b._id === action.payload._id
            ? action.payload
            : b
        );
        state.allBooks = state.allBooks.map((b) =>
          b._id === action.payload._id
            ? action.payload
            : b
        );
      })

      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(
          (b) => b._id !== action.payload
        );
        state.allBooks = state.allBooks.filter(
          (b) => b._id !== action.payload
        );
      })

      .addCase(deleteBookPermanently.fulfilled, (state, action) => {
        state.books = state.books.filter(
          (b) => b._id !== action.payload
        );
        state.allBooks = state.allBooks.filter(
          (b) => b._id !== action.payload
        );
      });
  },
});

export default booksSlice.reducer;
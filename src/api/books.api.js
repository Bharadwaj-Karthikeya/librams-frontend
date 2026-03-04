// src/api/books.api.js

import api from "./axios.js";

// GET ALL
export const getBooks = () =>
  api.get("/books/all");

// GET DETAILS
export const getBookById = (bookId) =>
  api.get(`/books/details/${bookId}`);

// GET CATEGORY
export const getBooksByCategory = (category) =>
  api.get(`/books/category/${encodeURIComponent(category)}`);

// CREATE
export const createBook = (formData) =>
  api.post("/books/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// UPDATE
export const updateBook = (formData) =>
  api.patch("/books/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// SOFT DELETE
export const deleteBook = (bookId) =>
  api.delete("/books/delete", {
    data: { bookId },
  });

// HARD DELETE
export const deleteBookPermanently = (bookId) =>
  api.delete("/books/delete-complete", {
    data: { bookId },
  });

// SEARCH
export const searchBooks = (searchTerm) =>
  api.get(`/books/search?searchTerm=${encodeURIComponent(searchTerm)}`);
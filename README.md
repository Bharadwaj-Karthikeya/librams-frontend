# Liberams Frontend

Liberams Frontend is a React + Vite client for a library circulation and catalog system. It provides role-aware dashboards, book management, and issue tracking for students, staff, and admins.

## Features
- Authentication flows for login and registration with session persistence in localStorage.
- Role-aware navigation and actions for student, staff, and admin users.
- Protected routes with optional role gating via `ProtectedRoute`.
- Dashboard views for staff/admin metrics and student loan summaries.
- Book catalog with search (debounced), category filters, and detail views.
- Book creation and editing with cover upload, availability toggles, and validation.
- Soft delete and permanent delete for books (admin only for permanent delete).
- Issue management: issue a book, return, extend due dates, and view details.
- Issue history by book and detailed issue modal views.
- Student-only issue list with status filters.
- Profile management with avatar upload, password change, and admin/staff tools.
- Shared UI system: Button, Input, Select, Textarea, Card, Badge, FilterPill, Modal, ConfirmModal, Spinner, and ToastProvider.
- Utility helpers for date formatting and className composition.

## Routes
- `/` and `/login`: login screen
- `/register`: account registration
- `/dashboard`: role-aware overview
- `/books`: catalog list, search, filters, and book CRUD (staff/admin)
- `/books/:id`: book detail view and issue history (staff/admin)
- `/issues`: issue management (staff/admin) or personal issues (students)
- `/my-issues`: student-only list with status filters
- `/profile`: profile management and admin/staff tools

## State Management
Redux Toolkit store with slices:
- `authSlice`: login, register, fetch/update profile, change/reset password, update role, delete account, logout, and session persistence.
- `booksSlice`: fetch list/details, search, category fetch, create/update, soft delete, and permanent delete.
- `issueSlice`: issue book, return, extend due date, fetch user/all/overdue issues, book issue history, and issue detail fetch.

## API Integration
Axios instance:
- Base URL from `VITE_API_URL` (defaults to `http://localhost:5000`).
- Authorization header from localStorage token.
- Auto logout on 401 responses.

Service modules:
- `auth.api.js`: signup, login, profile get/update, delete user, reset/change password, update role.
- `books.api.js`: list, details, category, search, create/update with multipart, soft/hard delete.
- `issue.api.js`: issue, return, extend due date, fetch user/all/overdue issues, book history, issue details.

## Project Structure
```
src/
	api/            # Axios instance and API service modules
	components/     # Books, Issue, layout, and shared UI components
	hooks/          # Auth helpers
	pages/          # Route-level screens
	routes/         # AppRoutes and ProtectedRoute
	store/          # Redux store and slices
	utils/          # Shared helper utilities
```

## Tech Stack
- **Core**: React, React DOM, Vite
- **Routing**: React Router
- **State**: Redux Toolkit, React Redux
- **Styling**: Tailwind CSS, @tailwindcss/vite
- **HTTP**: Axios
- **UI**: lucide-react, react-hot-toast

## Tooling
- ESLint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals
- @vitejs/plugin-react
- @types/react, @types/react-dom

## Scripts
- `npm run dev` - start the dev server
- `npm run build` - build for production
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## Getting Started
1. `npm install`
2. `npm run dev`

## Environment Variables
- `VITE_API_URL` - backend base URL

## Deployment Link
- `Vercel Deployment` - ([liberams-frontend.vercel.app](https://liberams-frontend.vercel.app))
- `Render Backend Deployment` - ([liberams-backend.onrender.com](https://liberams-backend.onrender.com))

## Backend Repository Link
- `Liberams Backend Repo` - ([Backend](https://github.com/Bharadwaj-Karthikeya/librams-backend))
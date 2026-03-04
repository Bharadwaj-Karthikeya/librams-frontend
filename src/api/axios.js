import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
----------------------------------
REQUEST INTERCEPTOR
----------------------------------
*/
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
----------------------------------
RESPONSE INTERCEPTOR
----------------------------------
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      // Auto logout if token expired or unauthorized
      if (response.status === 401) {
        store.dispatch(logout());
        window.location.href = "/";
      }

      return Promise.reject(response.data);
    }

    return Promise.reject(error.message);
  }
);

export default api;
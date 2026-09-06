import axios from "axios";

// One shared Axios instance for the whole app, instead of writing the
// base URL and headers out separately in every component.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Runs before every single request this instance sends. Reads the token
// out of localStorage (where AuthContext stores it after login) and
// attaches it as "Authorization: Bearer <token>" automatically — so
// individual components never need to remember to add it themselves.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

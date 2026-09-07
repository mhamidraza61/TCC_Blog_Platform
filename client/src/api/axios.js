import axios from "axios";

// One shared Axios instance for the whole app, instead of writing the
// base URL and headers out separately in every component.
//
// withCredentials: true tells the browser to include cookies on every
// request this instance sends (and to accept Set-Cookie from
// responses). This is the ONLY thing needed on the frontend for
// cookie-based auth to work — there is no token to read or attach
// manually anymore, since the httpOnly cookie set by the backend is
// invisible to this JavaScript entirely and the browser handles sending
// it automatically.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;

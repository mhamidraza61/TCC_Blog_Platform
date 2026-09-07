import api from "./axios";

// Every function here does exactly one thing: call one backend endpoint
// and hand back its data. Pages import these instead of calling
// api.post/api.get directly — that keeps "how do I talk to the backend"
// separate from "what does this page do with the result," and means the
// URL for a given action only ever needs to be typed in one place.

export const register = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

export const login = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

// Asks the backend "who am I?" using whatever cookie the browser has —
// this is how the app finds out if someone's still logged in after a
// page refresh, since the token itself is no longer readable by this
// JavaScript at all.
export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

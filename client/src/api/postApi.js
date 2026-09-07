import api from "./axios";

// Same idea as authApi.js — one function per backend endpoint, so
// pages never construct a URL or call api.get/post/put/delete directly.

export const getPosts = async ({ page, search, tag } = {}) => {
  const { data } = await api.get("/posts", {
    params: { page, search: search || undefined, tag: tag || undefined },
  });
  return data;
};

export const getPostById = async (id) => {
  const { data } = await api.get(`/posts/${id}`);
  return data;
};

// formData is a browser FormData object — required because a post can
// include a binary image file alongside its text fields, and a plain
// JSON body has no way to carry that.
export const createPost = async (formData) => {
  const { data } = await api.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updatePost = async (id, formData) => {
  const { data } = await api.put(`/posts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deletePost = async (id) => {
  const { data } = await api.delete(`/posts/${id}`);
  return data;
};

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { postSchema } from "../validation/postSchema";
import ErrorBanner from "../components/ErrorBanner";
import Spinner from "../components/Spinner";

// One component handles both "Create a post" and "Edit a post" — the
// only difference is whether an :id param is present in the URL, and
// whether we pre-fill the form with an existing post's data.
export default function PostForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(postSchema) });

  // In edit mode, fetch the existing post and pre-fill the form once it
  // arrives. reset() from react-hook-form replaces the form's current
  // values, which is how pre-filling an already-rendered form works.
  useEffect(() => {
    if (!isEditMode) return;

    let cancelled = false;
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        if (!cancelled) {
          reset({
            title: data.title,
            content: data.content,
            tags: data.tags?.join(", ") || "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setServerError(err.response?.data?.message || "Couldn't load this post.");
        }
      } finally {
        if (!cancelled) setLoadingPost(false);
      }
    };

    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [id, isEditMode, reset]);

  const onSubmit = async (values) => {
    setServerError("");
    setSubmitting(true);
    try {
      if (isEditMode) {
        await api.put(`/posts/${id}`, values);
        navigate(`/posts/${id}`);
      } else {
        const { data } = await api.post("/posts", values);
        navigate(`/posts/${data._id}`);
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Couldn't save this post. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPost) return <Spinner />;

  return (
    <div className="post-form-page">
      <h1>{isEditMode ? "Edit post" : "Write a post"}</h1>
      <ErrorBanner message={serverError} />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" {...register("title")} />
        {errors.title && <p className="field-error">{errors.title.message}</p>}

        <label htmlFor="content">Content</label>
        <textarea id="content" rows={10} {...register("content")} />
        {errors.content && (
          <p className="field-error">{errors.content.message}</p>
        )}

        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          type="text"
          placeholder="e.g. mern, tutorial, react"
          {...register("tags")}
        />
        <p className="field-hint">Separate tags with commas.</p>

        <button type="submit" disabled={submitting}>
          {submitting
            ? "Saving…"
            : isEditMode
            ? "Save changes"
            : "Publish post"}
        </button>
      </form>
    </div>
  );
}

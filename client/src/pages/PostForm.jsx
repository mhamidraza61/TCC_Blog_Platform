import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import * as postApi from "../api/postApi";
import { postSchema } from "../validation/postSchema";
import ErrorBanner from "../components/ErrorBanner";
import Spinner from "../components/Spinner";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // matches server/middleware/upload.js

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

  // Image state lives outside react-hook-form because a <input type="file">
  // can't be usefully validated by Zod the same way text fields can — we
  // handle the file and its preview URL ourselves instead.
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");

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
        const data = await postApi.getPostById(id);
        if (!cancelled) {
          reset({
            title: data.title,
            content: data.content,
            tags: data.tags?.join(", ") || "",
          });
          if (data.coverImage?.url) {
            setImagePreview(data.coverImage.url);
          }
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

  // Revoke any object URL we created for a preview when the component
  // unmounts or a new file replaces it — otherwise the browser keeps
  // that temporary URL (and the memory behind it) alive forever.
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageError("");
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setImageError("Only JPEG, PNG, and WebP images are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values) => {
    setServerError("");
    setSubmitting(true);
    try {
      // FormData is required to send a file alongside regular text
      // fields — a plain JSON body has no way to carry binary data.
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("tags", values.tags.join(","));
      if (imageFile) {
        formData.append("coverImage", imageFile);
      }

      if (isEditMode) {
        await postApi.updatePost(id, formData);
        navigate(`/posts/${id}`);
      } else {
        const data = await postApi.createPost(formData);
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

        <label htmlFor="coverImage">Cover image</label>
        <input
          id="coverImage"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
        />
        <p className="field-hint">JPEG, PNG, or WebP, up to 5MB. Optional.</p>
        {imageError && <p className="field-error">{imageError}</p>}
        {imagePreview && (
          <img src={imagePreview} alt="Cover preview" className="image-preview" />
        )}

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

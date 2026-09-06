import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import ErrorBanner from "../components/ErrorBanner";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        if (!cancelled) setPost(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Couldn't load this post.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't delete this post.");
      setDeleting(false);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBanner message={error} />;
  if (!post) return null;

  // Only show edit/delete if the logged-in user is actually this post's
  // author — mirrors the same check the backend's isPostAuthor middleware
  // enforces, so the UI never even offers an action the API would reject.
  const isAuthor = user && post.author?._id === user._id;

  return (
    <article className="post-detail">
      <h1>{post.title}</h1>
      <div className="post-detail-meta">
        <span>{post.author?.name || "Unknown author"}</span>
        <time dateTime={post.createdAt}>
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
      {post.coverImage?.url && (
        <img
          src={post.coverImage.url}
          alt=""
          className="post-detail-image"
        />
      )}
      {post.tags?.length > 0 && (
        <div className="post-card-tags">
          {post.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="post-detail-content">{post.content}</p>

      {isAuthor && (
        <div className="post-detail-actions">
          <Link to={`/posts/${id}/edit`} className="button-secondary">
            Edit
          </Link>
          <button onClick={handleDelete} disabled={deleting} className="button-danger">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}
    </article>
  );
}

import { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import ErrorBanner from "../components/ErrorBanner";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        if (!cancelled) setPosts(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Couldn't load posts.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();
    // Cleanup flag prevents setting state after this component has
    // already unmounted (e.g. if the user navigates away mid-request).
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="home-page">
      <ErrorBanner message={error} />
      {!error && posts.length === 0 && (
        <p className="empty-state">
          No posts yet. Be the first to write one.
        </p>
      )}
      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

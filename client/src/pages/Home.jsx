import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import ErrorBanner from "../components/ErrorBanner";
import Pagination from "../components/Pagination";
import SearchFilterBar from "../components/SearchFilterBar";

export default function Home() {
  // Storing search/tag/page in the URL (not just component state) means
  // the current filters survive a page refresh and can be shared as a
  // link — e.g. /?search=react&tag=mern&page=2 is a real, reloadable URL.
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const urlSearch = searchParams.get("search") || "";
  const tag = searchParams.get("tag") || "";

  // Local state for the search box lets typing feel instant, while the
  // actual API call (tied to urlSearch) only fires after the debounce
  // below settles — otherwise every keystroke would trigger a request.
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce: wait 400ms after the user stops typing before updating the
  // URL (which triggers the actual fetch below). Without this, typing
  // "react" would fire 5 separate API requests, one per keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== urlSearch) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput) next.set("search", searchInput);
          else next.delete("search");
          next.set("page", "1"); // reset to page 1 on a new search
          return next;
        });
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/posts", {
          params: { page, search: urlSearch || undefined, tag: tag || undefined },
        });
        if (!cancelled) {
          setPosts(data.posts);
          setPagination(data.pagination);
          // Build the tag filter's options from whatever tags appear on
          // this page of posts. A dedicated "list all tags" endpoint
          // would be more complete, but this keeps Week 4 scoped to what
          // the existing API already returns.
          const tagsOnPage = new Set(data.posts.flatMap((p) => p.tags || []));
          setAvailableTags((prev) => {
            const merged = new Set([...prev, ...tagsOnPage]);
            return Array.from(merged).sort();
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Couldn't load posts.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [page, urlSearch, tag]);

  const handleTagChange = (newTag) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newTag) next.set("tag", newTag);
      else next.delete("tag");
      next.set("page", "1");
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="home-page">
      <SearchFilterBar
        search={searchInput}
        onSearchChange={setSearchInput}
        tag={tag}
        onTagChange={handleTagChange}
        availableTags={availableTags}
      />

      <ErrorBanner message={error} />

      {loading ? (
        <Spinner />
      ) : (
        <>
          {!error && posts.length === 0 && (
            <p className="empty-state">
              {urlSearch || tag
                ? "No posts match your search."
                : "No posts yet. Be the first to write one."}
            </p>
          )}
          <div className="post-list">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          <Pagination
            page={pagination.page || page}
            totalPages={pagination.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";

function excerpt(text, maxLength = 160) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link to={`/posts/${post._id}`} className="post-card-title">
        {post.title}
      </Link>
      <p className="post-card-excerpt">{excerpt(post.content)}</p>
      <div className="post-card-meta">
        <span>{post.author?.name || "Unknown author"}</span>
        <time dateTime={post.createdAt}>
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
        {post.tags?.length > 0 && (
          <div className="post-card-tags">
            {post.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

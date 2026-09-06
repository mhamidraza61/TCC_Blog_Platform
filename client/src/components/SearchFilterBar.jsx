export default function SearchFilterBar({
  search,
  onSearchChange,
  tag,
  onTagChange,
  availableTags,
}) {
  return (
    <div className="search-filter-bar">
      <input
        type="search"
        placeholder="Search posts…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
        aria-label="Search posts"
      />
      <select
        value={tag}
        onChange={(e) => onTagChange(e.target.value)}
        className="tag-select"
        aria-label="Filter by tag"
      >
        <option value="">All tags</option>
        {availableTags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

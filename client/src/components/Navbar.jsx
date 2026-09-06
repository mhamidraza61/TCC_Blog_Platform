import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        TCC Blog
      </Link>
      <nav className="navbar-links">
        {user ? (
          <>
            <Link to="/posts/new">Write a post</Link>
            <span className="navbar-user">{user.name}</span>
            <button className="link-button" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="navbar-cta">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

// Wraps any route that requires a logged-in user. If there's no user in
// context, redirect to /login instead of rendering the protected page.
//
// The "loading" check matters now in a way it didn't before: on a hard
// page refresh, AuthContext doesn't know yet whether the httpOnly cookie
// represents a valid session — it has to ask the backend first (see
// AuthContext's /auth/me call). Without this check, a logged-in user
// refreshing this page would flash-redirect to /login for a moment
// before the session check finished, since `user` starts as null.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

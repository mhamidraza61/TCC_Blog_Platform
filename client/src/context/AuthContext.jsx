import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Starts true because on first load we don't yet know if there's a
  // valid session cookie or not — we have to ask the backend. Every
  // consumer of this context should wait for this to become false
  // before deciding "show the logged-out UI."
  const [loading, setLoading] = useState(true);

  // On first mount, ask the backend "who am I?" using whatever cookie
  // the browser already has (if any). This replaces reading a token out
  // of localStorage — since the token is httpOnly now, this app has no
  // other way to know if a previous login is still valid.
  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await authApi.getMe();
        setUser(data);
      } catch {
        // A 401 here just means "not logged in" — completely normal for
        // a first-time visitor, not an error worth showing anyone.
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const register = async (values) => {
    const data = await authApi.register(values);
    setUser(data);
  };

  const login = async (values) => {
    const data = await authApi.login(values);
    setUser(data);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components use `const { user, login } = useAuth()`
// instead of importing useContext + AuthContext separately every time.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

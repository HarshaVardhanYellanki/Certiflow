import { useEffect, useState, type FormEvent } from "react";
import { api } from "./api";
import type { User, ApiResponse } from "./types";

import Login from "./components/auth/Login";
import DashboardPage from "./pages/DashboardPage";

import "./App.css";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Restore previous session
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthChecking(false);
      return;
    }

    api<ApiResponse<{ user: User }>>("/auth/me")
      .then((result) => {
        setUser(result.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, []);

  // Login
  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await api<
        ApiResponse<{ token: string; user: User }>
      >("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", result.data.token);
      setUser(result.data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError("");
    setEmail("");
    setPassword("");
  };

  if (authChecking) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Loading CertiFlow...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Login
        email={email}
        password={password}
        loading={loading}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={login}
      />
    );
  }

  return (
    <DashboardPage
      user={user}
      onLogout={logout}
    />
  );
}
interface LoginProps {
  email: string;
  password: string;
  loading: boolean;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Login({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginProps) {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <h1>CertiFlow</h1>
        </div>

        <p className="subtitle">
          Skilling Certificate Issuance Platform
        </p>

        <h2>Welcome back</h2>
        <p className="muted">Sign in to your account</p>

        <form onSubmit={onSubmit}>
          <label>Email address</label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button
            className="primary full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="demo-box">
          <strong>Demo Credentials</strong>
          <p>anika@certiflow.demo</p>
          <p>Password: CertiFlow@123</p>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { redirect, Link } from "@tanstack/react-router";
import { signIn } from "@/shared/api/auth-client";
import type { SubmitEvent } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleEmailLogin = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    const { data, error } = await signIn.email({
      email: form.email,
      password: form.password,
      callbackURL: "/dashboard",
    });

    setPending(false);

    if (error) {
      setError("Invalid email or password");
      return;
    }

    redirect({ to: "/dashboard" });
  };

  // ──── Google OAuth ────────────────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setError(null);

    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/login?error=oauth_failed",
    });
  };

  return (
    <div>
      <h2>Sign in</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Google OAuth button */}
      <button onClick={handleGoogleLogin} type="button">
        Continue with Google
      </button>

      <hr />

      <form onSubmit={handleEmailLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="current-password"
          />
        </div>

        <Link to="/forget-password">Forgot password</Link>

        <button type="submit" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p>
        No account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}

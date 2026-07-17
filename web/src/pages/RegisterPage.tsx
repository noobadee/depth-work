import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { signUp } from "../lib/auth.client.ts";
import type { SubmitEvent } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    const { data, error } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    setPending(false);

    if (error) {
      setError(error.message ?? "Registration failed");
      return;
    }

    setVerificationSent(true);
  };

  if (verificationSent) {
    return (
      <div>
        <h2>Check your email</h2>
        <p>
          We sent a verification link to <strong>{form.email}</strong>. Click is
          to activate your account.
        </p>
        <p>
          Wrong email?{" "}
          <button onClick={() => setVerificationSent(false)}>Go back</button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Create account</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            autoComplete="name"
          />
        </div>

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
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" disabled={pending}>
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

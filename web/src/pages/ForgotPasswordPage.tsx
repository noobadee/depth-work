import { useState } from "react";
import { authClient } from "../lib/auth.client.ts";
import type { SubmitEvent } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setPending(false);

    await authClient.forgetPassword({
      email,
      redirectTo: `${import.meta.env.VITE_API_URL}/reset-password`,
    });

    setPending(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <h2>Check your email</h2>
        <p>If an account exists for that email, we sent a reset link.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Reset password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
        <button type="submit" disabled={pending}>
          {pending ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </div>
  );
}

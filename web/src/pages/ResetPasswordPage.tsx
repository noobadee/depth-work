import { useState } from "react";
import { redirect, useSearch } from "@tanstack/react-router";
import { authClient } from "../lib/auth.client.ts";
import type { SubmitEvent } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const { token } = useSearch({ from: "/reset-password" });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid or expired reset link");
      return;
    }

    setPending(true);

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    setPending(false);

    if (error) {
      setError(error.message ?? "Reset failed");
      return;
    }

    redirect({ to: "/login?reset=sucess" });
  };

  return (
    <div>
      <h2>Set new password</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          minLength={8}
          required
          autoCapitalize="new-password"
        />
        <button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Set new password"}
        </button>
      </form>
    </div>
  );
}

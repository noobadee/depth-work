import { useState } from "react";
import { Link, redirect } from "@tanstack/react-router";
import { signIn } from "@/shared/api/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/kit/card";
import { Label } from "@/shared/ui/kit/label";
import { Input } from "@/shared/ui/kit/input";
import { Button } from "@/shared/ui/kit/button";
import GoogleSignInButton from "@/shared/ui/components/button-sign-in-google";
import type { SubmitEvent } from "react";

export default function LoginCard() {
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
    <Card className="min-w-sm px-4 py-8">
      <CardHeader className="flex flex-col items-center gap-6 mb-4">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          Depthwork
        </p>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
      </CardHeader>
      <CardContent>
        <GoogleSignInButton
          onClick={handleGoogleLogin}
          label="Sign in with Google"
        />
        <p className="flex items-center gap-4 text-xs text-gray-400 py-8">
          <span className="h-px flex-1 bg-gray-300"></span>
          or continue with email
          <span className="h-px flex-1 bg-gray-300"></span>
        </p>

        {error && (
          <div className="text-red-500 text-center mb-2">
            Invalid email or password
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@company.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="cursor-pointer mt-4"
            disabled={pending}
          >
            {pending ? "Logging in..." : "Log in"}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-gray-700 font-semibold hover:shadow-[inset_0_-1px_0_0_#364153] transition-shadow duration-200"
          >
            Register
          </Link>{" "}
        </p>
      </CardContent>
    </Card>
  );
}

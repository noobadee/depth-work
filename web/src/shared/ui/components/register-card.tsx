import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { signUp } from "@/shared/api/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/kit/card";
import { Label } from "@/shared/ui/kit/label";
import { Input } from "@/shared/ui/kit/input";
import { Button } from "@/shared/ui/kit/button";
import type { SubmitEvent } from "react";

export default function RegisterCard() {
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
    <Card className="min-w-sm px-4 py-8">
      <CardHeader className="flex flex-col items-center gap-6 mb-4">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
          Depthwork
        </p>
        <CardTitle className="text-2xl">Create your account</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 text-center mb-2">
            Invalid email or password
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Mark Mendez"
              required
              autoComplete="name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
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
            {pending ? "Registering..." : "Register"}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gray-700 font-semibold hover:shadow-[inset_0_-1px_0_0_#364153] transition-shadow duration-200"
          >
            Login
          </Link>{" "}
        </p>
      </CardContent>
    </Card>
  );
}

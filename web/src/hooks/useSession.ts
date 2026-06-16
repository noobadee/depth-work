import { useSession as useBetterAuthSession } from "../lib/auth.client.ts";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export function useSession() {
  const { data: session, isPending, error } = useBetterAuthSession();

  const status: SessionStatus = isPending ? "loading" : session ? "authenticated" : "unauthenticated";

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
    status,
    isLoading: isPending,
    isAuthenticated: status === "authenticated",
  };
}
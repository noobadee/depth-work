import { createAuthClient } from "better-auth/react";
import { env } from "@/shared/config/env";

export const authClient = createAuthClient({
  baseURL: env.apiBaseUrl,
  fetchOptions: {
    credentials: "include",
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;

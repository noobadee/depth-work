import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/shared/api/auth-client";

export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: async () => {
    const { data } = await authClient.getSession();
    return data; // { user, session  } | null
  },
  staleTime: 5 * 60 * 1000,
});

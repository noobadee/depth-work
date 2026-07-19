import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!context.session?.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

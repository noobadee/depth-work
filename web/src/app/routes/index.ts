import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context, location }) => {
    if (!context.session?.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

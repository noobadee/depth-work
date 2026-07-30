import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  beforeLoad: ({ context, location }) => {
    if (context.session?.user) {
      throw redirect({
        to: "/dashboard",
        search: { redirect: location.href },
      });
    }
  },
});

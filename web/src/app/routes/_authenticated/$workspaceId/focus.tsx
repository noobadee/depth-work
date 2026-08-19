import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/$workspaceId/focus")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/focus"!</div>;
}

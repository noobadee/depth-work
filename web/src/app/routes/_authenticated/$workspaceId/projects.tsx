import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/$workspaceId/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/projects"!</div>;
}

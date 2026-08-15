import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tasks")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/tasks"!</div>;
}

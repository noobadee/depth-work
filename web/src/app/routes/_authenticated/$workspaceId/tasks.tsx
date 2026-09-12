import { TaskPage } from "@/pages/tasks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/$workspaceId/tasks")({
  component: TaskPage,
});

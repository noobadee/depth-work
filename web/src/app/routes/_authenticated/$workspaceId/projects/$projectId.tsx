import { ProjectDetail } from "@/pages/projects";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/$workspaceId/projects/$projectId",
)({
  component: ProjectDetail,
});

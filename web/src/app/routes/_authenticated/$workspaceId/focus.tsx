import { FocusPage } from "@/pages/focus";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/$workspaceId/focus")({
  component: FocusPage,
});

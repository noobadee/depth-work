import { workspacesQueryOptions } from "@/entities/workspace";
import { pickDefaultWorkspace } from "@/shared/utils";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  loader: async ({ context }) => {
    const workspacesResult = await context.queryClient.ensureQueryData(
      workspacesQueryOptions(),
    );

    if (workspacesResult.data.length === 0) {
      throw redirect({ to: "/onboarding" });
    }

    const defaultId = pickDefaultWorkspace(workspacesResult);

    throw redirect({
      to: "/$workspaceId/dashboard",
      params: { workspaceId: defaultId },
    });
  },
});

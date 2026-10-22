import type { WorkspaceResponse } from "@/entities/workspace";

export function pickDefaultWorkspace(
  workspacesResponse: WorkspaceResponse,
): string {
  const lastId = localStorage.getItem("lastWorkspaceId");

  if (
    lastId &&
    workspacesResponse.data.some((d) => d.workspace_id === lastId)
  ) {
    return lastId;
  }

  return workspacesResponse.data[0].workspace_id;
}

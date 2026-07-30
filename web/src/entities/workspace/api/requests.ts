export {
  fetchWorkspaces,
  fetchWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
export type { CreateWorkspaceInput, UpdateWorkspaceInput };

import { workspaceResponseSchema, type Workspace } from "@/entities/workspace";
import { httpClient, parseOrThrow } from "@/shared/api";

async function fetchWorkspaces(): Promise<Workspace> {
  const raw = await httpClient.get<unknown>("/workspaces");
  return parseOrThrow(workspaceResponseSchema, raw);
}

async function fetchWorkspace(workspaceId: string): Promise<Workspace> {
  const raw = await httpClient.get<unknown>(`/workspaces/${workspaceId}`);
  return parseOrThrow(workspaceResponseSchema, raw);
}

interface CreateWorkspaceInput {
  name: string;
  type: "personal" | "team";
}

async function createWorkspace(
  input: CreateWorkspaceInput,
): Promise<Workspace> {
  const raw = await httpClient.post<unknown>("/workspaces", input);
  return parseOrThrow(workspaceResponseSchema, raw);
}

interface UpdateWorkspaceInput {
  workspaceId: string;
  name: string;
}

async function updateWorkspace({
  workspaceId,
  ...input
}: UpdateWorkspaceInput): Promise<Workspace> {
  const raw = await httpClient.patch<unknown>(
    `/workspaces/${workspaceId}`,
    input,
  );
  return parseOrThrow(workspaceResponseSchema, raw);
}

async function deleteWorkspace(workspaceId: string): Promise<void> {
  await httpClient.delete<void>(`/workspaces/${workspaceId}`);
}

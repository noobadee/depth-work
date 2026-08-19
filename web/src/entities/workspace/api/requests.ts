export {
  fetchWorkspaces,
  fetchWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
export type { CreateWorkspaceInput, UpdateWorkspaceInput };

import {
  workspaceSchema,
  workspaceResponseSchema,
  type Workspace,
  type WorkspaceResponse,
} from "@/entities/workspace";
import { httpClient, parseOrThrow } from "@/shared/api";
import { env } from "@/shared/config/env";

async function fetchWorkspaces(): Promise<WorkspaceResponse> {
  const raw = await httpClient.get<unknown>("/workspaces");
  return parseOrThrow(workspaceResponseSchema, raw);
}

async function fetchWorkspace(workspaceId: string): Promise<Workspace> {
  const raw = await httpClient.get<unknown>(`/workspaces/${workspaceId}`);
  const parsed = parseOrThrow(workspaceResponseSchema, raw);
  const workspace = parsed.data[0];

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  return workspace;
}

interface CreateWorkspaceInput {
  name: string;
  type: "personal" | "team";
}

async function createWorkspace(
  input: CreateWorkspaceInput,
): Promise<WorkspaceResponse> {
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
}: UpdateWorkspaceInput): Promise<WorkspaceResponse> {
  const raw = await httpClient.patch<unknown>(
    `/workspaces/${workspaceId}`,
    input,
  );
  return parseOrThrow(workspaceResponseSchema, raw);
}

async function deleteWorkspace(workspaceId: string): Promise<void> {
  await httpClient.delete<void>(`/workspaces/${workspaceId}`);
}

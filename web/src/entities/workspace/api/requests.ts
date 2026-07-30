export {
  fetchWorkspaces,
  fetchWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
};
export type { CreateWorkspaceInput, UpdateWorkspaceInput };

import {
  workspaceListSchema,
  type Workspace,
} from "@/entities/workspace/model/schema";
import { httpClient, parseOrThrow } from "@/shared/api/index";

async function fetchWorkspaces(): Promise<Workspace> {
  const raw = await httpClient.get<unknown>("/workspaces");
  return parseOrThrow(workspaceListSchema, raw);
}

async function fetchWorkspace(workspaceId: string): Promise<Workspace> {
  const raw = await httpClient.get<unknown>(`/workspaces/${workspaceId}`);
  return parseOrThrow(workspaceListSchema, raw);
}

interface CreateWorkspaceInput {
  name: string;
  type: "personal" | "team";
}

async function createWorkspace(
  input: CreateWorkspaceInput,
): Promise<Workspace> {
  const raw = await httpClient.post<unknown>("/workspaces", input);
  return parseOrThrow(workspaceListSchema, raw);
}

interface UpdateWorkspaceInput {
  name: string;
}

async function updateWorkspace(
  workspaceId: string,
  input: UpdateWorkspaceInput,
): Promise<Workspace> {
  const raw = await httpClient.patch<unknown>(
    `/workspaces/${workspaceId}`,
    input,
  );
  return parseOrThrow(workspaceListSchema, raw);
}

async function deleteWorkspace(workspaceId: string): Promise<void> {
  await httpClient.delete<void>(`/workspaces/${workspaceId}`);
}

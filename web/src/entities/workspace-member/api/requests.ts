export {
  fetchWorkspaceMembers,
  createWorkspaceMember,
  updateWorkspaceMember,
  deleteWorkspaceMember,
};

import {
  workspaceMemberResponseSchema,
  type WorkspaceMember,
} from "@/entities/workspace-member";
import { httpClient, parseOrThrow } from "@/shared/api";

async function fetchWorkspaceMembers(
  workspaceId: string,
): Promise<WorkspaceMember> {
  const raw = await httpClient.get<unknown>(
    `/workspaces/${workspaceId}/members`,
  );
  return parseOrThrow(workspaceMemberResponseSchema, raw);
}

interface CreateWorkspaceMemberInput {
  workspaceId: string;
  role: "owner" | "admin" | "member" | "viewer";
  email: string;
}

async function createWorkspaceMember({
  workspaceId,
  ...input
}: CreateWorkspaceMemberInput): Promise<WorkspaceMember> {
  const raw = await httpClient.post<unknown>(
    `/workspaces/${workspaceId}/members`,
    input,
  );
  return parseOrThrow(workspaceMemberResponseSchema, raw);
}

interface UpdateWorkspaceMemberInput {
  userId: string;
  workspaceId: string;
  role: "owner" | "admin" | "member" | "viewer";
}

async function updateWorkspaceMember({
  userId,
  workspaceId,
  ...input
}: UpdateWorkspaceMemberInput): Promise<WorkspaceMember> {
  const raw = await httpClient.post<unknown>(
    `/workspaces/${workspaceId}/members/${userId}`,
    input,
  );
  return parseOrThrow(workspaceMemberResponseSchema, raw);
}

async function deleteWorkspaceMember({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}): Promise<void> {
  await httpClient.delete(`/workspaces/${workspaceId}/members/${userId}`);
}

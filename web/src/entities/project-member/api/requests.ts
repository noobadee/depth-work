export { fetchProjectMembers, createProjectMember, deleteProjectMember };

import {
  projectMemberResponseSchema,
  type ProjectMember,
} from "@/entities/project-member";
import { httpClient, parseOrThrow } from "@/shared/api";

async function fetchProjectMembers(projectId: string): Promise<ProjectMember> {
  const raw = await httpClient.get<unknown>(
    `/api/projects/${projectId}/members`,
  );
  return parseOrThrow(projectMemberResponseSchema, raw);
}

export interface CreateProjectMemberInput {
  projectId: string;
  email: string;
}

async function createProjectMember({
  projectId,
  ...input
}: CreateProjectMemberInput): Promise<ProjectMember> {
  const raw = await httpClient.post<unknown>(
    `/api/projects/${projectId}/members`,
    input,
  );
  return parseOrThrow(projectMemberResponseSchema, raw);
}

async function deleteProjectMember({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}): Promise<void> {
  await httpClient.delete<unknown>(
    `/api/projects/${projectId}/members/${userId}`,
  );
}

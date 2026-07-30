export {
  fetchProject,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
};

import { projectResponseSchema, type Project } from "@/entities/project";
import { httpClient, parseOrThrow } from "@/shared/api";

async function fetchProjects(workspaceId: string): Promise<Project> {
  const raw = await httpClient.get<unknown>(
    `/workspaces/${workspaceId}/projects`,
  );
  return parseOrThrow(projectResponseSchema, raw);
}

async function fetchProject(projectId: string): Promise<Project> {
  const raw = await httpClient.get<unknown>(`/projects/${projectId}`);
  return parseOrThrow(projectResponseSchema, raw);
}

interface CreateProjectInput {
  workspaceId: string;
  title: string;
  description?: string | null;
  status?: "pending" | "in_progress" | "completed" | "archived";
  startDate?: Date | null;
  dueDate?: Date | null;
  position?: number;
}

async function createProject({
  workspaceId,
  ...input
}: CreateProjectInput): Promise<Project> {
  const raw = await httpClient.post<unknown>(
    `/workspaces/${workspaceId}/projects`,
    input,
  );
  return parseOrThrow(projectResponseSchema, raw);
}

interface UpdateProjectInput {
  projectId: string;
  title?: string;
  description?: string | null;
  status?: "pending" | "in_progress" | "completed" | "archived";
  startDate?: Date | null;
  dueDate?: Date | null;
  position?: number;
}

async function updateProject({
  projectId,
  ...input
}: UpdateProjectInput): Promise<Project> {
  const raw = await httpClient.patch<unknown>(`/projects/${projectId}`, input);
  return parseOrThrow(projectResponseSchema, raw);
}

async function deleteProject(projectId: string): Promise<void> {
  await httpClient.delete<unknown>(`/projects/${projectId}`);
}

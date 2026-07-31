export {
  fetchTasks,
  fetchProjectTasks,
  fetchTask,
  createTask,
  createProjectTask,
  updateTask,
  deleteTask,
};

import { tasksResponseSchema, type Task } from "@/entities/task";
import { httpClient, parseOrThrow } from "@/shared/api";

async function fetchTasks(workspaceId: string): Promise<Task> {
  const raw = await httpClient.get<unknown>(`/workspaces/${workspaceId}/tasks`);
  return parseOrThrow(tasksResponseSchema, raw);
}

async function fetchProjectTasks(projectId: string): Promise<Task> {
  const raw = await httpClient.get<unknown>(`/projects/${projectId}/tasks`);
  return parseOrThrow(tasksResponseSchema, raw);
}

async function fetchTask(taskId: string): Promise<Task> {
  const raw = await httpClient.get<unknown>(`/tasks/${taskId}`);
  return parseOrThrow(tasksResponseSchema, raw);
}

export interface CreateTask {
  workspaceId: string;
  title: string;
  assignedTo?: string | null;
  description?: string | null;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in_progress" | "completed";
  dueDate?: Date | null;
  position?: number;
}

async function createTask({
  workspaceId,
  ...input
}: CreateTask): Promise<Task> {
  const raw = await httpClient.post<unknown>(
    `/workspaces/${workspaceId}/tasks`,
    input,
  );
  return parseOrThrow(tasksResponseSchema, raw);
}

export interface CreateProjectTask {
  projectId: string;
  title: string;
  assignedTo?: string | null;
  description?: string | null;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in_progress" | "completed";
  dueDate?: Date | null;
  position?: number;
}

async function createProjectTask({
  projectId,
  ...input
}: CreateProjectTask): Promise<Task> {
  const raw = await httpClient.post<unknown>(
    `/projects/${projectId}/tasks`,
    input,
  );
  return parseOrThrow(tasksResponseSchema, raw);
}

export interface UpdateTask {
  taskId: string;
  title?: string;
  assignedTo?: string | null;
  description?: string | null;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in_progress" | "completed";
  dueDate?: Date | null;
  position?: number;
}

async function updateTask({ taskId, ...input }: UpdateTask): Promise<Task> {
  const raw = await httpClient.patch<unknown>(`/tasks/${taskId}`, input);
  return parseOrThrow(tasksResponseSchema, raw);
}

async function deleteTask(taskId: string): Promise<void> {
  await httpClient.delete<unknown>(`/tasks/${taskId}`);
}

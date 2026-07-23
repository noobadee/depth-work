import type { NewTask, Task } from "@/db/schema/index.ts";

export interface ITaskRepository {
  findAllByWorkspace(workspaceId: string): Promise<Task[] | null>;
  findAllByProject(projectId: string): Promise<Task[] | null>;
  findById(id: string): Promise<Task | null>;
  findByTitle(title: string): Promise<Task | null>;
  findByTitleUnderProject(
    title: string,
    projectId: string,
  ): Promise<Task | null>;
  createTaskUnderWorkspace(
    workspaceId: string,
    data: NewTask,
  ): Promise<Task | null>;
  createTaskUnderProject(
    workspaceId: string,
    projectId: string,
    data: NewTask,
  ): Promise<Task | null>;
  update(
    id: string,
    data: Partial<
      Pick<
        Task,
        | "assignedTo"
        | "title"
        | "description"
        | "priority"
        | "status"
        | "due_date"
        | "completed_at"
        | "position"
      >
    >,
  ): Promise<Task | null>;
  delete(id: string): Promise<void>;
}

export interface ITaskService {
  getTasks(workspaceId: string): Promise<Task[] | null>;
  getTasksUnderProject(projectId: string): Promise<Task[] | null>;
  getTask(id: string): Promise<Task | null>;
  createTask(
    creatorId: string,
    workspaceId: string,
    body: CreateTaskInput,
  ): Promise<Task | null>;
  createTaskUnderProject(
    creatorId: string,
    workspaceId: string,
    projectId: string,
    body: CreateTaskInput,
  ): Promise<Task | null>;
  updateTask(id: string, body: UpdateTaskInput): Promise<Task | null>;
  deleteTask(id: string): Promise<void>;
}

export interface CreateTaskInput {
  title: string;
  assignedTo?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in_progress" | "completed";
  dueDate?: Date | null;
  completed_at?: Date | null;
  position?: number;
}

export interface UpdateTaskInput {
  title?: string;
  assignedTo?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in_progress" | "completed";
  due_date?: Date | null;
  completed_at?: Date | null;
  position?: number;
}

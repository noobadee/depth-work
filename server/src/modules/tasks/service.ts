import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "@/common/errors/index.ts";
import type { Task } from "@/db/schema/tasks.ts";
import type {
  CreateTaskInput,
  ITaskRepository,
  ITaskService,
  UpdateTaskInput,
} from "@/modules/tasks/types.ts";

export class TaskService implements ITaskService {
  constructor(private readonly repo: ITaskRepository) {}

  async getTasks(workspaceId: string): Promise<Task[] | null> {
    const tasks = await this.repo.findAllByWorkspace(workspaceId);

    if (!tasks || tasks.length === 0) {
      throw new NotFoundError("Task");
    }

    return tasks;
  }

  async getTasksUnderProject(projectId: string): Promise<Task[] | null> {
    const tasks = await this.repo.findAllByProject(projectId);

    if (!tasks || tasks.length === 0) {
      throw new NotFoundError("Task");
    }

    return tasks;
  }

  async getTask(id: string): Promise<Task | null> {
    const task = await this.repo.findById(id);

    if (!task) {
      throw new NotFoundError("Task");
    }

    return task;
  }

  async createTask(
    creatorId: string,
    workspaceId: string,
    body: CreateTaskInput,
  ): Promise<Task | null> {
    const existingTask = await this.repo.findByTitle(body.title);

    if (existingTask) {
      throw new ConflictError("Task already exists in a project");
    }

    const newTask = await this.createTask(creatorId, workspaceId, body);

    if (!newTask) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for task creation",
      );
    }

    return newTask;
  }

  async createTaskUnderProject(
    creatorId: string,
    workspaceId: string,
    projectId: string,
    body: CreateTaskInput,
  ): Promise<Task | null> {
    const existingTask = await this.repo.findByTitleUnderProject(
      body.title,
      projectId,
    );

    if (existingTask) {
      throw new ConflictError("Task already exists in a project");
    }

    const newTask = await this.createTaskUnderProject(
      creatorId,
      workspaceId,
      projectId,
      body,
    );

    if (!newTask) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for task creation",
      );
    }

    return newTask;
  }

  async updateTask(id: string, body: UpdateTaskInput): Promise<Task | null> {
    if (Object.keys(body).length === 0) {
      throw new ValidationError("The body cannot be empty");
    }

    const updatedTask = await this.repo.update(id, body);

    if (!updatedTask) {
      throw new DatabaseError(
        "Update succeeded but no row was returned for task update",
      );
    }

    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    await this.getTask(id);
    await this.repo.delete(id);
  }
}

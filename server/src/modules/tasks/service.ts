import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "@/common/errors/index.ts";
import { UserRepository } from "@/modules/auth/repository.ts";
import { ProjectRepository } from "@/modules/projects/repository.ts";
import type { Task } from "@/db/schema/index.ts";
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
      throw new ConflictError("Task already exists");
    }

    const newTask = await this.repo.createTaskUnderWorkspace({
      ...body,
      createdBy: creatorId,
      workspace_id: workspaceId,
    });

    if (!newTask) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for task creation",
      );
    }

    return newTask;
  }

  async createTaskUnderProject(
    creatorId: string,
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

    const projectRepo = new ProjectRepository();

    const project = await projectRepo.findById(projectId);

    if (!project) {
      throw new NotFoundError("Project");
    }

    const newTask = await this.repo.createTaskUnderProject({
      ...body,
      createdBy: creatorId,
      workspace_id: project.workspaceId,
      projectId,
    });

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

    if (body.assignedTo) {
      const userRepo = new UserRepository();
      const user = await userRepo.findById(body.assignedTo);
      if (!user) {
        throw new NotFoundError("User");
      }
    }

    let updatedTask;
    if (body.status === "completed") {
      updatedTask = await this.repo.update(id, {
        ...body,
        completed_at: new Date(),
      });
    } else {
      updatedTask = await this.repo.update(id, body);
    }

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

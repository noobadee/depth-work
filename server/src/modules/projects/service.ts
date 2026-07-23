import {
  ConflictError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/common/errors/index.ts";
import type { Project } from "@/db/schema/projects.ts";
import type {
  CreateProjectInput,
  IProjectRepository,
  IProjectService,
  UpdateProjectInput,
} from "@/modules/projects/types.ts";

export class ProjectService implements IProjectService {
  constructor(private readonly repo: IProjectRepository) {}

  async getProjects(workspaceId: string): Promise<Project[]> {
    const projects = await this.repo.findAllByWorkspace(workspaceId);

    if (!projects || projects.length === 0) {
      throw new NotFoundError("Project");
    }

    return projects;
  }

  async getProject(id: string): Promise<Project> {
    const project = await this.repo.findById(id);

    if (!project) {
      throw new NotFoundError("Project");
    }

    return project;
  }

  async createProject(
    creatorId: string,
    workspaceId: string,
    body: CreateProjectInput,
  ): Promise<Project> {
    const existingProject = await this.repo.findByTitle(body.title);

    if (existingProject) {
      throw new ConflictError("Project already exists");
    }

    const newProject = await this.repo.create({
      ...body,
      createdBy: creatorId,
      workspaceId,
    });

    if (!newProject) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for project creation",
      );
    }

    return newProject;
  }

  async updateProject(
    id: string,
    body: Partial<UpdateProjectInput>,
  ): Promise<Project> {
    if (Object.keys(body).length === 0) {
      throw new ValidationError("The body cannot be empty");
    }

    const updatedProject = await this.repo.update(id, body);

    if (!updatedProject) {
      throw new DatabaseError(
        "Update succeeded but no row was returned for project update",
      );
    }

    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    const project = await this.repo.findById(id);

    if (!project) {
      throw new NotFoundError("Project");
    }

    await this.repo.delete(id);
  }
}

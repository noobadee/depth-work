import {
  ConflictError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
} from "@/common/errors/index.ts";
import type { Workspace } from "@/db/schema/index.ts";
import type {
  CreateWorkspaceInput,
  IWorkspaceRepository,
  IWorkspaceService,
  UpdateWorkspaceInput,
} from "@/modules/workspaces/types.ts";

export class WorkspaceService implements IWorkspaceService {
  constructor(private readonly repo: IWorkspaceRepository) {}

  async getWorkspaces(userId: string): Promise<Workspace[]> {
    const workspaces = await this.repo.findAllByOwner(userId);

    if (!workspaces || workspaces.length === 0) {
      throw new NotFoundError("Workspace");
    }

    return workspaces;
  }

  async getWorkspace(id: string, userId: string): Promise<Workspace> {
    const workspace = await this.repo.findById(id);

    if (!workspace) {
      throw new NotFoundError("Workspace");
    }

    if (workspace.ownerId !== userId) {
      throw new ForbiddenError("You do not have access to this workspace");
    }

    return workspace;
  }

  async createWorkspace(data: CreateWorkspaceInput): Promise<Workspace> {
    const existing = await this.repo.findByName(data.name);

    if (existing) {
      throw new ConflictError("Workspace name already exists");
    }

    const newWorkspace = await this.repo.create(data);

    if (!newWorkspace) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for workspace creation",
      );
    }

    return newWorkspace;
  }

  async updateWorkspace(
    id: string,
    userId: string,
    data: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    await this.getWorkspace(id, userId); // verify existence and ownership

    const duplicateName = await this.repo.findByName(data.name);

    if (duplicateName) {
      throw new ConflictError("Workspace name already exists");
    }

    const updatedWorkspace = await this.repo.update(id, data);

    if (!updatedWorkspace) {
      throw new DatabaseError(
        "Update succeeded but no row was returned for workspace update",
      );
    }

    return updatedWorkspace;
  }

  async deleteWorkspace(id: string, userId: string): Promise<void> {
    await this.getWorkspace(id, userId); // verify existence and ownership
    await this.repo.delete(id);
  }
}

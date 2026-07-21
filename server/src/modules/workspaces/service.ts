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

  async getWorkspaces(ownerId: string): Promise<Workspace[]> {
    const workspaces = await this.repo.findAllByOwner(ownerId);

    if (!workspaces || workspaces.length === 0) {
      throw new NotFoundError("Workspace");
    }

    return workspaces;
  }

  async getWorkspace(id: string, ownerId: string): Promise<Workspace> {
    const workspace = await this.repo.findById(id);

    if (!workspace) {
      throw new NotFoundError("Workspace");
    }

    if (workspace.ownerId !== ownerId) {
      throw new ForbiddenError("You do not have access to this workspace");
    }

    return workspace;
  }

  async createWorkspace(
    ownerId: string,
    body: CreateWorkspaceInput,
  ): Promise<Workspace> {
    const existing = await this.repo.findByName(body.name);

    if (existing) {
      throw new ConflictError("Workspace name already exists");
    }

    const newWorkspace = await this.repo.create({ ...body, ownerId });

    if (!newWorkspace) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for workspace creation",
      );
    }

    return newWorkspace;
  }

  async updateWorkspace(
    id: string,
    ownerId: string,
    body: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    await this.getWorkspace(id, ownerId); // verify existence and ownership

    const duplicateName = await this.repo.findByName(body.name);

    if (duplicateName) {
      throw new ConflictError("Workspace name already exists");
    }

    const updatedWorkspace = await this.repo.update(id, body);

    if (!updatedWorkspace) {
      throw new DatabaseError(
        "Update succeeded but no row was returned for workspace update",
      );
    }

    return updatedWorkspace;
  }

  async deleteWorkspace(id: string, ownerId: string): Promise<void> {
    await this.getWorkspace(id, ownerId); // verify existence and ownership
    await this.repo.delete(id);
  }
}

import { ForbiddenError, NotFoundError } from "@/common/errors/index.ts";
import type { Workspace } from "@/db/schema/workspaces.ts";
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

    if (!workspaces) {
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
    const newWorkspace = await this.repo.create({
      name: data.name,
      type: data?.type,
      ownerId: data.userId,
    });

    if (!newWorkspace) {
      throw new Error(
        "Unexpected error occurred: Unable to create a new workspace",
      );
    }

    return newWorkspace;
  }

  async updateWorkspace(
    id: string,
    userId: string,
    data: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    await this.getWorkspace(id, userId);

    const updatedWorkspace = await this.repo.update(id, data);

    if (!updatedWorkspace) {
      throw new Error(
        "Unexpected error occurred: Unable to create a new workspace",
      );
    }

    return updatedWorkspace;
  }

  async deleteWorkspace(id: string, userId: string): Promise<void> {
    await this.getWorkspace(id, userId);
    await this.repo.delete(id);
  }
}
